import type { User } from './user.type'

export interface Comment {
  id: string

  userId: string
  user: User | null

  content: string

  targetType: string
  targetId: string

  createdAt: Date
  updatedAt: Date | null
  upVoteAmount: number
  downVoteAmount: number
  score: number

  parentCommentId: string | null
  parentComment: Comment | null
}

export interface NewComment {
  userId: string
  content: string
  targetType: string
  targetId: string
  parentCommentId: string | null
}
