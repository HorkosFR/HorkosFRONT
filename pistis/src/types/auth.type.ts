export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface PasswordRequest {
  token: string
  password: string
}

export interface EmailRequest {
  token: string
  email: string
}

export interface AuthResponse {
  userToken: string
  userId: string
  email: string
  username: string
  roleName: string
  userImage: string
  locale: string
}

export interface VerifyRequest {
  email: string
  code: string
}

export interface VerifyResponse {
  success: boolean
  message?: string
}

export interface ForgotPasswordRequest {
  email: string
}
