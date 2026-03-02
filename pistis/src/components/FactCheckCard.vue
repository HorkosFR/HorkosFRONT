<template>
  <v-card>
    <v-row>
      <v-col cols="12" md="9">
        <v-card-title class="d-flex align-center text-body-1 font-weight-semibold">
          <div class="d-flex align-center">
            <v-tooltip location="top" text="Nom complet">
              <template #activator="{ props }">
                <span v-bind="props">
                  {{ fc.title }}
                </span>
              </template>
              <template #default><span>{{ fc.title }}</span></template>
            </v-tooltip>

            <ReportButton class="report-btn" :target-id="fc.id" target-type="fact" />
          </div>
        </v-card-title>
        <div class="mb-1">
          {{ fc.justification }}
        </div>

        <div class="text-disabled">
          <v-btn
            v-if="auth.isAuthenticated"
            color="primary"
            :disabled="preview"
            icon="mdi-pencil-outline"
            size="medium"
            variant="plain"
            @click="updateFactCheckDialog = true"
          />
          {{ t('factcheckCard.by') }} {{ fc.user ? fc.user.username : t('factcheckCard.unknownUser') }}, {{
            t('factcheckCard.the') }} {{
            formatDate(fc.date)
          }}
        </div>

      </v-col>

      <v-col class="mt-md-1 d-flex flex-column align-center justify-center" cols="12" md="3">
        <small v-if="auth.isAuthenticated" class="text-disabled mb-md-1">
          {{ t('factcheckCard.validate') }}
        </small>

        <div v-if="auth.isAuthenticated" class="d-flex align-center justify-center gap-3">
          <v-btn
            color="primary"
            :disabled="preview || isUpVoted()"
            :icon="isUpVoted() ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
            variant="text"
            @click="submitVote(props.fc, true)"
          />
          <v-btn
            color="error"
            :disabled="preview || isDownVoted()"
            :icon="isDownVoted() ? 'mdi-thumb-down' : 'mdi-thumb-down-outline'"
            variant="text"
            @click="submitVote(props.fc, false)"
          />
        </div>

        <div class="w-100 mt-md-n2 px-4">
          <v-slider
            :color="getColorForScore(fc.score)"
            height="8"
            hide-details
            max="100"
            min="0"
            :model-value="fc.score || 0"
            readonly
            rounded
            :step="1"
            thumb-size="0"
          />
        </div>

        <small class="text-disabled mt-n1">
          {{ t('factcheckCard.relevence') }}
        </small>
      </v-col>
    </v-row>
    <v-divider class="my-1" />
    <div class="d-flex justify-space-between align-center">
      <v-btn
        class="mt-2"
        density="comfortable"
        :disabled="preview"
        size="small"
        variant="text"
        @click="fc.showSources = !fc.showSources"
      >
        <v-icon class="mr-1" size="small">
          {{ fc.showSources ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <div v-if="mdAndUp">
          {{ fc.showSources ? t('factcheckCard.hideSource') : t('factcheckCard.displaySource') }}
        </div>
        <div v-if="!mdAndUp">
          {{ t('factcheckCard.source') }}
        </div>
      </v-btn>
      <v-btn
        v-if="auth.isAuthenticated && mdAndUp"
        color="primary"
        density="comfortable"
        size="small"
        variant="text"
        @click.stop="openAddSourceDialog()"
      >
        {{ t('factcheckCard.addSource') }}
      </v-btn>
      <v-btn
        v-if="auth.isAuthenticated && !mdAndUp"
        color="primary"
        size="small"
        variant="text"
        @click.stop="openAddSourceDialog()"
      >
        {{ t('factcheckCard.add') }}
      </v-btn>
    </div>

    <v-expansion-transition>
      <div v-show="fc.showSources" class="mt-2">
        <v-list density="compact">
          <v-list-item v-for="src in fc.factCheckSources" :key="src.source.id" class="px-2 py-1">
            <div class="font-weight-medium">
              {{ src.source.title }}
              <span class="text-disabled">
                ({{ getSourceTypeLabel(src.source.sourceType) }}, {{ src.source.author }})
              </span>
            </div>
            <a v-if="src.source.url" class="text-primary" :href="src.source.url" target="_blank">
              <v-icon>mdi-magnify</v-icon> {{ t('factcheckCard.openSource') }}
            </a>
            <v-list-item-subtitle class="text-disabled mt-1">
              <v-btn
                v-if="auth.isAuthenticated"
                color="primary"
                :disabled="preview"
                icon="mdi-pencil-outline"
                size="medium"
                variant="plain"
                @click="openUpdateSourceDialog(src.source)"
              />
              {{ t('factInfoCard.published') }} {{ formatDate(src.source.publicationDate) }}
            </v-list-item-subtitle>

          </v-list-item>
        </v-list>
      </div>
    </v-expansion-transition>
  </v-card>
  <SourceCreateDialog
    v-model="addSourceDialog"
    :target-id="fc.id"
    @cancel="addSourceDialog = false"
    @confirm="handleSourceCreated"
  />
  <FactCheckUpdateDialog
    v-model="updateFactCheckDialog"
    :fact-check="fc"
    @cancel="updateFactCheckDialog = false"
    @confirm="handleFactCheckUpdated"
  />
  <SourceUpdateDialog
    v-if="selectedSource"
    v-model="updateSourceDialog"
    :source="selectedSource"
    @cancel="updateSourceDialog = false"
    @confirm="handleSourceUpdated"
  />
</template>

<script lang="ts" setup>
  import type { FactCheck } from '@/types/fact-check.type'
  import type { NewSource, Source } from '@/types/source.type'
  import type { Vote } from '@/types/vote.type'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useDisplay } from 'vuetify'
  import FactCheckUpdateDialog from '@/components/FactCheckUpdateDialog.vue'
  import ReportButton from '@/components/ReportButton.vue'
  import { useAuthStore } from '@/stores/auth'
  import { SourceType } from '@/types/source-type.enum'
  import SourceCreateDialog from './SourceCreateDialog.vue'
  import SourceUpdateDialog from './SourceUpdateDialog.vue'

  const { t } = useI18n()
  const { mdAndUp } = useDisplay()
  const auth = useAuthStore()
  const props = defineProps<{
    fc: FactCheck
    votes: Vote[]
    preview: boolean
  }>()

  const addSourceDialog = ref(false)
  const updateSourceDialog = ref(false)
  const updateFactCheckDialog = ref(false)
  const selectedSource = ref<Source | null>()

  const emit = defineEmits<{
    (e: 'factcheck-vote', payload: { fc: FactCheck, isValid: boolean }): void
    (e: 'update-factcheck', payload: { factcheck: FactCheck }): void
    (e: 'new-source', payload: { source: NewSource }): void
    (e: 'update-source', payload: { source: Source, targetId: string }): void
  }>()

  function submitVote (fc: FactCheck, isValid: boolean) {
    emit('factcheck-vote', { fc: fc, isValid: isValid })
  }

  function isUpVoted () {
    if (!props.votes) return false
    const vote = props.votes.find(v => v.targetId == props.fc.id && v.type == 'upvote')
    if (!vote) return false
    return true
  }

  function isDownVoted () {
    if (!props.votes) return false
    const vote = props.votes.find(v => v.targetId == props.fc.id && v.type == 'downvote')
    if (!vote) return false
    return true
  }

  function getSourceTypeLabel (srcType: string) {
    return SourceType[srcType as keyof typeof SourceType] ?? srcType
  }

  function openAddSourceDialog () {
    addSourceDialog.value = true
  }

  function openUpdateSourceDialog (src: Source) {
    selectedSource.value = src
    updateSourceDialog.value = true
  }

  function handleSourceCreated (payload: { source: NewSource }) {
    emit('new-source', { source: payload.source })
    addSourceDialog.value = false
  }

  function handleSourceUpdated (payload: { source: Source }) {
    emit('update-source', { source: payload.source, targetId: props.fc.id })
    updateSourceDialog.value = false
    selectedSource.value = null
  }

  function handleFactCheckUpdated (payload: { factcheck: FactCheck }) {
    emit('update-factcheck', { factcheck: payload.factcheck })
    updateFactCheckDialog.value = false
  }

  function getColorForScore (score?: number | null): string {
    if (!score) return 'secondary'
    if (score <= 30) return 'error'
    if (score <= 60) return 'orange'
    if (score <= 80) return 'yellow'
    return 'accent'
  }

  function formatDate (d: Date | null | undefined) {
    if (!d) return ''
    return new Date(d).toLocaleDateString()
  }
</script>

<style>
.title-root {
  font-size: 20px;
  width: 100%;
  gap: 8px;
  padding-right: 8px;
}

@media (max-width: 600px) {
  .title-root {
    font-size: 16px;
    width: 100%;
    gap: 8px;
    padding-right: 8px;
  }
}

.title-left {
  min-width: 0;
  gap: 8px;
  align-items: center;
}

.title-text {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  /* CRUCIAL */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

.report-btn {
  flex: 0 0 auto;
  margin-left: 8px;
  position: relative;
  top: -3px;
}

.title-actions {
  flex: 1 1 auto;
  justify-content: right;
  gap: 8px;
  align-items: center;
}
</style>
