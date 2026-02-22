<template>

  <v-card class="pa-3 elevation-2 mobile-card">
    <div class="d-flex align-center" style="cursor:pointer;" @click="toggleExpanded(entity.id)">
      <v-avatar class="mr-3" size="48" @click="router.push(`/entity/${entity.id}`)">
        <v-img v-if="entity.imageUrl" cover :src="entity.imageUrl" />
        <v-icon v-else color="grey-darken-1" size="32">mdi-image-outline</v-icon>
      </v-avatar>

      <div class="flex-grow-1" style="min-width: 0;" @click="router.push(`/entity/${entity.id}`)">
        <div class="font-weight-bold text-truncate">
          {{ entity.name }}
        </div>
      </div>

      <v-btn icon size="28" variant="text" @click.stop="toggleExpanded(entity.id)">
        <v-icon>{{ expandedItems[entity.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
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
      <div v-if="expandedItems[entity.id]">
        <v-divider class="my-3" />

        <v-row class="mx-1 mt-2 mb-3 justify-space-between">
          <div v-if="entity.country">
            <div class="d-flex">
              <v-icon class="mr-1" color="success" size="16">mdi-earth</v-icon>
              {{ entity.country }}</div>
          </div>

          <div v-if="entity.foundedDate || entity.birthDate">
            <div class=" d-flex align-center">
              <v-icon class="mr-1" color="warning" size="16">mdi-calendar</v-icon>
              {{ formattedDate(entity) }}</div>
          </div>

        </v-row>

        <v-row class="mx-1 mt-2 mb-2 justify-space-between">
          <div v-if="entity.sector">
            <div class="d-flex">
              <v-icon class="mr-1" color="secondary" size="16">mdi-briefcase</v-icon>
              {{ entity.sector }}</div>
          </div>
        </v-row>
        <v-row class="mx-1 mt-2 mb-2 justify-space-between">
          <div v-if="entity.shortBio">
            <div class="text-caption text-grey-darken-1 d-flex align-center">
              <v-icon class="mr-1" color="info" size="16">mdi-information-outline</v-icon>
            </div>
            <div>{{ shortenBio }}</div>
          </div>
        </v-row>

        <div v-if="entity.links && entity.links.length > 0">
          <v-divider class="my-2" />
          <div class="text-caption text-grey-darken-1 mb-2">{{ t('entityHomeCard.link') }}</div>
          <v-list density="compact">
            <v-list-item v-for="(link, i) in entity.links" :key="i" class="py-1">
              <a class="text-primary text-decoration-none" :href="link" target="_blank">
                <v-icon class="mr-1" color="primary" size="14">mdi-link-variant</v-icon>
                {{ shortenLink(link) }}
              </a>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Entity } from '@/types/entity.type'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const router = useRouter()
  const props = defineProps<{
    entity: Entity
  }>()
  const expandedItems = ref<{ [id: string]: boolean }>({})

  function toggleExpanded (id: string) {
    for (const k of Object.keys(expandedItems.value)) {
      if (k != id) expandedItems.value[k] = false
    }
    expandedItems.value[id] = !expandedItems.value[id]
  }
  const color = computed(() => {
    const score = props.entity.reliabilityScore || 0
    if (score < 25) return 'error'
    if (score < 50) return 'orange'
    if (score < 75) return 'yellow'
    return 'accent'
  })

  function formattedDate (e: Entity) {
    return e.foundedDate
      ? new Date(e.foundedDate).toLocaleDateString()
      : (e.birthDate
        ? new Date(e.birthDate).toLocaleDateString()
        : '')
  }

  const shortenBio = computed(() => {
    if (props.entity.shortBio && props.entity.shortBio.length > 203)
      return (props.entity.shortBio.slice(0, 200) + '...')
    return props.entity.shortBio
  })

  function shortenLink (link: string) {
    try {
      const url = new URL(link)
      return url.hostname.replace('www.', '')
    } catch {
      return link
    }
  }
</script>
