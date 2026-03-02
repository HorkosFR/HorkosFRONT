import type { User } from './user.type'

export interface Report {
  id: string
  targetId: string | null
  targetType: string | null
  reason: string
  comment?: string
  user?: User | null
  status: string
  adminComment?: string | null
}

export interface ReportPayload {
  targetId: string | null
  targetType: string | null
  reason: string
  comment?: string
  status: string
  userId?: string | null
}
