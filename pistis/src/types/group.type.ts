import type { Entity } from './entity.type'
import type { GroupEntity } from './groupe-entity.type'

export interface Group {
  id: string
  name: string
  description: string
  imageUrl: string | null
  reliabilityScore: number | null

  groupEntities: GroupEntity[]
}

export interface NewGroup {
  name: string
  description: string
  imageUrl: string | null
  entity: Entity
  entityId: string | null
}

export interface LinkGroup {
  entityIds: string[]
}
