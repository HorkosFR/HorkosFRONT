import type { Fact } from './fact.type'
import type { Source } from './source.type'

export interface FactSource {
  factId: string
  fact: Fact

  sourceId: string
  source: Source
}
