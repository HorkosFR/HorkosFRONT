import type { FactCheck } from './fact-check.type'
import type { Source } from './source.type'

export interface FactCheckSource {
  factCheckId: string
  factCheck: FactCheck

  sourceId: string
  source: Source
}
