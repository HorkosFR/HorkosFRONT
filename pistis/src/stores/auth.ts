import type { AuthResponse } from '@/types/auth.type'
import type { User } from '@/types/user.type'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') as string | null,
    userId: localStorage.getItem('userId') as string | null,
    username: localStorage.getItem('username') as string | null,
    email: localStorage.getItem('email') as string | null,
    roleName: localStorage.getItem('roleName') as string | null,
    userImage: localStorage.getItem('userImage') as string | null,
    locale: localStorage.getItem('locale') || 'fr',
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken,
    isAdministrator: (state): boolean => state.roleName == 'Administrator',
  },

  actions: {
    async logUser (user: AuthResponse) {
      this.accessToken = user.userToken
      this.userId = user.userId
      this.email = user.email
      this.roleName = user.roleName
      this.username = user.username
      this.userImage = user.userImage
      this.locale = user.locale

      localStorage.setItem('accessToken', user.userToken)
      localStorage.setItem('userId', user.userId)
      localStorage.setItem('email', user.email)
      localStorage.setItem('roleName', user.roleName)
      localStorage.setItem('username', user.username)
      localStorage.setItem('userImage', user.userImage)
      localStorage.setItem('locale', user.locale)
    },

    async updateUser(user: User) {
      this.userId = user.id
      this.email = user.email
      this.roleName = user.role ? user.role.name : 'User'
      this.username = user.username
      this.userImage = user.imageUrl ? user.imageUrl : '/default-avatar.png'
      this.locale = user.locale

      localStorage.setItem('userId', user.id)
      localStorage.setItem('email', user.email ? user.email : '')
      localStorage.setItem('roleName', this.roleName ?? 'User')
      localStorage.setItem('username', user.username ? user.username : 'Unknown')
      localStorage.setItem('userImage', user.imageUrl ? user.imageUrl : '/default-avatar.png')
      localStorage.setItem('locale', user.locale)
    },

    setLocale (newLocale: string) {
      this.locale = newLocale
    },

    logout () {
      this.accessToken = null
      this.userId = null
      this.email = null
      this.roleName = null
      this.username = null
      this.userImage = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      localStorage.removeItem('roleName')
      localStorage.removeItem('username')
      localStorage.removeItem('userImage')
    },
  },
})
