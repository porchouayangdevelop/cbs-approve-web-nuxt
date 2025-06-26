export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.config.errorHandler = (error: any, instance, info) => {
    console.error('Global error:', error, info)

    // Handle 403 errors
    if (error?.statusCode === 403) {
      navigateTo('/auth/unauthorized')
      return
    }

    // Handle 401 errors (authentication required)
    if (error?.statusCode === 401) {
      navigateTo('/auth/login')
      return
    }

    // Handle other errors normally
    throw error
  }

  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)

      // Check if it's an auth-related error
      if (event.reason?.statusCode === 403) {
        event.preventDefault()
        navigateTo('/auth/unauthorized')
      } else if (event.reason?.statusCode === 401) {
        event.preventDefault()
        navigateTo('/auth/login')
      }
    })
  }
})
