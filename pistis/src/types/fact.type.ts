import type { Entity } from './entity.type'
import type { FactCheck } from './fact-check.type'
import type { FactSource } from './fact-source.type'
import type { FactTag } from './fact-tag.enum'
import type { FactType } from './fact-type.enum'
import type { NewSource, Source } from './source.type'

export interface Fact {
  id: string
  type: FactType
  title: string
  isGoodAction: boolean
  tags: string
  tabTags: FactTag[]
  startDate: Date
  endDate?: Date | null
  context: string
  statement?: string | null
  content: string
  summary?: string | null
  verdict?: string | null
  reliabilityScore?: number | null
  gravityScore?: number | null
  gravityVoteAmount?: number | null
  reliabilityVoteAmount?: number | null
  relatedFactCheckSources: Source[]

  entityId: string
  entity?: Entity | null

  factChecks: FactCheck[]
  factSources: FactSource[]
}

export interface NewFact {
  type: FactType | null
  title: string | null
  tags: string | null
  tabTags: FactTag[]
  isGoodAction: boolean
  startDate: Date
  endDate?: Date | null
  context: string | null
  statement?: string | null
  content: string | null
  summary?: string | null
  verdict?: string | null
  source: NewSource[]
  entityId: string
}

export interface HomeFact {
  id: string
  entityId: string
  title: string
  isGoodAction: boolean
  tags: string
  summary?: string | null
  entityName: string
  entityImage?: string | null
}
