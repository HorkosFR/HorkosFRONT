import type { FactCheckResult } from './fact-check-result.enum'
import type { FactCheckSource } from './fact-check-source.type'
import type { FactCheckStatus } from './fact-check-status.enum'
import type { Fact } from './fact.type'
import type { NewSource } from './source.type'
import type { User } from './user.type'

export interface FactCheck {
  id: string

  factId: string
  fact: Fact

  title: string
  status: FactCheckStatus
  result: FactCheckResult
  justification: string
  date: Date
  upvote: number | null
  downvote: number | null
  score: number | null
  tmpScore: number
  userId: string
  user: User
  showSources: boolean
  factCheckSources: FactCheckSource[]
}

export interface NewFactCheck {
  title: string
  factId: string
  status: string
  result: string
  justification: string
  date: Date
  source: NewSource
}
