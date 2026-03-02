<template>
  <div class="preview-sticky">
    <v-card class="pa-md-3 scrollable" elevation="3">
      <v-card-title>{{ t('commentpanel.title') }}</v-card-title>
      <v-divider />

      <v-card-text>
        <v-list v-if="comments && rootComments.length > 0">
          <CommentItem
            v-for="comment in rootComments"
            :key="comment.id"
            :all-comments="comments"
            :comment="comment"
            :votes="votes || []"
            @comment-vote="submitVote"
            @reply="addChildComment"
          />
        </v-list>

        <div v-if="auth.isAuthenticated" class="d-flex flex-column">
          <v-textarea
            v-model="newComment"
            auto-grow
            class="mb-n4 mb-md-n2"
            density="comfortable"
            :label="t('commentpanel.addcomment')"
            rows="2"
            variant="outlined"
          />

          <div class="d-flex justify-end">
            <v-btn
              class="mb-md-n2"
              color="primary"
              :disabled="newComment.trim() === ''"
              size="small"
              variant="text"
              @click="addRootComment"
            >
              {{ t('commentpanel.send') }}
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
  import type { Comment, NewComment } from '@/types/comment.type'
  import type { Vote } from '@/types/vote.type'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CommentItem from '@/components/CommentItem.vue'
  import commentService from '@/services/comment.service'
  import voteService from '@/services/vote.service'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const auth = useAuthStore()

  const props = defineProps<{
    comments?: Comment[]
    commentType: string
    votes: Vote[] | null
    entityId: string
  }>()

  const newComment = ref('')
  const emit = defineEmits<{
    (e: 'comment-vote', payload: { vote: Vote }): void
  }>()

  const rootComments = computed(() =>
    (props.comments || []).filter(c => c.parentCommentId === null),
  )

  async function submitVote (payload: { c: Comment, isValid: boolean }) {
    if (props.votes) {
      const vote = props.votes.find(v => v.targetId == payload.c.id)
      if (vote) {
        vote.value = payload.isValid ? 1 : -1
        vote.type = payload.isValid ? 'upvote' : 'downvote'
        await voteService.updateVote(vote.id, vote)
        emit('comment-vote', { vote: vote })
        return
      }
    }
    const vote = await voteService.createVote({
      targetId: payload.c.id,
      targetType: 'Comment',
      value: payload.isValid ? 1 : -1,
      type: payload.isValid ? 'upvote' : 'downvote',
      userId: auth.userId ?? '',
    })
    emit('comment-vote', { vote: vote })
  }

  async function addRootComment () {
    if (!newComment.value.trim()) return

    const newC: NewComment = {
      userId: auth.userId ?? '',
      content: newComment.value.trim(),
      targetType: props.commentType,
      targetId: props.entityId,
      parentCommentId: null,
    }
    try {
      const createdComment = await commentService.createComment({ ...newC })
      props.comments?.push(createdComment)
    } catch {
      alert(t('commentpanel.error'))
    }
    newComment.value = ''
  }

  async function addChildComment (payload: { parentId: string, content: string }) {
    if (!payload.content.trim()) return

    const newC: NewComment = {
      userId: auth.userId ?? '',
      content: payload.content.trim(),
      targetType: props.commentType,
      targetId: props.entityId,
      parentCommentId: payload.parentId,
    }
    try {
      const createdComment = await commentService.createComment({ ...newC })
      props.comments?.push(createdComment)
    } catch {
      alert(t('commentpanel.error'))
    }
  }
</script>

<style scoped>
.preview-sticky {
  position: sticky;
  top: 90px;
  z-index: 1;
}
.scrollable {
  overflow-y: auto;
  max-height: calc(85vh);
}
</style>
