import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(true)

  // Initialize session from localStorage
  const initSession = () => {
    try {
      const storedUser = localStorage.getItem('currentUser')
      const token = localStorage.getItem('authToken')

      if (storedUser && token) {
        currentUser.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('Session restoration failed', error)
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.auth.login(email, password)

      if (response.success) {
        localStorage.setItem('currentUser', JSON.stringify(response.user))
        currentUser.value = response.user
        isAuthenticated.value = true
        return {
          success: true,
          requiresPasswordChange: response.requiresPasswordChange
        }
      }

      return { success: false, error: response.message }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Une erreur inattendue est survenue' }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    currentUser.value = null
    isAuthenticated.value = false
  }

  const changePassword = async (oldPassword, newPassword) => {
    if (!currentUser.value) return { success: false, error: 'Non authentifié' }

    try {
      const response = await api.auth.changePassword(currentUser.value.id, oldPassword, newPassword)
      if (response.success) {
        return { success: true }
      }
      return { success: false, error: response.message }
    } catch (error) {
      return { success: false, error: 'Échec du changement de mot de passe' }
    }
  }

  const hasRole = (roles) => {
    if (!currentUser.value) return false
    if (!roles || roles.length === 0) return true
    return roles.includes(currentUser.value.role)
  }

  return {
    currentUser,
    isAuthenticated,
    loading,
    initSession,
    login,
    logout,
    changePassword,
    hasRole
  }
})
