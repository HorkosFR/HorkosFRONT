import type { Badge } from '@/types/badge.type'
import api from '@/services/api'

const API_URL = '/badge'

export default {
  async getAllBadges (): Promise<Badge[]> {
    const response = await api.get<Badge[]>(API_URL)
    return response.data
  },
}
