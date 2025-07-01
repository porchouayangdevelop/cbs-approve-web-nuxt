import {defineStore} from 'pinia'
import type {User} from '~/types';

export const useAuthStore = defineStore('auth', () => {
  //state
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const lastActivity = ref<Date | null>(null);

  //getters
  const userRole = computed(() => user.value?.role);
  const userPermissions = computed(() => user.value?.permissions || [])
  const isAdmin = computed(() => userRole.value === 'admin')
  const isUser = computed(() => userRole.value === 'User')
  const isChecker = computed(() => userRole.value === 'Checker')

  //actions
  const setUser = (userData: User) => {
    user.value = userData;
    isAuthenticated.value = true;
    updateLastActivity()
  }


  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    lastActivity.value = null
  }

  function updateLastActivity() {
    lastActivity.value = new Date()
  }

  // Session management
  const checkSessionExpiry = () => {
    if (!lastActivity.value) return false

    const now = new Date()
    const diff = now.getTime() - lastActivity.value.getTime()
    const maxInactivity = 30 * 60 * 1000 // 30 minutes

    return diff > maxInactivity
  }

  const refreshSession = async () => {
    try {
      const {refreshToken} = useAuth()
      const success = await refreshToken()

      if (success) {
        updateLastActivity()
      } else {
        clearUser()
        await navigateTo('/auth/login')
      }

      return success
    } catch (error) {
      console.error('Session refresh failed:', error)
      clearUser()
      await navigateTo('/auth/login')
      return false
    }
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(isLoading),
    lastActivity: readonly(lastActivity),

    // Getters
    userRole,
    userPermissions,
    isAdmin,
    isChecker,
    isUser,

    // Actions
    setUser,
    clearUser,
    updateLastActivity,
    checkSessionExpiry,
    refreshSession
  }
})