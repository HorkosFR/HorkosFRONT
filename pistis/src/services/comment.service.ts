import type { Comment, NewComment } from '@/types/comment.type'
import api from '@/services/api'

const API_URL = '/comment'

export default {
  async getComments (): Promise<Comment[]> {
    const response = await api.get<Comment[]>(API_URL)
    return response.data
  },

  async getCommentById (id: string): Promise<Comment> {
    const response = await api.get<Comment>(`${API_URL}/${id}`)
    return response.data
  },

  async getCommentsByEntityId (entityId: string): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`${API_URL}/target/${entityId}`)
    return response.data
  },

  async createComment (comment: NewComment): Promise<Comment> {
    const response = await api.post<Comment>(API_URL, comment)
    return response.data
  },

  async updateComment (id: string, comment: Comment): Promise<void> {
    await api.put(`${API_URL}/${id}`, comment)
  },

  async deleteComment (id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  },
}
