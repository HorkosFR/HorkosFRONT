<template>
  <v-card class="pa-4 elevation-3 rounded-lg hover-elevate" :to="`/${item.type}/${item.id}`">

    <div class="d-flex justify-space-between align-center mb-3">

      <div class="flex-grow-1 d-flex align-center" style="min-width: 0;">
        <v-tooltip location="top" text="Nom complet">
          <template #activator="{ props }">
            <span
              v-bind="props"
              class="text-h6 font-weight-bold text-truncate"
              style="max-width: 90%; display: inline-block;"
            >
              {{ item.name }}
            </span>
          </template>
          <template #default>
            <span>{{ item.name }}</span>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-img
      v-if="item.imageUrl"
      class="rounded-lg mb-4 mx-auto"
      cover
      :src="item.imageUrl"
      width="50%"
    />

    <v-sheet v-else class="d-flex align-center justify-center bg-grey-lighten-3 rounded-lg mb-4" height="180">
      <v-icon color="grey-darken-1" size="64">mdi-image-outline</v-icon>
    </v-sheet>

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
      <div v-if="item.description" class="mt-2 text-grey-darken-2 text-truncate-3-lines">
        {{ item.description }}
      </div>

    </div>

  </v-card>
</template>
<script lang="ts" setup>
  import type { SearchableItem } from '@/types/searchable-item.type'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const props = defineProps<{
    item: SearchableItem
  }>()

/*
const color = computed(() => {
    const score = props.item.reliabilityScore || 0
    if (score < 25) return 'error'
    if (score < 50) return 'orange'
    if (score < 75) return 'yellow'
    return 'accent'
})
*/
</script>
