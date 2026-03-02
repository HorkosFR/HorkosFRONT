import type { NewVote, Vote } from '@/types/vote.type'
import api from '@/services/api'

const API_URL = '/vote'

export default {
  async getVotes (): Promise<Vote[]> {
    const response = await api.get<Vote[]>(API_URL)
    return response.data
  },

  async getVoteById (id: string): Promise<Vote> {
    const response = await api.get<Vote>(`${API_URL}/${id}`)
    return response.data
  },

  async getVoteByTargetIdCurrentUser (targetId: string): Promise<Vote[]> {
    const response = await api.get<Vote[]>(`${API_URL}/${targetId}/me`)
    return response.data
  },

  async getVoteByCommentCurrentUser (targetId: string): Promise<Vote[]> {
    const response = await api.get<Vote[]>(`${API_URL}/${targetId}/comment/me`)
    return response.data
  },

  async createVote (vote: NewVote): Promise<Vote> {
    const response = await api.post<Vote>(API_URL, vote)
    return response.data
  },

  async updateVote (id: string, vote: Vote): Promise<void> {
    await api.put(`${API_URL}/${id}`, vote)
  },

  async deleteVote (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
