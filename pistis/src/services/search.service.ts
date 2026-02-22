import type { SearchableItem } from '@/types/searchable-item.type'
import api from '@/services/api'

const API_URL = '/search'

export default {
  async searchItems (query: string): Promise<SearchableItem[]> {
    const response = await api.get<SearchableItem[]>(`${API_URL}?query=${encodeURIComponent(query)}`)
    return response.data
  },

  async getLatestItems (limit = 5): Promise<SearchableItem[]> {
    const response = await api.get<SearchableItem[]>(`${API_URL}/latest?limit=${limit}`)
    return response.data
  },
}
