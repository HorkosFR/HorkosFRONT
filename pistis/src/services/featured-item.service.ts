import type { FeaturedItem } from '@/types/featured-item.type'
import api from '@/services/api'

const API_URL = '/featured-item'

export default {
  async getFeaturedItems (): Promise<FeaturedItem[]> {
    const response = await api.get<FeaturedItem[]>(`${API_URL}/`)
    return response.data
  },
}
