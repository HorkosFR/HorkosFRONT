import type { Level } from './level.type'
import type { User } from './user.type'

export interface UserPoints {
  userId: string
  totalPoints: number
  currentLevel: number
  lastUpdated: string
  user?: User
  level?: Level
  nextLevel?: Level
}
