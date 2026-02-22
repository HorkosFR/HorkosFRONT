import type { RenewTokenResponse, TokenCheckResponse } from '@/types/security.type'
import api from '@/services/api'

const API_URL = '/userToken'

export default {
  async checkAccessToken (): Promise<boolean> {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      return false
    }

    try {
      const res = await api.post<TokenCheckResponse>(
        `${API_URL}/CheckAccessUserToken`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return res.data?.isValid ?? true
    } catch {
      return false
    }
  },

  async checkRefreshToken (): Promise<boolean> {
    const token = localStorage.getItem('refreshToken')
    if (!token) {
      return false
    }

    try {
      const res = await api.post<TokenCheckResponse>(
        `${API_URL}/CheckRefreshUserToken`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return res.data?.isValid ?? true
    } catch {
      return false
    }
  },

  async renewAccessToken (): Promise<string | null> {
    const token = localStorage.getItem('refreshToken')
    if (!token) {
      return null
    }

    try {
      const res = await api.get<RenewTokenResponse>(`${API_URL}/RenewUserToken`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const newAccessToken = res.data?.accessToken
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken)
      }
      return newAccessToken
    } catch {
      return null
    }
  },
}
