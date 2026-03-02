import type { SourceType } from './source-type.enum'

export interface Source {
  id: string
  title: string
  sourceType: SourceType
  author: string | null
  url: string
  publicationDate: Date
  reliabilityScore: number
  reliabilityVoteAmount: number
  tmpScore: number
}

export interface NewSource {
  title: string
  sourceType: SourceType
  author: string | null
  targetId: string
  url: string
  publicationDate: Date
}
