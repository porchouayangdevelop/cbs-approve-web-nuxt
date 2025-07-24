export const useTokenExpiration = () => {
  const { isTokenExpired, decodeToken, getRemainingTime } = useJWTDecoder();
  const { user, refreshToken, logout, isLoading } = useAuth();
  const { checkRole, getTokenInfo } = useCheckAuth();

  const showExpirationModal = ref(false);
  const isRefreshing = ref(false);

  const checkTokenExpiration = () => {
    const token = useCookie("access_token").value;

    if (!token) {
      return {
        isExpired: true,
        willExpireSoon: false,
        remainingTime: 0
      }
    }

    const isExpired = isTokenExpired(token);
    const remainingTime = getRemainingTime(token);
    const willExpireSoon = remainingTime > 0 && remainingTime < 60 * 1000 * 60 * 24 * 30;

    return {
      isExpired,
      willExpireSoon,
      remainingTime,
      token
    }
  }

  const getSessionInfo = () => {
    const tokenInfo = getTokenInfo();
    const lastActivity = getLastActivity();
    return {
      user: user.value,
      tokenInfo: tokenInfo,
      sessionDuration: '30 minutes',
      lastActivity: lastActivity ? formatTimeAgo(lastActivity) : 'Unknown'
    }
  }

  const getLastActivity = (): Date | null => {
    if (process.client) {
      const lastActivity = localStorage.getItem('lastActivity')
      return lastActivity ? new Date(lastActivity) : null
    }
    return null
  }

  const updateActivity = () => {
    if (process.client) {
      localStorage.setItem('lastActivity', new Date().toISOString())
    }
  }


  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  const handleTokenRefresh = async (): Promise<boolean> => {
    if (isRefreshing.value) return false

    try {
      isRefreshing.value = true
      console.log('Attempting to refresh token...')

      const success = await refreshToken()

      if (success) {
        console.log('Token refreshed successfully')
        showExpirationModal.value = false
        updateActivity()
        return true
      } else {
        console.log('Token refresh failed')
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    } finally {
      isRefreshing.value = false
    }
  }

  const handleForceLogout = async () => {
    console.log('Force logout due to token expiration')
    showExpirationModal.value = false

    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Force cleanup even if logout fails
      await clearAuthAndRedirect()
    }
  }

  // Clear authentication and redirect
  const clearAuthAndRedirect = async () => {
    try {
      // Clear cookies
      const accessTokenCookie = useCookie('access_token')
      const refreshTokenCookie = useCookie('refresh_token')
      accessTokenCookie.value = null
      refreshTokenCookie.value = null

      // Clear localStorage
      if (process.client) {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('request_draft_') ||
            key.startsWith('preferred-language') ||
            key.startsWith('preferredRole') ||
            key === 'lastActivity') {
            localStorage.removeItem(key)
          }
        })
      }

      // Navigate to login
      await navigateTo('/auth/login', { replace: true })
    } catch (error) {
      console.error('Error during auth cleanup:', error)
      // Force page reload as fallback
      if (process.client) {
        window.location.href = '/auth/login'
      }
    }
  }

  // Show expiration modal
  const showTokenExpirationModal = () => {
    console.log('Showing token expiration modal')
    showExpirationModal.value = true
  }

  // Hide expiration modal
  const hideTokenExpirationModal = () => {
    showExpirationModal.value = false
  }

  // Main token check function to be called periodically
  const performTokenCheck = async () => {
    const { isExpired, willExpireSoon, remainingTime } = checkTokenExpiration()

    if (isExpired) {
      console.log('Token is expired, showing modal')
      showTokenExpirationModal()
      return { action: 'expired', remainingTime: 0 }
    }

    if (willExpireSoon) {
      console.log(`Token will expire soon (${remainingTime} seconds remaining)`)
      // Optionally show a warning or auto-refresh
      const refreshSuccess = await handleTokenRefresh()
      if (!refreshSuccess) {
        showTokenExpirationModal()
        return { action: 'refresh_failed', remainingTime }
      }
      return { action: 'refreshed', remainingTime }
    }

    return { action: 'valid', remainingTime }
  }

  // Setup periodic token checking
  const startTokenMonitoring = () => {
    if (process.server) return

    // Check every 30 seconds
    const tokenCheckInterval = setInterval(async () => {
      try {
        await performTokenCheck()
      } catch (error) {
        console.error('Token check error:', error)
      }
    }, 30000)

    // Cleanup interval on unmount
    onUnmounted(() => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval)
      }
    })

    return tokenCheckInterval
  }

  // Setup activity tracking
  const startActivityTracking = () => {
    if (process.server) return

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    const trackActivity = () => {
      updateActivity()
    }

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true })
    })

    // Cleanup on unmount
    onUnmounted(() => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, trackActivity)
      })
    })
  }

  // Initialize monitoring
  const initializeTokenMonitoring = () => {
    if (process.server) return

    // Start monitoring and activity tracking
    startTokenMonitoring()
    startActivityTracking()

    // Initial activity update
    updateActivity()

    // Perform initial token check
    nextTick(() => {
      performTokenCheck()
    })
  }


  return {
    // State
    showExpirationModal: readonly(showExpirationModal),
    isRefreshing: readonly(isRefreshing),

    // Methods
    checkTokenExpiration,
    getSessionInfo,
    handleTokenRefresh,
    handleForceLogout,
    showTokenExpirationModal,
    hideTokenExpirationModal,
    performTokenCheck,
    initializeTokenMonitoring,
    updateActivity,

    // Computed
    sessionInfo: computed(() => getSessionInfo())
  }
}
