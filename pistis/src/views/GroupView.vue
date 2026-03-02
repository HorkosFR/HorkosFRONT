<template>
  <v-container class="pa-md-4" fluid>
    <v-row no-gutters>
      <v-col v-if="group" class="pa-md-4 d-flex flex-column" cols="12" md="3">
        <CommentPanelLoading v-if="isLoading" />
        <GroupInfoMobileCard
          v-if="!mdAndUp && !isLoading"
          :group="group"
        />
        <CommentsPanel
          v-if="mdAndUp && !isLoading"
          comment-type="group"
          :comments="comments"
          :entity-id="group.id"
          :votes="commentVotes"
          @comment-vote="addCommentVote"
        />
      </v-col>

      <v-col class="pa-md-4 pt-4 d-flex flex-column" cols="12" md="6">
        <template v-if="!isLoading && group">
          <v-card class="mb-md-2 mb-4 pa-md-4 filter-card" elevation="3">
            <v-card-title class="d-flex justify-space-between align-center">
              <v-row class="pl-4 pl-md-0 pr-4 pr-md-0">
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="filters.search"
                    clearable
                    color="primary"
                    hide-details
                    :label="t('groupview.search')"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>

          <v-card class="pa-md-3" elevation="3">
            <v-card-title class="d-flex justify-space-between align-center">
              {{ t('groupview.entities') }}
              <v-btn
                v-if="auth.isAuthenticated"
                color="primary"
                density="comfortable"
                size="small"
                variant="text"
                @click="addDialog = true"
              >
                {{ t('groupview.associate') }}
              </v-btn>
            </v-card-title>
            <v-divider class="mb-2" />

            <v-card-text>
              <v-row v-if="!isLoading && group">
                <v-col v-for="entity in filteredEntities" :key="entity.id" cols="12" md="4">
                  <EntityHomeCard v-if="mdAndUp" :entity="entity" />
                  <EntityHomeMobileCard v-else :entity="entity" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>

        <template v-else>
          <v-container class="pa-4 text-center">
            <v-skeleton-loader class="ma-2" type="card" />
            <p class="mt-2">{{ t('groupview.loadingentity') }}</p>
          </v-container>
        </template>
      </v-col>

      <v-col class="pa-md-4 pt-4" cols="12" md="3">
        <template v-if="!isLoading && group">
          <CommentsPanel
            v-if="!mdAndUp"
            comment-type="group"
            :comments="comments"
            :entity-id="group.id"
            :votes="commentVotes"
            @comment-vote="addCommentVote"
          />
          <GroupInfoCard v-else :group="group" @updated="updateGroup" />
        </template>

        <template v-else>
          <v-container class="pa-4 text-center">
            <ItemInfoCardLoading />
          </v-container>
        </template>
      </v-col>
    </v-row>
  </v-container>

  <EntitySearchDialog
    v-model="addDialog"
    @cancel="addDialog = false"
    @create="createEntity"
    @select="selectEntity"
  />
</template>

<script lang="ts" setup>
  import type { Comment } from '@/types/comment.type'
  import type { Entity } from '@/types/entity.type'
  import type { Group } from '@/types/group.type'
  import type { Vote } from '@/types/vote.type'
  import { useHead } from '@unhead/vue'
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { useRoute, useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import CommentPanelLoading from '@/components/CommentPanelLoading.vue'
  import CommentsPanel from '@/components/CommentsPanel.vue'
  import EntityHomeCard from '@/components/EntityHomeCard.vue'
  import EntityHomeMobileCard from '@/components/EntityHomeMobileCard.vue'
  import EntitySearchDialog from '@/components/EntitySearchDialog.vue'
  import GroupInfoCard from '@/components/GroupInfoCard.vue'
  import GroupInfoMobileCard from '@/components/GroupInfoMobileCard.vue'
  import ItemInfoCardLoading from '@/components/ItemInfoCardLoading.vue'
  import CommentService from '@/services/comment.service'
  import groupService from '@/services/group.service'
  import voteService from '@/services/vote.service'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute<'Group'>()
  const groupId = computed(() => {
    const id = route.params.id
    return typeof id === 'string' ? id.trim() : ''
  })
  const group = ref<Group | null>(null)
  const isLoading = ref(true)
  const errorMessage = ref<string | null>(null)

  const comments = ref<Comment[]>([])
  const commentVotes = ref<Vote[]>([])
  const entities = ref<Entity[]>([])

  const auth = useAuthStore()
  const { mdAndUp } = useDisplay()

  useHead({
    title: computed(() => {
      if (isLoading.value) return 'Horkos | Chargement...'
      return group.value?.name ? `Horkos | Fiabilité globale - ${group.value.name}` : 'Horkos | Groupe'
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
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Horkos' },
      { property: 'og:title', content: computed(() => `Fiabilité globale - ${group.value?.name ?? '...'} | Horkos`) },
      { property: 'og:description', content: 'On archive les déclarations politiques des personnalités politiques. Rejoignez l\'expérimentation !' },
      { property: 'og:image', content: computed(() => group.value?.imageUrl || 'http://horkos.fr/HorkosIcon.ico') },
    ],
  })

  async function loadData () {
    try {
      isLoading.value = true
      const results = await Promise.allSettled([
        groupService.getGroupById(groupId.value),
        CommentService.getCommentsByEntityId(groupId.value),
        voteService.getVoteByTargetIdCurrentUser(groupId.value),
      ])

      const [groupRes, commentRes, voteRes] = results

      if (groupRes.status === 'fulfilled') {
        group.value = groupRes.value
        entities.value = Array.isArray(groupRes.value.groupEntities)
          ? groupRes.value.groupEntities.map(ge => ge.entity)
          : []
      } else {
        throw groupRes.reason
      }

      comments.value = commentRes.status === 'fulfilled' ? commentRes.value : []
      commentVotes.value = voteRes.status === 'fulfilled' ? voteRes.value : []
    } catch (error) {
      console.error('Erreur de chargement:', error)
      errorMessage.value = 'Impossible de charger les données.'
    } finally {
      isLoading.value = false
    }
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

  onMounted(loadData)

  function updateGroup (payload: { group: Group }) {
    group.value = payload.group
  }

  const addDialog = ref(false)

  async function selectEntity (entities: Entity[]) {
    const result = groupService.linkEntityGroup({ entityIds: entities.map(e => e.id) }, groupId.value)
    addDialog.value = false
  }

  async function createEntity () {
    router.push(`/create-entity?groupId=${groupId.value}`)
  }

  const filters = ref({
    search: '',
  })

  const filteredEntities = computed(() => {
    return entities.value.filter(entity => {
      const matchesSearch
        = !filters.value.search
          || entity.name.toLowerCase().includes(filters.value.search.toLowerCase())

      return matchesSearch
    })
  })
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
  border-left: 4px solid ;
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
