<template>
  <v-card class="pa-4 elevation-3 rounded-lg hover-elevate" :to="`/entity/${entity.id}`">

    <div class="d-flex justify-space-between align-center mb-3">

      <div class="flex-grow-1 d-flex align-center" style="min-width: 0;">
        <v-tooltip location="top" text="Nom complet">
          <template #activator="{ props }">
            <span
              v-bind="props"
              class="text-h6 font-weight-bold text-truncate"
              style="max-width: 90%; display: inline-block;"
            >
              {{ entity.name }}
            </span>
          </template>
          <template #default>
            <span>{{ entity.name }}</span>
          </template>
        </v-tooltip>
        <ReportButton class="ml-2" style="position: relative;" :target-id="entity.id" target-type="entity" />
      </div>
    </div>

    <v-img
      v-if="entity.imageUrl"
      aspect-ratio="1"
      class="rounded-lg mb-4"
      cover
      :src="entity.imageUrl"
    />

    <v-sheet v-else class="d-flex align-center justify-center bg-grey-lighten-3 rounded-lg mb-4" height="180">
      <v-icon color="grey-darken-1" size="64">mdi-image-outline</v-icon>
    </v-sheet>

    <!-- NOTE FIABILITÉ -->
    <!--
            <div>
                <div v-if="entity.reliabilityScore !== null">
                    <div class="d-flex justify-space-between align-center mb-1">
                        <span class="text-grey-darken-1">{{ t('entityHomeCard.reliabilityNote') }}</span>
                        <span class="text-grey-darken-2">
                            {{ entity.reliabilityVoteAmount || 0 }} {{ t('entityHomeCard.votes') }}
                        </span>
                    </div>

                    <v-slider v-model="entity.reliabilityScore" hide-details :step="1" min="0" max="100" readonly
                    thumb-size="0" :color="color" />
                </div>

            <div v-else class="text-grey-darken-1">
                {{ t('entityHomeCard.novote') }}
                <v-slider model-value="0" disabled thumb-size="0" hide-details min="0" max="100" />
            </div>
        </div>
        -->

    <v-divider class="my-1" />

    <div class="text-body-2 text-grey-darken-3">
      <div v-if="entity.shortBio" class="mt-2 text-grey-darken-2 text-truncate-3-lines">
        <v-icon class="mr-2" color="info" size="18">mdi-information-outline</v-icon>
        {{ shortenBio }}
      </div>

    </div>

  </v-card>
</template>
<script lang="ts" setup>
  import type { Entity } from '@/types/entity.type'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ReportButton from '@/components/ReportButton.vue'

  const { t } = useI18n()
  const props = defineProps<{
    entity: Entity
  }>()

  const shortenBio = computed(() => {
    if (props.entity.shortBio && props.entity.shortBio.length > 203)
      return (props.entity.shortBio.slice(0, 200) + '...')
    return props.entity.shortBio
  })

  const color = computed(() => {
    const score = props.entity.reliabilityScore || 0
    if (score < 25) return 'error'
    if (score < 50) return 'orange'
    if (score < 75) return 'yellow'
    return 'accent'
  })
</script>
