import type { UpdateUserRequest, User } from '@/types/user.type'
import api from '@/services/api'

const API_URL = '/user'

export default {
  async getUsers (): Promise<User[]> {
    const response = await api.get<User[]>(API_URL)
    return response.data
  },

  async getUserById (id: string): Promise<User> {
    const response = await api.get<User>(`${API_URL}/${id}`)
    return response.data
  },

  async createUser (user: User): Promise<User> {
    const response = await api.post<User>(API_URL, user)
    return response.data
  },

  async updateUser (id: string, user: UpdateUserRequest): Promise<void> {
    await api.put(`${API_URL}/${id}`, user)
  },

  async deleteUser (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },

  async getCurrentUser (): Promise<User> {
    const response = await api.get<User>(`${API_URL}/me`)
    return response.data
  },

  async updateProfile (profileData: UpdateUserRequest): Promise<User> {
    const response = await api.put(`${API_URL}/me`, profileData)
    return response.data
  },
}
