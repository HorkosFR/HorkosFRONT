<template>
  <div class="preview-sticky">
    <v-card class="pa-4 elevation-3">
      <div class="d-flex justify-space-between align-center mb-2">

        <div class="flex-grow-1 d-flex align-center" style="min-width: 0;">
          <v-tooltip location="top" text="Nom complet">
            <template #activator="{ props }">
              <span
                v-bind="props"
                class="text-h6 font-weight-bold text-truncate"
                style="max-width: 85%; display: inline-block;"
              >
                {{ group.name }}
              </span>
            </template>
            <template #default>
              <span>{{ group.name }}</span>
            </template>
          </v-tooltip>
          <ReportButton
            class="ml-2"
            style="position: relative;"
            :target-id="group.id"
            target-type="group"
          />
        </div>
        <v-btn
          v-if="auth.isAuthenticated"
          color="primary"
          icon="mdi-pencil-outline"
          size="medium"
          variant="plain"
          @click="groupDialog = true"
        />
      </div>

      <v-img
        v-if="group.imageUrl"
        class="rounded-lg mb-3 mx-auto"
        cover
        :src="group.imageUrl"
        width="50%"
      />
      <v-sheet v-else class="d-flex align-center justify-center bg-grey-lighten-3 rounded-lg mb-3" height="250">
        <v-icon color="grey-darken-1" size="80">mdi-image-outline</v-icon>
      </v-sheet>

      <!-- NOTE DE FIABILITÉ -->
      <!--
            <div v-if="group.reliabilityScore">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-grey-darken-1">
                  {{ t('groupInfoCard.reliabilitynote') }}
                </span>
              </div>
              <v-slider v-model="group.reliabilityScore" :color="color" thumb-size="0" hide-details max="100" min="0" readonly :step="1" />
            </div>
            <div v-else>
              <div>
                {{ t('groupInfoCard.nodata') }}
              </div>
              <v-slider color="grey" disabled hide-details max="100" min="0" model-value="0" :step="1" thumb-size="0"
              track-color="grey" />
            </div>
            -->

      <v-divider class="my-4" />

      <div v-if="group.description" class="info-item info-bio my-2">
        <div class="info-value">
          {{ group.description }}
        </div>
      </div>
    </v-card>
  </div>
  <GroupUpdateDialog
    v-model="groupDialog"
    :group="group"
    @cancel="groupDialog = false"
    @confirm="updateGroup"
  />
</template>

<script lang="ts" setup>
  import type { Group } from '@/types/group.type'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ReportButton from '@/components/ReportButton.vue'
  import groupService from '@/services/group.service'
  import { useAuthStore } from '@/stores/auth'
  import GroupUpdateDialog from './GroupUpdateDialog.vue'

  const auth = useAuthStore()
  const { t } = useI18n()
  const props = defineProps<{
    group: Group
  }>()

  const emit = defineEmits<{
    (e: 'updated', payload: { group: Group }): void
  }>()

  const groupDialog = ref(false)

  async function updateGroup (payload: { group: Group }) {
    await groupService.updateGroup(payload.group.id, payload.group)
    emit('updated', payload)
    groupDialog.value = false
  }

  const color = computed(() => {
    if (!props.group.reliabilityScore) return 'secondary'
    if (props.group.reliabilityScore < 25) return 'error'
    if (props.group.reliabilityScore < 50) return 'orange'
    if (props.group.reliabilityScore < 75) return 'yellow'
    if (props.group.reliabilityScore <= 100) return 'accent'
    return 'secondary'
  })
</script>

<style scoped>
.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}

.info-label {
  display: flex;
  align-items: center;
}

.info-value {
  margin-left: 26px;
}
</style>
