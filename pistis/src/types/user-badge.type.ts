import type { Badge } from './badge.type'
import type { User } from './user.type'

export interface UserBadge {
  userId: string
  user: User

  badgeId: string
  badge: Badge

  earnedAt: Date
}
