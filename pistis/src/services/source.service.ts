import type { NewSource, Source } from '@/types/source.type'
import api from '@/services/api'

const API_URL = '/source'

export default {
  async getSources (): Promise<Source[]> {
    const response = await api.get<Source[]>(API_URL)
    return response.data
  },

  async getSourceById (id: string): Promise<Source> {
    const response = await api.get<Source>(`${API_URL}/${id}`)
    return response.data
  },

  async getSourcesByItemId (itemId: string): Promise<Source[]> {
    const response = await api.get<Source[]>(`${API_URL}/by-item/${itemId}`)
    return response.data
  },

  async getSourceFromUrl (url: string): Promise<NewSource> {
    const response = await api.post<NewSource>(`${API_URL}/generate?url=${encodeURIComponent(url)}`)
    return response.data
  },

  async createSource (source: NewSource): Promise<Source> {
    const response = await api.post<Source>(API_URL, source)
    return response.data
  },

  async updateSource (id: string, source: Source): Promise<void> {
    await api.put(`${API_URL}/${id}`, source)
  },

  async deleteSource (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
