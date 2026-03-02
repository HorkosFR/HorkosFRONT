import type { Role } from './role.type'
import type { UserBadge } from './user-badge.type'
import type { UserContribution } from './user-contribution.type'
import type { UserPoints } from './user-points.type'

export interface User {
  id: string
  username: string | null
  email: string | null
  roleId: string
  password: string | null
  lastModificationDate: Date | null
  createdDate: Date
  lastLogin: Date
  imageData?: string | null
  imageUrl?: string | null
  role: Role | null
  locale: string

  contributions: UserContribution[]
  comments: Comment[]
  points: UserPoints
  badges: UserBadge[]
}

export interface NewUser {
  id: string
  username: string | null
  email: string | null
  roleId: string
  password: string | null
  role: Role | null
  locale: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  password?: string
  image?: string | null
  locale: string
}
