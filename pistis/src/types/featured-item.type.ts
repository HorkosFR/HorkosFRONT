import type { SearchableItem } from './searchable-item.type'

export interface FeaturedItem {
  id: string
  itemId: string
  itemType: string
  title?: string | null
  subtitle?: string | null
  priority: number
  startDate: string
  endDate: string
  item: SearchableItem
}
