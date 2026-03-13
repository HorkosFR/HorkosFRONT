<template>
  <v-container class="pa-4" fluid>
    <v-row align="start" justify="space-between" no-gutters>
      <v-col cols="12" md="8">
        <v-card v-if="!mdAndUp" class="ma-md-4 my-2" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">{{ $t('home.horkosTitle') }}</v-card-title>
          <v-divider />
          <v-card-text class="text-justify">
            {{ $t('home.horkosContent') }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/us">{{ $t('home.learnmore') }}</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="ma-md-4 my-2" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">{{ $t('home.first') }}</v-card-title>
          <v-divider />
          <v-divider />
          <v-card-text>
            <template v-if="isLoading">
              <v-row>
                <v-col v-for="n in 3" :key="n" cols="12" md="4">
                  <v-skeleton-loader class="ma-2" type="card" />
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-row>
                <v-col v-for="item in items" :key="item.id" cols="12" md="4">
                  <ItemHomeCard v-if="mdAndUp" :item="item.item" />
                  <ItemHomeMobileCard v-else :item="item.item" />
                </v-col>
              </v-row>
              <v-alert v-if="items.length === 0" class="mt-4" type="info" variant="tonal">
                {{ $t('home.noEntity') }}
              </v-alert>
            </template>
          </v-card-text>
        </v-card>
        <v-card class="ma-md-4 my-2" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">{{ $t('home.latestFacts') }}</v-card-title>
          <v-divider />
          <v-divider />
          <v-card-text>
            <template v-if="isLoading">
              <v-row>
                <v-col v-for="n in 3" :key="n" cols="12" md="4">
                  <v-skeleton-loader class="ma-2" type="card" />
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-row v-for="fact in facts" :key="fact.id">
                <FactHomeCard class="my-2 mx-4 w-100" :item="fact" />
              </v-row>
              <v-alert v-if="items.length === 0" class="mt-4" type="info" variant="tonal">
                {{ $t('home.noFacts') }}
              </v-alert>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card v-if="mdAndUp" class="ma-md-4 my-2" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">{{ $t('home.horkosTitle') }}</v-card-title>
          <v-divider />
          <v-card-text class="text-justify">
            {{ $t('home.horkosContent') }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/us">{{ $t('home.learnmore') }}</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="ma-md-4 my-2" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">{{ $t('home.donation') }}</v-card-title>
          <v-divider />
          <v-card-text class="d-flex align-center justify-center">
            <span class="text-disabled">{{ $t('home.soon') }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import type { HomeFact } from '@/types/fact.type'
  import type { FeaturedItem } from '@/types/featured-item.type'
  import { useHead } from '@unhead/vue'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useDisplay } from 'vuetify'
  import FactHomeCard from '@/components/FactHomeCard.vue'
  import ItemHomeCard from '@/components/ItemHomeCard.vue'
  import ItemHomeMobileCard from '@/components/ItemHomeMobileCard.vue'
  import factService from '@/services/fact.service'
  import featuredItemService from '@/services/featured-item.service'

  useHead({
    title: 'Horkos | Archiver les faits, vérifier les promesses',
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'Horkos',
          'url': 'https://horkos.fr',
        }),
      },
    ],
    meta: [
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Horkos' },
      { property: 'og:title', content: 'Horkos - Plateforme citoyenne' },
      { property: 'og:description', content: 'On archive les déclarations politiques des personnalités politiques. Rejoignez l\'expérimentation !' },
      { property: 'og:image', content: 'https://horkos.fr/HorkosIcon.ico' },
    ],
  })

  const { t } = useI18n()

  const { mdAndUp } = useDisplay()

  const items = ref<FeaturedItem[]>([])
  const isLoading = ref(true)
  const facts = ref<HomeFact[]>([])

  async function loadItems () {
    try {
      isLoading.value = true
      const data = await featuredItemService.getFeaturedItems()
      const factsPayload = await factService.getLatestFacts()
      facts.value = factsPayload

      items.value = data
    } catch (error) {
      console.error('Erreur lors du chargement des entités :', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadItems()
  })
</script>

<style scoped>
.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover-elevate {
  transition: all 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
