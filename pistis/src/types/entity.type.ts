import type { FactEntity } from './fact-entity.type'
import type { Group } from './group.type'
import type { GroupEntity } from './groupe-entity.type'

export interface Entity {
  id: string
  name: string
  type: string // "person" | "company"
  shortBio: string | null
  sector: string | null
  country: string | null
  birthDate: Date | null
  foundedDate: Date | null
  officialLinks: string | null
  links: string[] | null
  image: string | null
  imageUrl: string | null
  imageMimeType: string | null
  reliabilityScore: number | null
  reliabilityVoteAmount: number | null

  factEntities: FactEntity[]
  entityGroups: GroupEntity[]
}

export interface NewEntity {
  id: string
  name: string
  type: string // "person" | "company"
  shortBio: string | null
  sector: string | null
  country: string | null
  countryForm: string[] | null
  birthDate: Date | null
  foundedDate: Date | null
  officialLinks: string | null
  links: string[] | null
  image: string | null
  imageUrl: string | null
  imageMimeType: string | null
  reliabilityScore: number | null
  reliabilityVoteAmount: number | null
  entityGroups: GroupEntity[]
  groups: Group[]
  groupId: string[] | null
}

export interface LinkEntity {
  groupIds: string[]
}
