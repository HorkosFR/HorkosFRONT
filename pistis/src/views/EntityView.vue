<template>
  <v-container class="pa-md-4" fluid>
    <v-row no-gutters>
      <v-col v-if="entity" class="pa-md-4 d-flex flex-column" cols="12" md="3">
        <CommentPanelLoading v-if="isLoading" />
        <EntityInfoMobileCard v-if="!mdAndUp && !isLoading" :entity="entity" :preview="false" />
        <CommentsPanel
          v-if="mdAndUp && !isLoading"
          comment-type="entity"
          :comments="comments"
          :entity-id="entity.id"
          :votes="commentVotes"
          @comment-vote="addCommentVote"
        />
      </v-col>

      <v-col class="pa-md-4 pt-4 d-flex flex-column" cols="12" md="6">
        <template v-if="!isLoading && entity">
          <v-card class="mb-md-2 mb-4 pa-md-4 filter-card" elevation="3">
            <v-card-title class="d-flex justify-space-between align-center">
              {{ $t('entity.search.title') }}
              <v-btn color="primary" icon variant="text" @click="showFilters = !showFilters">
                <v-icon>{{ showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-title>

            <v-expand-transition>
              <div v-if="showFilters">
                <v-divider class="mb-2" />

                <v-row class="pl-4 pl-md-0 pr-4 pr-md-0">
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="filters.search"
                      clearable
                      color="primary"
                      hide-details
                      :label="t('entity.search.label')"
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
                <v-row class="pl-4 pl-md-0 pr-4 pr-md-0">
                  <v-col cols="12" md="9">
                    <v-select
                      v-model="filters.tag"
                      chips
                      clearable
                      color="primary"
                      hide-details
                      item-title="title"
                      item-value="value"
                      :items="availableTags"
                      :label="t('entity.search.tags')"
                      multiple
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="filters.type"
                      clearable
                      color="primary"
                      hide-details
                      :items="[
                        { title: t('entity.search.all'), value: null },
                        { title: t('entity.search.good'), value: 'good' },
                        { title: t('entity.search.bad'), value: 'bad' },
                      ]"
                      :label="t('entity.search.actionType')"
                      variant="outlined"
                    />
                  </v-col>

                </v-row>

                <v-row class="pb-4 pb-md-0 pr-4 pr-md-0">
                  <v-col class="d-flex justify-end">
                    <v-btn color="primary" variant="flat" @click="resetFilters">
                      {{ t('entity.search.reinit') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card>

          <v-card class="pa-md-3" elevation="3">
            <v-card-title class="d-flex justify-space-between align-center">
              {{ t('entity.timeline.title') }}
              <v-btn
                v-if="auth.isAuthenticated"
                color="primary"
                density="comfortable"
                size="small"
                variant="text"
                @click="addDialog = true"
              >
                {{ t('entity.timeline.addFact') }}
              </v-btn>
            </v-card-title>
            <v-divider class="mb-2" />

            <v-card-text>
              <v-row v-if="!isLoading && entity">
                <v-col v-for="fact in filteredFacts" :key="fact.id" cols="12">
                  <RouterLink class="text-decoration-none" :to="`/entity/${entity.id}/fact/${fact.id}`">
                    <v-card class="fact-card pa-md-3 hover-elevate" color="white" outlined style="cursor:pointer">
                      <v-card-title class="d-flex align-center title-root">
                        <div class="title-left d-flex align-center">
                          <v-tooltip location="top" text="Nom complet">
                            <template #activator="{ props }">
                              <span v-bind="props" class="title-text">
                                {{ fact.title }}
                              </span>
                            </template>
                            <template #default><span>{{ fact.title }}</span></template>
                          </v-tooltip>

                          <ReportButton class="report-btn" :target-id="fact.id" target-type="entity" />
                        </div>

                        <div v-if="mdAndUp" class="title-actions d-flex align-center">
                          <v-btn
                            v-if="!fact.isGoodAction"
                            class="action-btn"
                            color="error"
                            readonly
                            variant="outlined"
                          >
                            <span class="hidden-sm-and-down">{{ t('entity.timeline.bad') }}</span>
                            <v-icon end>mdi-thumb-down-outline</v-icon>
                          </v-btn>

                          <v-btn
                            v-else
                            class="action-btn"
                            color="primary"
                            readonly
                            variant="outlined"
                          >
                            <span class="hidden-sm-and-down">{{ t('entity.timeline.good') }}</span>
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
                      <v-divider class="mt-2" />
                      <v-card-text>
                        <v-row :no-gutters="!mdAndUp">
                          <v-col class="pb-1" cols="7" md="8" sm="4">
                            <div class="fact-label" :class="fact.isGoodAction ? 'text-primary' : 'text-error'">{{
                              t('entity.timeline.context')
                            }}</div>
                          </v-col>
                          <v-col class="pb-1 pb-md-4 text-right text-disabled" cols="5" md="4" sm="4">
                            {{ formatDate(fact.startDate) }} {{ fact.endDate ? " - " + formatDate(fact.endDate) : ""
                            }}
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col>
                            <div class="fact-text pb-2 mb-2">{{ fact.context }}</div>
                            <p>{{ fact.summary }}</p>
                            <v-divider class="my-2" />
                          </v-col>
                        </v-row>
                        <v-row class="mt-2" no-gutters>
                          <div class="fact-label" :class="fact.isGoodAction ? 'text-primary' : 'text-error'">{{
                            t('entity.timeline.votes') }}
                          </div>
                        </v-row>
                        <v-row class="mt-2" no-gutters>
                          <v-col>
                            <v-slider
                              :color="factReliabilityColor(fact)"
                              hide-details
                              :max="100"
                              :min="1"
                              :model-value="getReliabilityScore(fact)"
                              readonly
                              step="1"
                              thumb-label
thumb-size="0"
                            >
                              <template #prepend>
                                <v-tooltip location="top" :text="t('entity.timeline.consistency')">
                                  <template #activator="{ props }">
                                    <v-icon :size="mdAndUp ? 'x-small' : ''" v-bind="props">mdi-vector-link</v-icon>
                                  </template>
                                </v-tooltip>
                              </template>
                            </v-slider>
                          </v-col>
                          <v-col>
                            <v-slider
                              :color="factGravityColor(fact)"
                              hide-details
                              :max="100"
                              :min="1"
                              :model-value="getGravityScore(fact)"
                              readonly
                              step="1"
                              thumb-label
                              thumb-size="0"
                            >
                              <template #prepend>
                                <v-tooltip location="top" :text="t('entity.timeline.importance')">
                                  <template #activator="{ props }">
                                    <v-icon :size="mdAndUp ? 'x-small' : ''" v-bind="props">mdi-gauge</v-icon>
                                  </template>
                                </v-tooltip>
                              </template>
                            </v-slider>
                          </v-col>
                        </v-row>
                        <v-row class="mt-2">
                          <v-col>
                            <div class="text-caption text-grey-darken-1">
                              <v-icon>mdi-note-check-outline</v-icon> {{ fact.factChecks ? fact.factChecks.length : 0
                              }} {{ t('entity.timeline.factcheck') }}{{
                                (fact.factChecks ? fact.factChecks.length : 0) > 1 ? 's' :
                                '' }}
                            </div>
                          </v-col>
                          <v-col>
                            <div class="text-caption text-grey-darken-1 text-end">
                              <v-icon>mdi-magnify</v-icon> {{ (fact.factSources ? fact.factSources.length : 0) }}
                              {{ t('entity.timeline.source') }}{{
                                (fact.factSources ? fact.factSources.length : 0) > 1 ? 's' :
                                '' }}
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </RouterLink>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>

        <template v-else>
          <v-container class="pa-4 text-center">
            <FactInfoCardLoading />
          </v-container>
        </template>
      </v-col>

      <v-col class="pa-md-4 pt-4" cols="12" md="3">
        <template v-if="!isLoading && entity">
          <CommentsPanel
            v-if="!mdAndUp"
            comment-type="entity"
            :comments="comments"
            :entity-id="entity.id"
            :votes="commentVotes"
            @comment-vote="addCommentVote"
          />
          <EntityInfoCard v-else :entity="entity" :entity-view="true" :preview="false" />
        </template>

        <template v-else>
          <v-container class="pa-4 text-center">
            <ItemInfoCardLoading />
          </v-container>
        </template>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="addDialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ t('entity.timeline.factDialog.title') }}
      </v-card-title>
      <v-card-text>
        <div class="mb-4" v-html="t('entity.timeline.factDialog.description')" />
        <a class="text-primary text-decoration-none" href="/us?tab=createFact" target="_blank">
          {{ t('entity.timeline.factDialog.link') }}
          <v-icon class="ml-1" color="primary" size="14">mdi-open-in-new</v-icon>
        </a>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="addDialog = false">{{ t('entity.timeline.factDialog.cancel') }}</v-btn>
        <v-btn color="primary" @click="goToFactCreation">{{ t('entity.timeline.factDialog.validate') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script lang="ts" setup>
  import type { Comment } from '@/types/comment.type'
  import type { Entity } from '@/types/entity.type'
  import type { Fact } from '@/types/fact.type'
  import type { Vote } from '@/types/vote.type'
  import { useHead } from '@unhead/vue'
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  import { useDisplay } from 'vuetify'
  import CommentPanelLoading from '@/components/CommentPanelLoading.vue'
  import CommentsPanel from '@/components/CommentsPanel.vue'
  import EntityInfoCard from '@/components/EntityInfoCard.vue'
  import EntityInfoMobileCard from '@/components/EntityInfoMobileCard.vue'
  import FactInfoCardLoading from '@/components/FactInfoCardLoading.vue'
  import ItemInfoCardLoading from '@/components/ItemInfoCardLoading.vue'
  import ReportButton from '@/components/ReportButton.vue'
  import CommentService from '@/services/comment.service'
  import EntityService from '@/services/entity.service'
  import voteService from '@/services/vote.service'
  import { useAuthStore } from '@/stores/auth'
  import { FactTag } from '@/types/fact-tag.enum'
  import { SourceType } from '@/types/source-type.enum'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const entityId = computed(() => {
    const id = route.params.id
    return typeof id === 'string' ? id.trim() : ''
  })
  const entity = ref<Entity | null>(null)
  const isLoading = ref(true)
  const errorMessage = ref<string | null>(null)

  const comments = ref<Comment[]>([])
  const commentVotes = ref<Vote[]>([])
  const facts = ref<Fact[]>([])

  const auth = useAuthStore()
  const expandedTab = ref<Record<string, string>>({})
  const { mdAndUp } = useDisplay()

  function getGravityScore (fact: Fact) {
    if (fact.gravityScore) {
      return fact.isGoodAction ? fact.gravityScore : fact.gravityScore * (-1)
    } else {
      return 0
    }
  }

  function getReliabilityScore (fact: Fact) {
    if (fact.reliabilityScore) {
      return fact.isGoodAction ? fact.reliabilityScore : fact.reliabilityScore * (-1)
    } else {
      return 0
    }
  }

  async function loadData () {
    try {
      isLoading.value = true
      const [entityData, commentData, commentVoteData] = await Promise.all([
        EntityService.getEntityById(entityId.value),
        CommentService.getCommentsByEntityId(entityId.value),
        auth.isAuthenticated ? voteService.getVoteByCommentCurrentUser(entityId.value) : [],
      ])
      entity.value = entityData
      if (entityData.officialLinks) {
        entity.value.links = entityData.officialLinks.split(';')
      }
      commentVotes.value = commentVoteData
      facts.value = Array.isArray(entityData.factEntities) ? entityData.factEntities.map(fe => fe.fact) : []
      for (const f of facts.value) {
        f.tabTags = f.tags.split(';') as FactTag[]
      }
      comments.value = Array.isArray(commentData) ? commentData : []
    } catch (error) {
      console.error('Erreur de chargement:', error)
      errorMessage.value = 'Impossible de charger les données.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadData)

  useHead({
    title: computed(() => {
      if (isLoading.value) return 'Horkos | Chargement...'
      return entity.value?.name ? `Horkos | Bilan de ${entity.value.name}` : 'Horkos | Personnalité'
    }),
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
      { property: 'og:site_name', content: 'Horkos' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: computed(() => `Fiabilité de ${entity.value?.name ?? '...'} | Horkos`) },
      { property: 'og:description', content: 'On archive les déclarations politiques des personnalités politiques. Rejoignez l\'expérimentation !' },
      { property: 'og:image', content: computed(() => 'https://horkos.fr/HorkosIcon.ico') },
    ],
  })

  const addDialog = ref(false)

  function goToFactCreation () {
    addDialog.value = false
    if (entity.value) {
      router.push(`/entity/${entity.value.id}/create-fact/`)
    } else {
      console.warn('Aucune entité chargée, impossible de rediriger.')
    }
  }

  const filters = ref({
    search: '',
    type: null as 'good' | 'bad' | null,
    tag: null as FactTag[] | null,
  })

  const showFilters = ref(false)

  const availableTags = Object.entries(FactTag).map(([key, value]) => ({
    title: value,
    value: key,
  }))

  const filteredFacts = computed(() => {
    return facts.value.filter(fact => {
      const matchesSearch
        = !filters.value.search
          || fact.title.toLowerCase().includes(filters.value.search.toLowerCase())
          || fact.content.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesType
        = !filters.value.type
          || (filters.value.type === 'good' && fact.isGoodAction)
          || (filters.value.type === 'bad' && !fact.isGoodAction)

      const matchesTag
        = !filters.value.tag
          || filters.value.tag.length === 0
          || filters.value.tag.some(tag => fact.tags.includes(tag))

      return matchesSearch && matchesType && matchesTag
    })
  })

  function getTagLabel (tagKey: string) {
    return FactTag[tagKey as keyof typeof FactTag] ?? tagKey
  }

  function addCommentVote (payload: { vote: Vote }) {
    if (!commentVotes.value) return
    const index = commentVotes.value?.findIndex(v => v.id == payload.vote.id)
    let isNew = true
    if (index !== -1 && commentVotes.value[index]) {
      commentVotes.value[index] = payload.vote
      isNew = false
    } else commentVotes.value.push(payload.vote)
    const cIndex = comments.value.findIndex(c => c.id == payload.vote.targetId)
    if (cIndex !== -1 && comments.value[cIndex]) {
      comments.value[cIndex].score += (isNew ? payload.vote.value : payload.vote.value * 2)
    }
  }

  function resetFilters () {
    filters.value = {
      search: '',
      type: null,
      tag: null as FactTag[] | null,
    }
  }

  function formatDate (date: Date | string | null) {
    return date ? new Date(date).toLocaleDateString() : ''
  }

  function factGravityColor (fact: Fact) {
    if (!fact.gravityScore || !fact.gravityScore) return 'secondary'
    const score = fact.isGoodAction ? fact.gravityScore : fact.gravityScore * (-1)
    if (score >= 75) return 'error'
    if (score >= 50) return 'orange'
    if (score >= 25) return 'yellow'
    return 'accent'
  }

  function factReliabilityColor (fact: Fact) {
    if (!fact.reliabilityScore || !fact.reliabilityScore) return 'secondary'
    const score = fact.isGoodAction ? fact.reliabilityScore : fact.reliabilityScore * (-1)
    if (score <= 25) return 'error'
    if (score <= 50) return 'orange'
    if (score <= 75) return 'yellow'
    return 'accent'
  }
</script>

<style scoped>
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
