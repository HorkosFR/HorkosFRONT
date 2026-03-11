<template>
  <div class="preview-sticky">
    <v-card class="pa-3" elevation="3">
      <v-card-title class="d-flex align-center title-root">
        <v-btn
          v-if="auth.isAdministrator"
          color="primary"
          :disabled="preview"
          icon="mdi-pencil-outline"
          size="medium"
          :to="`/entity/${fact.entityId}/fact/${fact.id}/edit`"
          variant="plain"
        />
        <div class="title-left d-flex align-center">
          <v-tooltip location="top" text="Nom complet">
            <template #activator="{ props }">
              <span v-bind="props" class="title-text">
                {{ fact.title }}
              </span>
            </template>
            <template #default><span>{{ fact.title }}</span></template>
          </v-tooltip>

          <ReportButton class="report-btn" :target-id="fact.id" target-type="fact" />
        </div>

        <div v-if="mdAndUp" class="title-actions d-flex align-center">
          <v-btn
            v-if="!fact.isGoodAction"
            class="action-btn"
            color="error"
            readonly
            variant="outlined"
          >
            <span class="hidden-sm-and-down">{{ t('factInfoCard.bad') }}</span>
            <v-icon end>mdi-thumb-down-outline</v-icon>
          </v-btn>

          <v-btn
            v-else
            class="action-btn"
            color="primary"
            readonly
            variant="outlined"
          >
            <span class="hidden-sm-and-down">{{ t('factInfoCard.good') }}</span>
            <v-icon end>mdi-thumb-up-outline</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-chip
        v-for="tag in fact.tabTags"
        :key="tag"
        class="ml-2"
        :color="fact.isGoodAction ? 'primary' : 'error'"
        density="comfortable"
        :ripple="false"
        size="small"
        variant="outlined"
      >
        {{ getTagLabel(tag) }}
      </v-chip>
      <v-divider class="mb-2 mt-2" />

      <v-card-text>
        <div class="row-outline" :class="fact.isGoodAction ? 'good-border' : 'bad-border'">
          <v-row>
            <v-col cols="7" md="8" sm="4">
              <div class="fact-label" :class="fact.isGoodAction ? 'text-primary' : 'text-error'">{{
                t('factInfoCard.context')
              }}</div>
            </v-col>
            <v-col class="text-right text-disabled" cols="5" md="4" sm="4">
              {{ formatDate(fact.startDate) }} {{ fact.endDate ? " - " + formatDate(fact.endDate) : ""
              }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <div class="fact-text pb-2 pb-md-0">{{ fact.context }}</div>
            </v-col>
          </v-row>
        </div>

        <div
          v-if="fact.type === FactType.PublicStatement"
          class="mt-4 pa-4 rounded-lg"
          style="background-color: #F8FAFC; border-left: 4px solid #DDD1BA;"
        >
          <div
            class="text-body-2 text-slate-700"
            style="font-family: 'Lora', serif; font-style: italic; color: #374151; line-height: 1.8;"
            v-html="fact.statement"
          />
        </div>
        <v-row>
          <v-col cols="12" md="12">
            <div
              class="fact-text markdown-body"
              :class="fact.isGoodAction ? 'good' : 'bad'"
              v-html="renderedMarkdown"
            />
          </v-col>
        </v-row>
        <div v-if="!preview">
          <v-divider class="my-4" />
          <v-row class="align-center d-flex justify-space-between mb-2">
            <v-col cols="9" md="6">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">
                {{ t('factInfoCard.linkedFactcheck') }}
              </h3>
            </v-col>
            <v-col class="text-right" cols="3" md="6">
              <v-btn
                v-if="auth.isAuthenticated && mdAndUp"
                color="primary"
                density="comfortable"
                size="small"
                variant="text"
                @click="openAddFactCheckDialog()"
              >
                {{ t('factInfoCard.addFactcheck') }}
              </v-btn>
              <v-btn
                v-if="auth.isAuthenticated && !mdAndUp"
                color="primary"
                density="comfortable"
                icon
                size="small"
                variant="outlined"
                @click="openAddFactCheckDialog()"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-list v-if="fact.factChecks.length > 0" density="comfortable">
            <v-list-item
              v-for="fc in fact.factChecks"
              :key="fc.id"
              class="mb-2 rounded-lg border px-3 py-2 align-start"
            >
              <FactCheckCard
                :fc="fc"
                :preview="preview"
                :votes="votes"
                @factcheck-vote="updateReliability"
                @new-source="handleFactCheckSourceCreated"
                @update-factcheck="submitUpdatedFactCheck"
                @update-source="handleFactCheckSourceUpdated"
              />
            </v-list-item>

          </v-list>

          <v-alert
            v-else
            class="mt-2"
            density="comfortable"
            type="info"
            variant="tonal"
          >
            {{ t('factInfoCard.nofactcheck') }}
          </v-alert>

          <v-divider class="my-4" />
          <v-row class="align-center d-flex justify-space-between mb-2">
            <v-col cols="9" md="6">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">
                {{ t('factInfoCard.linkedSource') }}
              </h3>
            </v-col>
            <v-col class="text-right" cols="3" md="6">
              <v-btn
                v-if="auth.isAuthenticated && mdAndUp"
                color="primary"
                density="comfortable"
                size="small"
                variant="text"
                @click="openAddSourceDialog()"
              >
                {{ t('factInfoCard.addSource') }}
              </v-btn>
              <v-btn
                v-if="auth.isAuthenticated && !mdAndUp"
                color="primary"
                density="comfortable"
                icon
                size="small"
                variant="outlined"
                @click="openAddSourceDialog()"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-list v-if="fact.factSources.length > 0" density="comfortable">
            <v-list-item
              v-for="src in fact.factSources"
              :key="src.source.id"
              class="mb-2 rounded-lg border px-3 py-2 align-start"
            >
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
                  v-if="auth.isAdministrator"
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

          <v-alert
            v-else
            class="mt-2"
            density="comfortable"
            type="info"
            variant="tonal"
          >
            {{ t('factInfoCard.nosource') }}
          </v-alert>

          <FactCheckCreateDialog
            v-model="addFactCheckDialog"
            :target-id="fact.id"
            @cancel="addFactCheckDialog = false"
            @confirm="submitNewFactCheck"
          />
          <v-row>
            <v-col cols="12" md="6">
              <v-card
                class="pa-md-3 mt-4"
                elevation="3"
                prepend-icon="mdi-vector-link"
                :title="t('factInfoCard.consistentTitle')"
              >
                <v-card-text>
                  <div class="text-body-2 mb-2">
                    {{ t('factInfoCard.currentScore') }}
                    <span v-if="fact.reliabilityVoteAmount">
                      ({{ fact.reliabilityVoteAmount }} {{ t('factInfoCard.votes') }})
                    </span>
                    :
                  </div>
                  <v-slider
                    :color="factReliabilityColor"
                    hide-details
                    :max="100"
                    :min="1"
                    :model-value="getReliabilityScore()"
                    readonly
                    step="1"
                    thumb-label
                    thumb-size="0"
                  />
                  <v-btn-toggle
                    v-if="auth.isAuthenticated"
                    v-model="reliabilityVote"
                    class="d-flex justify-center mb-4"
                    mandatory
                    variant="outlined"
                  >
                    <v-tooltip location="top" :text="t('factInfoCard.consistent1')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="error" icon :value="1">
                          <v-icon>mdi-circle-off-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip location="top" :text="t('factInfoCard.consistent2')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="error" icon :value="25">
                          <v-icon>mdi-circle-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip location="top" :text="t('factInfoCard.consistent3')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="yellow" icon :value="50">
                          <v-icon>mdi-circle-double</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip location="top" :text="t('factInfoCard.consistent4')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="orange" icon :value="75">
                          <v-icon>mdi-bullseye</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip location="top" :text="t('factInfoCard.consistent5')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="accent" icon :value="100">
                          <v-icon>mdi-bullseye-arrow</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </v-btn-toggle>
                  <div v-if="auth.isAuthenticated">
                    <v-btn
                      v-if="!hasReliabilityVote"
                      block
                      :color="reliabilityColor"
                      :disabled="preview"
                      @click="submitReliabilityVote"
                    >
                      {{ t('factInfoCard.consistentVote') }}
                    </v-btn>
                    <v-btn
                      v-if="hasReliabilityVote && oldReliabilityVote != reliabilityVote"
                      block
                      :color="reliabilityColor"
                      :disabled="preview"
                      @click="updateReliabilityVote"
                    >
                      {{ t('factInfoCard.updateVote') }}
                    </v-btn>
                    <v-btn
                      v-if="hasReliabilityVote && oldReliabilityVote == reliabilityVote"
                      append-icon="mdi-check-circle-outline"
                      block
                      color="primary"
                      variant="outlined"
                    >
                      {{ t('factInfoCard.alreadyVote') }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card
                class="pa-md-3 mt-4"
                elevation="3"
                prepend-icon="mdi-gauge"
                :title="t('factInfoCard.importantTitle')"
              >
                <v-card-text>
                  <div class="text-body-2 mb-2">
                    {{ t('factInfoCard.currentScore') }}
                    <span v-if="fact.gravityVoteAmount">
                      ({{ fact.gravityVoteAmount }} {{ t('factInfoCard.votes') }})
                    </span>
                    :
                  </div>
                  <v-slider
                    :color="factGravityColor"
                    hide-details
                    :max="100"
                    :min="1"
                    :model-value="getGravityScore()"
                    readonly
                    step="1"
                    thumb-label
                    thumb-size="5"
                  />
                  <v-btn-toggle
                    v-if="auth.isAuthenticated"
                    v-model="gravityVote"
                    class="d-flex justify-center mb-4"
                    mandatory
                    variant="outlined"
                  >
                    <v-tooltip location="top" :text="t('factInfoCard.important1')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="accent" icon :value="1">
                          <v-icon>mdi-circle-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip location="top" :text="t('factInfoCard.important2')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="yellow" icon :value="25">
                          <v-icon>mdi-alert-circle-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip location="top" :text="t('factInfoCard.important3')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="orange" icon :value="50">
                          <v-icon>mdi-alert-rhombus-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip location="top" :text="t('factInfoCard.important4')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="error" icon :value="75">
                          <v-icon>mdi-alert-octagon-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip location="top" :text="t('factInfoCard.important5')">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" color="error" icon :value="100">
                          <v-icon>mdi-alert-decagram-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </v-btn-toggle>
                  <div v-if="auth.isAuthenticated">
                    <v-btn
                      v-if="!hasGravityVote"
                      block
                      :color="gravityColor"
                      :disabled="preview"
                      @click="submitGravityVote"
                    >
                      {{ t('factInfoCard.importantVote') }}
                    </v-btn>
                    <v-btn
                      v-if="hasGravityVote && oldGravityVote != gravityVote"
                      block
                      :color="gravityColor"
                      :disabled="preview"
                      @click="updateGravityVote"
                    >
                      {{ t('factInfoCard.updateVote') }}
                    </v-btn>
                    <v-btn
                      v-if="hasGravityVote && oldGravityVote == gravityVote"
                      append-icon="mdi-check-circle-outline"
                      block
                      color="primary"
                      variant="outlined"
                    >
                      {{ t('factInfoCard.alreadyVote') }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <SourceUpdateDialog
    v-if="selectedSource"
    v-model="updateSourceDialog"
    :source="selectedSource"
    @cancel="updateSourceDialog = false"
    @confirm="handleSourceUpdated"
  />
  <SourceCreateDialog
    v-model="addSourceDialog"
    :target-id="fact.id"
    @cancel="addSourceDialog = false"
    @confirm="handleSourceCreated"
  />
</template>

<script lang="ts" setup>
  import type { FactCheck, NewFactCheck } from '@/types/fact-check.type'
  import type { Fact } from '@/types/fact.type'
  import type { NewSource, Source } from '@/types/source.type'
  import type { Vote } from '@/types/vote.type'
  import DOMPurify from 'dompurify'
  import { marked } from 'marked'
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useDisplay } from 'vuetify'
  import FactCheckCard from '@/components/FactCheckCard.vue'
  import FactCheckCreateDialog from '@/components/FactCheckCreateDialog.vue'
  import ReportButton from '@/components/ReportButton.vue'
  import FactCheckService from '@/services/fact-check.service'
  import sourceService from '@/services/source.service'
  import voteService from '@/services/vote.service'
  import { useAuthStore } from '@/stores/auth'
  import { FactTag } from '@/types/fact-tag.enum'
  import { FactType } from '@/types/fact-type.enum'
  import { SourceType } from '@/types/source-type.enum'
  import SourceCreateDialog from './SourceCreateDialog.vue'
  import SourceUpdateDialog from './SourceUpdateDialog.vue'

  const { t } = useI18n()
  const { mdAndUp } = useDisplay()
  const auth = useAuthStore()
  const addFactCheckDialog = ref(false)
  const addSourceDialog = ref(false)
  const updateSourceDialog = ref(false)
  const reliabilityVote = ref(100)
  const gravityVote = ref(1)
  const oldReliabilityVote = ref(0)
  const oldGravityVote = ref(0)
  const hasReliabilityVote = ref(false)
  const hasGravityVote = ref(false)
  const selectedSource = ref<Source | null>()

  const props = defineProps<{
    fact: Fact
    votes: Vote[] | null
    preview: boolean
  }>()

  onMounted(loadVotes)

  const renderedMarkdown = computed(() => {
    if (!props.fact.content) return ''

    const rawHtml = marked.parse(props.fact.content)
    return DOMPurify.sanitize(rawHtml)
  })

  const emit = defineEmits<{
    (e: 'new-source', payload: { source: Source, type: string, targetId: string }): void
    (e: 'update-source', payload: { source: Source, type: string, targetId: string }): void
    (e: 'new-factcheck', payload: { factCheck: FactCheck }): void
    (e: 'update-factcheck', payload: { factcheck: FactCheck }): void
    (e: 'new-vote', payload: { vote: Vote }): void
  }>()

  function getGravityScore () {
    if (props.fact.gravityScore) {
      return props.fact.isGoodAction ? props.fact.gravityScore : props.fact.gravityScore * (-1)
    } else {
      return 0
    }
  }

  function getReliabilityScore () {
    if (props.fact.reliabilityScore) {
      return props.fact.isGoodAction ? props.fact.reliabilityScore : props.fact.reliabilityScore * (-1)
    } else {
      return 0
    }
  }

  function loadVotes () {
    if (props.votes && props.votes.length > 0) {
      const relVote = props.votes.find(v => v.type == 'reliability')
      if (relVote != null) {
        reliabilityVote.value = props.fact.isGoodAction ? relVote.value : relVote.value * (-1)
        oldReliabilityVote.value = props.fact.isGoodAction ? relVote.value : relVote.value * (-1)
        hasReliabilityVote.value = true
      }
      const gravVote = props.votes.find(v => v.type == 'gravity')
      if (gravVote != null) {
        oldGravityVote.value = props.fact.isGoodAction ? gravVote.value : gravVote.value * (-1)
        gravityVote.value = props.fact.isGoodAction ? gravVote.value : gravVote.value * (-1)
        hasGravityVote.value = true
      }
    }
  }

  function formatDate (d: Date | null | undefined) {
    if (!d) return ''
    return new Date(d).toLocaleDateString()
  }

  function getTagLabel (tagKey: string) {
    return FactTag[tagKey as keyof typeof FactTag] ?? tagKey
  }

  const reliabilityColor = computed(() => {
    if (!reliabilityVote.value) return 'secondary'
    if (reliabilityVote.value <= 25) return 'error'
    if (reliabilityVote.value <= 50) return 'orange'
    if (reliabilityVote.value <= 75) return 'yellow'
    return 'accent'
  })

  const factReliabilityColor = computed(() => {
    if (!props.fact.reliabilityScore || !props.fact.reliabilityScore) return 'secondary'
    const score = props.fact.isGoodAction ? props.fact.reliabilityScore : props.fact.reliabilityScore * (-1)
    if (score <= 25) return 'error'
    if (score <= 50) return 'orange'
    if (score <= 75) return 'yellow'
    return 'accent'
  })

  const gravityColor = computed(() => {
    if (!gravityVote.value) return 'secondary'
    if (gravityVote.value >= 75) return 'error'
    if (gravityVote.value >= 50) return 'orange'
    if (gravityVote.value >= 25) return 'yellow'
    return 'accent'
  })

  const factGravityColor = computed(() => {
    if (!props.fact.gravityScore || !props.fact.gravityScore) return 'secondary'
    const score = props.fact.isGoodAction ? props.fact.gravityScore : props.fact.gravityScore * (-1)
    if (score >= 75) return 'error'
    if (score >= 50) return 'orange'
    if (score >= 25) return 'yellow'
    return 'accent'
  })

  function getSourceTypeLabel (srcType: string) {
    return SourceType[srcType as keyof typeof SourceType] ?? srcType
  }

  function openAddFactCheckDialog () {
    if (!props.fact) return
    addFactCheckDialog.value = true
  }

  function openAddSourceDialog () {
    addSourceDialog.value = true
  }

  function openUpdateSourceDialog (src: Source) {
    selectedSource.value = src
    updateSourceDialog.value = true
  }

  async function submitNewFactCheck (payload: { factCheck: NewFactCheck }) {
    if (!payload.factCheck.title || !payload.factCheck.source.title) {
      alert('Veuillez remplir les champs obligatoires.')
      return
    }
    try {
      const createdFC = await FactCheckService.createFactCheck({ ...payload.factCheck })
      emit('new-factcheck', { factCheck: createdFC })
      addFactCheckDialog.value = false
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la création du fact-check')
    }
  }

  async function submitUpdatedFactCheck (payload: { factcheck: FactCheck }) {
    try {
      const createdFC = await FactCheckService.updateFactCheck(payload.factcheck.id, payload.factcheck)
      emit('update-factcheck', { factcheck: payload.factcheck })
      addFactCheckDialog.value = false
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la création du fact-check')
    }
  }

  async function handleSourceCreated (payload: { source: NewSource }) {
    const createdSource = await sourceService.createSource(payload.source)
    emit('new-source', { source: createdSource, type: 'fact', targetId: payload.source.targetId })
    addSourceDialog.value = false
  }

  async function handleSourceUpdated (payload: { source: Source }) {
    const createdSource = await sourceService.updateSource(payload.source.id, payload.source)
    emit('update-source', { source: payload.source, type: 'fact', targetId: props.fact.id })
    addSourceDialog.value = false
    selectedSource.value = null
  }

  async function handleFactCheckSourceUpdated (payload: { source: Source, targetId: string }) {
    const createdSource = await sourceService.updateSource(payload.source.id, payload.source)
    emit('update-source', { source: payload.source, type: 'factcheck', targetId: payload.targetId })
    addSourceDialog.value = false
  }

  async function handleFactCheckSourceCreated (payload: { source: NewSource }) {
    const createdSource = await sourceService.createSource(payload.source)
    emit('new-source', { source: createdSource, type: 'factcheck', targetId: payload.source.targetId })
    addSourceDialog.value = false
  }

  async function updateReliability (payload: { fc: FactCheck, isValid: boolean }) {
    if (props.votes) {
      const vote = props.votes.find(v => v.targetId == payload.fc.id)
      if (vote) {
        vote.value = payload.isValid ? 1 : -1
        vote.type = payload.isValid ? 'upvote' : 'downvote'
        await voteService.updateVote(vote.id, vote)
        emit('new-vote', { vote: vote })
        loadVotes()
        return
      }
    }
    const newVote = await voteService.createVote({
      targetId: payload.fc.id,
      targetType: 'FactCheck',
      value: payload.isValid ? 1 : -1,
      type: payload.isValid ? 'upvote' : 'downvote',
      userId: auth.userId ?? '',
    })
    loadVotes()
    emit('new-vote', { vote: newVote })
  }

  async function submitReliabilityVote () {
    const newVote = await voteService.createVote({
      targetId: props.fact.id,
      targetType: 'Fact',
      value: props.fact.isGoodAction ? reliabilityVote.value : reliabilityVote.value * (-1),
      type: 'reliability',
      userId: auth.userId ?? '',
    })
    loadVotes()
    emit('new-vote', { vote: newVote })
  }

  async function submitGravityVote () {
    const newVote = await voteService.createVote({
      targetId: props.fact.id,
      targetType: 'Fact',
      value: props.fact.isGoodAction ? gravityVote.value : gravityVote.value * (-1),
      type: 'gravity',
      userId: auth.userId ?? '',
    })
    emit('new-vote', { vote: newVote })
    loadVotes()
  }

  async function updateReliabilityVote () {
    if (props.votes) {
      let vote = props.votes.find(v => v.type == 'reliability')
      if (!vote) return
      vote.value = props.fact.isGoodAction ? reliabilityVote.value : reliabilityVote.value * (-1)
      await voteService.updateVote(vote.id, vote)
      emit('new-vote', { vote: vote })
      loadVotes()
    }
  }

  async function updateGravityVote () {
    if (props.votes) {
      let vote = props.votes.find(v => v.type == 'gravity')
      if (!vote) return
      vote.value = props.fact.isGoodAction ? gravityVote.value : gravityVote.value * (-1)
      await voteService.updateVote(vote.id, vote)
      emit('new-vote', { vote: vote })
      loadVotes()
    }
  }
</script>

<style>
.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}

.markdown-body {
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface));
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-body a {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.markdown-body.good h1,
.markdown-body.good h2,
.markdown-body.good h3 {
  color: rgb(var(--v-theme-primary));
}

.markdown-body.bad h1,
.markdown-body.bad h2,
.markdown-body.bad h3 {
  color: rgb(var(--v-theme-error));
}

.markdown-body code {
  background-color: #F3F4F6;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: monospace;
}

.markdown-body blockquote {
  border-left: 4px solid #e0e0e0;
  padding-left: 16px;
  margin: 16px 0;
  color: #616161;
  font-style: italic;
  background-color: #f5f5f5;
  padding-top: 8px;
  padding-bottom: 8px;
}

.markdown-body pre {
  background-color: #F3F4F6;
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-body ul {
  margin-left: 20px;
  list-style-type: disc;
}

.fact-label {
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.fact-text {
  font-size: 1rem;
  line-height: 1.8;
}

.info-label {
  display: flex;
  align-items: center;
}

.filter-card {
  transition: all 0.2s ease;
}

.info-value {
  margin-left: 26px;
}

.row-outline {
  border: 1px solid;
  border-radius: 8px;
  padding: 12px;
}

.good-border {
  border-color: rgb(var(--v-theme-primary));
}

.bad-border {
  border-color: rgb(var(--v-theme-error));
}

.entity-view {
  overflow: hidden;
}

.scrollable {
  overflow-y: auto;
  max-height: 100%;
}

.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}

.filter-card {
  transition: all 0.2s ease;
}

.filter-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.fact-label {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-left: 4px solid;
  padding-left: 8px;
  margin-bottom: 4px;
}

.fact-text {
  line-height: 1.5;
}

.fact-card {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

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

.action-btn {
  flex: 0 0 auto;
  min-width: auto !important;
}

.hover-elevate {
  transition: all 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
