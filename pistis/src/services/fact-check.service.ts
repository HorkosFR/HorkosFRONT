import type { FactCheck, NewFactCheck } from '@/types/fact-check.type'
import api from '@/services/api'

const API_URL = '/factcheck'

export default {
  async getFactChecks (): Promise<FactCheck[]> {
    const response = await api.get<FactCheck[]>(API_URL)
    return response.data
  },

  async getFactCheckById (id: string): Promise<FactCheck> {
    const response = await api.get<FactCheck>(`${API_URL}/${id}`)
    return response.data
  },

  async getFactChecksByPublicStatementId (statementId: string): Promise<FactCheck[]> {
    const response = await api.get<FactCheck[]>(`${API_URL}/statement/${statementId}`)
    return response.data
  },

  async createFactCheck (factCheck: NewFactCheck): Promise<FactCheck> {
    const response = await api.post<FactCheck>(API_URL, factCheck)
    return response.data
  },

  async updateFactCheck (id: string, factCheck: FactCheck): Promise<void> {
    await api.put(`${API_URL}/${id}`, factCheck)
  },

  async deleteFactCheck (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
