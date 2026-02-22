<template>

  <v-card class="pa-3 elevation-2">
    <div class="d-flex align-center" style="cursor:pointer;" @click="toggleExpanded(item.id)">
      <v-avatar class="mr-3" size="48" @click="router.push(`/${item.type}/${item.id}`)">
        <v-img v-if="item.imageUrl" cover :src="item.imageUrl" />
        <v-icon v-else color="grey-darken-1" size="32">mdi-image-outline</v-icon>
      </v-avatar>

      <div class="flex-grow-1" style="min-width: 0;" @click="router.push(`/${item.type}/${item.id}`)">
        <div class="font-weight-bold text-truncate">
          {{ item.name }}
        </div>
      </div>

      <v-btn icon size="28" variant="text" @click.stop="toggleExpanded(item.id)">
        <v-icon>{{ expandedItems[item.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </div>

    <!--
            <div>
                <div class="text-caption text-grey-darken-1 text-center mb-n2">{{ t('entityHomeCard.reliabilityNote') }}</div>
                <v-slider v-model="entity.reliabilityScore" :color="color" thumb-size="0" hide-details max="100" min="0"
                readonly :step="1" />
            </div>
            -->

    <v-expand-transition>
      <div v-if="expandedItems[item.id]">
        <v-divider class="my-3" />
        <v-row class="mx-1 mt-2 mb-2 justify-space-between">
          <div v-if="item.description">
            <div class="text-caption text-grey-darken-1 d-flex align-center">
              <v-icon class="mr-1" color="info" size="16">mdi-information-outline</v-icon>
            </div>
            <div>{{ item.description }}</div>
          </div>
        </v-row>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts" setup>
  import type { SearchableItem } from '@/types/searchable-item.type'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const router = useRouter()
  const props = defineProps<{
    item: SearchableItem
  }>()
  const expandedItems = ref<{ [id: string]: boolean }>({})

  function toggleExpanded (id: string) {
    for (const k of Object.keys(expandedItems.value)) {
      if (k != id) expandedItems.value[k] = false
    }
    expandedItems.value[id] = !expandedItems.value[id]
  }

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
