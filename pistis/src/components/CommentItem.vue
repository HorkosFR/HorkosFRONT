<template>
  <div class="comment-item">
    <v-list-item class="comment-content no-padding">
      <v-list-item-title class="comment-title">
        <div class="left">
          <v-avatar class="badge-avatar mr-1" size="x-small">
            <v-img :src="comment.user?.imageUrl || defaultAvatar" />
          </v-avatar>

          {{ comment.user?.username || t('commentitem.unknownuser') }}

          <ReportButton :target-id="comment.id" target-type="comment" />
        </div>

        <div class="right">
          <small class="text-disabled">
            {{ new Date(comment.createdAt).toLocaleDateString() }}
          </small>
        </div>
      </v-list-item-title>

      <div class="mt-1">
        {{ displayText }}
        <span v-if="isTruncated" class="text-primary cursor-pointer ml-1" @click="toggleExpanded">
          {{ expanded ? t('commentitem.reduce') : t('commentitem.readmore') }}
        </span>
      </div>

      <div class="comment-actions mb-1 justify-space-between">
        <div>
          <v-btn
            v-if="replies.length > 0"
            class="text-caption text-grey-darken-1"
            density="compact"
            variant="text"
            @click="toggleReplies"
          >
            {{ showReplies ? t('commentitem.hide') : `${t('commentitem.see')} ${replies.length}
            ${t('commentitem.answers')}` }}
          </v-btn>
          <v-btn
            v-else
            class="text-caption text-grey-darken-1"
            density="compact"
            disabled
            variant="text"
          >
            {{ t('commentitem.nocomment') }}
          </v-btn>
        </div>
        <small>
          <v-btn
            color="primary"
            :disabled="isUpVoted()"
            :icon="isUpVoted() ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
            size="x-small"
            variant="text"
            @click="submitVote(props.comment, true)"
          />

          <span class="score">{{ comment.score }}</span>

          <v-btn
            color="error"
            :disabled="isDownVoted()"
            :icon="isDownVoted() ? 'mdi-thumb-down' : 'mdi-thumb-down-outline'"
            size="x-small"
            variant="text"
            @click="submitVote(props.comment, false)"
          />
        </small>
        <v-btn
          v-if="auth.isAuthenticated"
          class="text-primary ml-2"
          density="compact"
          size="small"
          variant="text"
          @click="toggleReplyField"
        >
          {{ t('commentitem.answer') }}
        </v-btn>
      </div>

      <div v-if="showReplyField" class="mt-2">
        <v-textarea
          v-model="replyContent"
          auto-grow
          class="text-body-2"
          density="comfortable"
          :label="t('commentitem.youranswer')"
          rows="2"
          variant="outlined"
        />
        <div class="d-flex justify-end mt-1">
          <v-btn
            color="primary"
            density="comfortable"
            :disabled="!replyContent.trim()"
            size="small"
            variant="text"
            @click="submitReply"
          >
            {{ t('commentitem.send') }}
          </v-btn>
          <v-btn
            class="ml-1"
            density="comfortable"
            size="small"
            variant="text"
            @click="cancelReply"
          >
            {{ t('commentitem.cancel') }}
          </v-btn>
        </div>
      </div>
      <v-divider class="my-md-4" />
    </v-list-item>

    <div v-if="showReplies" class="pl-4 mt-2 ml-2 border-l border-grey-light replies">
      <CommentItem
        v-for="reply in replies"
        :key="reply.id"
        :all-comments="allComments"
        :comment="reply"
        :votes="votes"
        @comment-vote="submitVoteChild"
        @reply="addChildComment"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Comment } from '@/types/comment.type'
  import type { Vote } from '@/types/vote.type'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ReportButton from '@/components/ReportButton.vue'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const props = defineProps<{
    votes: Vote[]
    comment: Comment
    allComments: Comment[]
  }>()

  const emit = defineEmits<{
    (e: 'reply', payload: { parentId: string, content: string }): void
    (e: 'comment-vote', payload: { c: Comment, isValid: boolean }): void
  }>()

  const expanded = ref(false)
  const showReplies = ref(false)
  const showReplyField = ref(false)
  const replyContent = ref('')
  const maxLength = 150
  const auth = useAuthStore()
  const defaultAvatar = '/default-avatar.png'

  const replies = computed(() =>
    props.allComments.filter(c => c.parentCommentId === props.comment.id),
  )

  const isTruncated = computed(() => props.comment.content.length > maxLength)
  const displayText = computed(() =>
    expanded.value || !isTruncated.value
      ? props.comment.content
      : props.comment.content.slice(0, maxLength) + '...',
  )

  function submitVote (c: Comment, isValid: boolean) {
    emit('comment-vote', { c: c, isValid: isValid })
  }

  function submitVoteChild (payload: { c: Comment, isValid: boolean }) {
    emit('comment-vote', payload)
  }

  function isUpVoted () {
    if (!props.votes) return false
    const vote = props.votes.find(v => v.targetId == props.comment.id && v.type == 'upvote')
    if (!vote) return false
    return true
  }

  function isDownVoted () {
    if (!props.votes) return false
    const vote = props.votes.find(v => v.targetId == props.comment.id && v.type == 'downvote')
    if (!vote) return false
    return true
  }

  function toggleExpanded () {
    expanded.value = !expanded.value
  }

  function toggleReplies () {
    showReplies.value = !showReplies.value
  }

  function toggleReplyField () {
    showReplyField.value = !showReplyField.value
  }

  function submitReply () {
    if (!replyContent.value.trim()) return
    emit('reply', { parentId: props.comment.id, content: replyContent.value.trim() })
    replyContent.value = ''
    showReplyField.value = false
  }

  function addChildComment (payload: { parentId: string, content: string }) {
    emit('reply', payload)
  }

  function cancelReply () {
    replyContent.value = ''
    showReplyField.value = false
  }
</script>

<style scoped>
.comment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.comment-title .left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.comment-title .right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.comment-title .score {
  font-size: 0.75rem;
  /* texte plus petit */
  opacity: 0.7;
}

.comment-item {
  transition: all 0.2s ease;
}

.comment-actions {
  display: flex;
  align-items: center;
}

.replies {
  font-size: 0.9rem;
  opacity: 0.9;
}

.border-grey-light {
  border-color: rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

.badge-avatar {
  border: 1px solid rgb(var(--v-theme-secondary));
}

.no-padding {
  padding: 0 !important;
}
</style>
