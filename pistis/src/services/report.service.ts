import type { Report, ReportPayload } from '@/types/report.type'
import api from '@/services/api'

const API_URL = '/reports'

export default {
  async createReport (payload: ReportPayload): Promise<Report> {
    const response = await api.post<Report>(API_URL, payload)
    return response.data
  },

  async getReports (): Promise<Report[]> {
    const response = await api.get<Report[]>(`${API_URL}/new`)
    return response.data
  },

  async updateReport (id: string, report: Report): Promise<boolean> {
    const response = await api.put<boolean>(`${API_URL}/${id}`, report)
    return response.data
  },

  async banReportItem (id: string): Promise<boolean> {
    const response = await api.post<boolean>(`${API_URL}/${id}/ban`)
    return response.data
  },
}
