import type { User } from './user.type'

export interface UserContribution {
  id: string

  userId: string
  user: User

  // statement / factcheck / case / source / edit
  contributionType: string

  contributionId: string

  // created / updated / deleted / commented
  action: string

  timestamp: Date
}

export interface NewUserContribution {
  userId: string

  contributionType: string
  contributionId: string
  action: string
}
