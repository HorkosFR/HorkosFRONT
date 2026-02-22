import type { Entity } from './entity.type'
import type { Fact } from './fact.type'

export interface FactEntity {
  factId: string
  fact: Fact

  entityId: string
  entity: Entity
}
