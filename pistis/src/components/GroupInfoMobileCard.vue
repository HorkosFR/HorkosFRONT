<template>
  <v-card class="pa-3 elevation-2 mobile-card">
    <div class="d-flex align-center" style="cursor:pointer;" @click="toggleExpanded">
      <v-avatar class="mr-3" size="48">
        <v-img v-if="group.imageUrl" cover :src="group.imageUrl" />
        <v-icon v-else color="grey-darken-1" size="32">mdi-image-outline</v-icon>
      </v-avatar>

      <div class="flex-grow-1" style="min-width: 0;">
        <div class="font-weight-bold text-truncate">
          {{ group.name }}
        </div>
      </div>

      <v-btn icon size="28" variant="text" @click.stop="toggleExpanded">
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </div>

    <!-- NOTE DE FIABILITÉ (toujours visible mais compacte) -->
    <!--
      <div class="mt-1">
        <div class="text-caption text-grey-darken-1 text-center mb-n1">{{ t('groupInfoCard.reliabilitynote') }}</div>
        <v-slider
        v-model="group.reliabilityScore"
        :color="color"
        thumb-size="0"
        hide-details
        max="100"
        min="0"
        readonly
        :step="1"
        />
      </div>
      -->

    <v-expand-transition>
      <div v-if="expanded">
        <v-divider class="my-3" />

        <div v-if="group.description" class="mb-3">
          <div>{{ group.description }}</div>
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Group } from '@/types/group.type'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const props = defineProps<{ group: Group }>()

  const expanded = ref(false)
  const toggleExpanded = () => (expanded.value = !expanded.value)

  const color = computed(() => {
    const score = props.group.reliabilityScore || 0
    if (score < 25) return 'error'
    if (score < 50) return 'orange'
    if (score < 75) return 'yellow'
    return 'accent'
  })
</script>

<style scoped>

</style>
