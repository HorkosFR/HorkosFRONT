import type { Entity, LinkEntity, NewEntity } from '@/types/entity.type'
import api from '@/services/api'

const API_URL = '/entity'

export default {
  async getLatestEntities (limit = 5): Promise<Entity[]> {
    const response = await api.get<Entity[]>(`${API_URL}/latest?limit=${limit}`)
    return response.data
  },

  async searchEntities (query: string): Promise<Entity[]> {
    const response = await api.get<Entity[]>(`${API_URL}/search?query=${encodeURIComponent(query)}`)
    return response.data
  },

  async getEntities (): Promise<Entity[]> {
    const response = await api.get<Entity[]>(API_URL)
    return response.data
  },

  async getEntityById (id: string): Promise<Entity> {
    const response = await api.get<Entity>(`${API_URL}/${id}`)
    return response.data
  },

  async createEntity (entity: NewEntity): Promise<Entity> {
    const response = await api.post<Entity>(API_URL, entity)
    return response.data
  },

  async linkGroupEntity (entityId: string, groupIds: LinkEntity): Promise<void> {
    await api.post(`${API_URL}/${entityId}/link`, groupIds)
  },

  async updateEntity (id: string, entity: Entity): Promise<void> {
    await api.put(`${API_URL}/${id}`, entity)
  },

  async deleteEntity (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
