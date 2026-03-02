export interface UserTokenDTO {
  username: string
  email: string
  roleId: string
  createdDate: string
  userId: string
}

export interface TokenCheckResponse {
  isValid: boolean
  message?: string
}

export interface RenewTokenResponse {
  accessToken: string
  expiresIn?: number
}
