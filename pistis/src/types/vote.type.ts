export interface Vote {
  id: string
  targetId: string
  userId: string
  value: number
  type: string
  createdAt: string
  updatedAt: string
}

export interface NewVote {
  targetId: string
  targetType: string
  userId: string
  value: number
  type: string
}
