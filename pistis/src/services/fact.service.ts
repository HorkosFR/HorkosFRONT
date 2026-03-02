import type { Fact, HomeFact, NewFact } from '@/types/fact.type'
import api from '@/services/api'

const API_URL = '/fact'

export default {
  async getFacts (): Promise<Fact[]> {
    const response = await api.get<Fact[]>(API_URL)
    return response.data
  },

  async getLatestFacts (): Promise<HomeFact[]> {
    const response = await api.get<HomeFact[]>(`${API_URL}/latest`)
    return response.data
  },

  async getFactById (id: string): Promise<Fact> {
    const response = await api.get<Fact>(`${API_URL}/${id}`)
    return response.data
  },

  async getFactsByEntityId (entityId: string): Promise<Fact[]> {
    const response = await api.get<Fact[]>(`${API_URL}/entity/${entityId}`)
    return response.data
  },

  async createFact (fact: NewFact): Promise<Fact> {
    const response = await api.post<Fact>(API_URL, fact)
    return response.data
  },

  async generateFact (url: string): Promise<NewFact> {
    const response = await api.post<NewFact>(`${API_URL}/generate?url=${encodeURIComponent(url)}`)
    return response.data
  },

  async updateFact (id: string, fact: Fact): Promise<void> {
    await api.put(`${API_URL}/${id}`, fact)
  },

  async deleteFact (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
