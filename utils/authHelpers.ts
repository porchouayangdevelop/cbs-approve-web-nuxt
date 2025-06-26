export const authHelpers = {
  // Check if route requires authentication
  requiresAuth(route: string): boolean {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/unauthorized',
      '/error'
    ]

    return !publicRoutes.includes(route)
  },

  // Get redirect URL after login
  getRedirectUrl(userRole: string): string {
    const roleRedirects: Record<string, string> = {
      'Admin': '/admin',
      'Manager': '/users',
      'Checker': '/approve',
      'User': '/dashboard'
    }

    return roleRedirects[userRole] || '/dashboard'
  },

  // Format permissions for display
  formatPermission(permission: string): string {
    return permission
      .split(':')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  },

  // Check if user session is valid
  async validateSession(): Promise<boolean> {
    try {
      const token = useCookie('access_token')

      if (!token.value) {
        return false
      }

      // Decode JWT to check expiration (simple check)
      const tokenPayload = JSON.parse(atob(token.value.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)

      if (tokenPayload.exp < currentTime) {
        // Token expired, try to refresh
        const { refreshToken } = useAuth()
        return await refreshToken()
      }

      return true
    } catch (error) {
      console.error('Session validation error:', error)
      return false
    }
  },

  // Log security events
  logSecurityEvent(event: SecurityEvent): void {
    if (process.client) {
      console.log('Security Event:', event)

      // In production, send to security monitoring service
      // fetch('/api/security/log', {
      //   method: 'POST',
      //   body: JSON.stringify(event)
      // })
    }
  }
}

// Types for security events
interface SecurityEvent {
  type: 'unauthorized_access' | 'login_attempt' | 'permission_denied' | 'session_expired'
  userId?: string
  route?: string
  userAgent?: string
  timestamp: string
  metadata?: Record<string, any>
}
