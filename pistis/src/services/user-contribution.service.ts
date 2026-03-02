import type { UserContribution } from '@/types/user-contribution.type'
import api from '@/services/api'

const API_URL = '/contribution'

export default {
  async getContributions (): Promise<UserContribution[]> {
    const response = await api.get<UserContribution[]>(API_URL)
    return response.data
  },

  async getContributionById (id: string): Promise<UserContribution> {
    const response = await api.get<UserContribution>(`${API_URL}/${id}`)
    return response.data
  },

  async createContribution (contribution: UserContribution): Promise<UserContribution> {
    const response = await api.post<UserContribution>(API_URL, contribution)
    return response.data
  },

  async deleteContribution (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
