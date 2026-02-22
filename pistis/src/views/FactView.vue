<template>
  <v-container class="pa-4" fluid>
    <v-row no-gutters>
      <v-col v-if="entity" class="pa-md-4 d-flex flex-column" cols="12" md="3">
        <CommentPanelLoading v-if="isLoading" />
        <EntityInfoMobileCard v-if="!mdAndUp && !isLoading" :entity="entity" :preview="false" />
        <CommentsPanel
          v-if="mdAndUp && !isLoading"
          comment-type="fact"
          :comments="comments"
          :entity-id="factId"
          :votes="commentVotes"
          @comment-vote="addCommentVote"
        />
      </v-col>

      <v-col class="pt-2 pa-md-2 d-flex flex-column" cols="12" md="6">
        <template v-if="!isLoading && fact">
          <FactInfoCard
            :fact="fact"
            :preview="false"
            :votes="votes"
            @new-factcheck="addFactCheck"
            @new-source="addSource"
            @new-vote="addVote"
            @update-factcheck="updateFactCheck"
            @update-source="updateSource"
          />
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
            comment-type="fact"
            :comments="comments"
            :entity-id="factId"
            :votes="commentVotes"
            @comment-vote="addCommentVote"
          />
          <EntityInfoCard v-else :entity="entity" :entity-view="false" :preview="false" />
        </template>

        <template v-else>
          <v-container class="pa-4 text-center">
            <ItemInfoCardLoading />
          </v-container>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import type { Comment } from '@/types/comment.type'
  import type { Entity } from '@/types/entity.type'
  import type { FactCheckSource } from '@/types/fact-check-source.type'
  import type { FactCheck } from '@/types/fact-check.type'
  import type { FactSource } from '@/types/fact-source.type'
  import type { FactTag } from '@/types/fact-tag.enum'
  import type { Fact } from '@/types/fact.type'
  import type { Source } from '@/types/source.type'
  import type { Vote } from '@/types/vote.type'
  import { useHead } from '@unhead/vue'
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import CommentPanelLoading from '@/components/CommentPanelLoading.vue'
  import CommentsPanel from '@/components/CommentsPanel.vue'
  import EntityInfoCard from '@/components/EntityInfoCard.vue'
  import EntityInfoMobileCard from '@/components/EntityInfoMobileCard.vue'
  import FactInfoCard from '@/components/FactInfoCard.vue'
  import FactInfoCardLoading from '@/components/FactInfoCardLoading.vue'
  import ItemInfoCardLoading from '@/components/ItemInfoCardLoading.vue'
  import CommentService from '@/services/comment.service'
  import EntityService from '@/services/entity.service'
  import FactService from '@/services/fact.service'
  import voteService from '@/services/vote.service'
  import { useAuthStore } from '@/stores/auth'
  import { FactType } from '@/types/fact-type.enum'

  const { t } = useI18n()
  const route = useRoute()
  const factId = computed(() => {
    const id = route.params.id
    return typeof id === 'string' ? id.trim() : ''
  })

  const entityId = computed(() => {
    const id = route.params.entityId
    return typeof id === 'string' ? id.trim() : ''
  })
  const { mdAndUp } = useDisplay()
  const auth = useAuthStore()

  const fact = ref<Fact | null>(null)
  const entity = ref<Entity | null>(null)
  const votes = ref<Vote[] | null>(null)
  const commentVotes = ref<Vote[] | null>(null)
  const comments = ref<Comment[]>([])
  const isLoading = ref(true)

  useHead({
    title: computed(() => {
      if (isLoading.value) return 'Horkos | Chargement...'
      return entity.value?.name && fact.value?.type ? `Horkos | ${getFactLabel(fact.value.type)} de ${entity.value.name}` : 'Horkos | Fait'
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
      { property: 'og:title', content: computed(() => `Fiabilité de ${entity.value?.name ?? '...'} | Horkos`) },
      { property: 'og:description', content: 'On archive les déclarations politiques des personnalités politiques. Rejoignez l\'expérimentation !' },
      { property: 'og:image', content: computed(() => entity.value?.imageUrl || 'http://horkos.fr/HorkosIcon.ico') },
    ],
  })

  async function loadFact () {
    if (!factId.value) return
    isLoading.value = true
    try {
      fact.value = await FactService.getFactById(factId.value)
      fact.value.tabTags = fact.value.tags.split(';') as FactTag[]
      if (!fact.value) return
      entity.value = await EntityService.getEntityById(entityId.value)
      comments.value = await CommentService.getCommentsByEntityId(factId.value)
      if (auth.isAuthenticated) {
        votes.value = await voteService.getVoteByTargetIdCurrentUser(factId.value)
        commentVotes.value = await voteService.getVoteByCommentCurrentUser(factId.value)
      } else {
        votes.value = []
        commentVotes.value = []
      }
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  function getFactLabel (type: string) {
    return FactType[type as keyof typeof FactType] || type
  }

  async function addSource (payload: { source: Source, type: string, targetId: string }) {
    if (!fact.value) return
    if (payload.type == 'fact') {
      const newFactSource: FactSource = {
        factId: fact.value.id,
        fact: fact.value,
        sourceId: payload.source.id,
        source: payload.source,
      }
      fact.value?.factSources.push(newFactSource)
    } else if (payload.type == 'factcheck') {
      const fc = fact.value.factChecks.find(fc => fc.id == payload.targetId)
      if (fc == undefined) return
      const newFactCheckSource: FactCheckSource = {
        factCheckId: fc.id,
        factCheck: fc,
        sourceId: payload.source.id,
        source: payload.source,
      }
      fc.factCheckSources.push(newFactCheckSource)
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

  function addVote (payload: { vote: Vote }) {
    if (!votes.value) return
    const index = votes.value?.findIndex(v => v.id == payload.vote.id)
    let isNew = true
    if (index !== -1 && votes.value[index]) {
      votes.value[index] = payload.vote
      isNew = false
    } else votes.value.push(payload.vote)
    if (payload.vote.targetId == factId.value && fact.value && fact.value.gravityVoteAmount && fact.value.reliabilityVoteAmount && isNew) {
      payload.vote.type == 'gravity' ? fact.value.gravityVoteAmount += 1 : fact.value.reliabilityVoteAmount += 1
    }
  }

  async function addFactCheck (payload: { factCheck: FactCheck }) {
    if (!fact.value) return
    fact.value.factChecks.push(payload.factCheck)
  }

  async function updateFactCheck (payload: { factcheck: FactCheck }) {
    if (!fact.value) return
    const sIndex = fact.value.factChecks.findIndex(fc => fc.id === payload.factcheck.id)
    if (sIndex !== -1 && fact.value.factChecks[sIndex]) {
      fact.value.factChecks[sIndex] = payload.factcheck
    }
  }

  async function updateSource (payload: { source: Source, type: string, targetId: string }) {
    if (!fact.value) return
    if (payload.type == 'fact') {
      const sIndex = fact.value.factSources.findIndex(fs => fs.sourceId === payload.source.id)
      if (sIndex !== -1 && fact.value.factSources[sIndex]) {
        fact.value.factSources[sIndex].source = payload.source
      }
    } else if (payload.type == 'factcheck') {
      const targetFactCheck = fact.value.factChecks.find(fc => fc.id === payload.targetId)
      if (targetFactCheck) {
        const sIndex = targetFactCheck.factCheckSources.findIndex(fcs => fcs.sourceId === payload.source.id)
        if (sIndex !== -1 && targetFactCheck.factCheckSources[sIndex]) {
          targetFactCheck.factCheckSources[sIndex].source = payload.source
        }
      }
    }
  }

  onMounted(async () => {
    await loadFact()
    if (fact.value && fact.value.factChecks)
      for (const fc of fact.value.factChecks) fc.showSources = false
  })
</script>

<style scoped>
.preview-sticky {
  position: sticky;
  top: 20px;
}

.scrollable {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
</style>
