export interface SearchableItem {
  id: string
  name: string
  description: string
  imageUrl: string | null
  reliabilityScore: number | null
  type: string
}
