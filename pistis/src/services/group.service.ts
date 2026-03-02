import type { Group, LinkGroup, NewGroup } from '@/types/group.type'
import api from '@/services/api'

const API_URL = '/group'

export default {
  async getGroups (): Promise<Group[]> {
    const response = await api.get<Group[]>(API_URL)
    return response.data
  },

  async getGroupById (id: string): Promise<Group> {
    const response = await api.get<Group>(`${API_URL}/${id}`)
    return response.data
  },

  async getLatestGroups (limit = 5): Promise<Group[]> {
    const response = await api.get<Group[]>(`${API_URL}/latest?limit=${limit}`)
    return response.data
  },

  async searchGroups (query: string): Promise<Group[]> {
    const response = await api.get<Group[]>(`${API_URL}/search?query=${encodeURIComponent(query)}`)
    return response.data
  },

  async getGroupsByEntityId (entityId: string): Promise<Group[]> {
    const response = await api.get<Group[]>(`${API_URL}/entity/${entityId}`)
    return response.data
  },

  async createGroup (group: NewGroup): Promise<Group> {
    const response = await api.post<Group>(API_URL, group)
    return response.data
  },

  async updateGroup (id: string, group: Group): Promise<void> {
    await api.put(`${API_URL}/${id}`, group)
  },

  async linkEntityGroup (entityIds: LinkGroup, groupId: string): Promise<void> {
    await api.post(`${API_URL}/${groupId}/link`, entityIds)
  },

  async deleteGroup (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
