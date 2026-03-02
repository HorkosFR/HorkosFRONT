import type { Role } from '@/types/role.type'
import api from '@/services/api'

const API_URL = '/role'

export const RoleService = {
  async getRoles (): Promise<Role[]> {
    const response = await api.get<Role[]>(API_URL)
    return response.data
  },

  async getRoleById (id: string): Promise<Role> {
    const response = await api.get<Role>(`${API_URL}/${id}`)
    return response.data
  },

  async createRole (role: Role): Promise<Role> {
    const response = await api.post<Role>(API_URL, role)
    return response.data
  },

  async deleteRole (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
