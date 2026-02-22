import type { Entity } from './entity.type'
import type { Group } from './group.type'

export interface GroupEntity {
  groupId: string
  group: Group

  entityId: string
  entity: Entity
}
