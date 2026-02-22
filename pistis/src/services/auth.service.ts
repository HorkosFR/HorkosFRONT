import type {
  AuthResponse,
  EmailRequest,
  ForgotPasswordRequest,
  LoginRequest,
  PasswordRequest,
  RegisterRequest,
  VerifyRequest,
} from '@/types/auth.type'
import api from '@/services/api'

const API_URL = '/auth'

export default {

  async verifyEmail (token: string): Promise<boolean> {
    const payload = {
      email_token: token,
      init: true,
    }
    const data = await api.post<void>(`${API_URL}/verify`, payload)
    return data !== null
  },

  async register (registerData: RegisterRequest): Promise<void> {
    const payload = {
      ...registerData,
    }

    await api.post<void>(`${API_URL}/register`, payload)
  },

  async resend (registerData: RegisterRequest): Promise<void> {
    const payload = {
      ...registerData,
    }

    await api.post<void>(`${API_URL}/resend`, payload)
  },

  async login (loginData: LoginRequest): Promise<AuthResponse> {
    const payload = {
      ...loginData,
    }

    const response = await api.post<AuthResponse>(`${API_URL}/login`, payload)
    const data = response.data

    return data
  },

  async verify (verifyData: VerifyRequest): Promise<void> {
    await api.post<void>(`${API_URL}/verify`, verifyData)
  },

  async forgotPassword (payload: ForgotPasswordRequest): Promise<void> {
    await api.post<void>(`${API_URL}/update-password`, payload)
  },

  logout (): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  async updatePassword (payload: PasswordRequest): Promise<void> {
    await api.patch(`${API_URL}/password`, payload)
  },

  async updateEmail (payload: EmailRequest): Promise<void> {
    await api.patch(`${API_URL}/email`, payload)
  },

}
