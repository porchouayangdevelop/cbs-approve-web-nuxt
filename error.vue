<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <div class="text-center space-y-8">
        <!-- Error Code Display -->
        <div class="relative">
          <div class="text-8xl md:text-9xl font-black text-gray-200 dark:text-gray-700 select-none">
            {{ error.statusCode || '500' }}
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <UIcon
                :name="getErrorIcon()"
                class="w-16 h-16 md:w-20 md:h-20 text-primary-500 animate-pulse"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div class="space-y-4">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {{ getErrorTitle() }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            {{ getErrorDescription() }}
          </p>
        </div>

        <!-- Error Details (Development Only) -->
        <div v-if="isDevelopment && error.stack" class="mt-8">
          <UCard class="text-left">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-orange-500" />
                <span class="font-semibold">Error Details (Development)</span>
              </div>
            </template>

            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message:</p>
                <p class="text-sm text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {{ error.message }}
                </p>
              </div>

              <div v-if="error.stack">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stack Trace:</p>
                <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto text-gray-800 dark:text-gray-200">{{ error.stack }}</pre>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <UButton
              @click="handleError"
              size="lg"
              icon="i-heroicons-home"
              class="w-full sm:w-auto"
          >
            Go Home
          </UButton>

          <UButton
              @click="refresh"
              variant="outline"
              size="lg"
              icon="i-heroicons-arrow-path"
              class="w-full sm:w-auto"
          >
            Try Again
          </UButton>

          <UButton
              @click="goBack"
              variant="ghost"
              size="lg"
              icon="i-heroicons-arrow-left"
              class="w-full sm:w-auto"
          >
            Go Back
          </UButton>
        </div>

        <!-- Additional Help -->
        <div class="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help? Try these options:
          </p>
          <div class="flex flex-wrap justify-center gap-6 text-sm">
            <ULink
                to="/contact"
                class="flex items-center gap-1 text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
              Contact Support
            </ULink>
            <ULink
                to="/systems/help"
                class="flex items-center gap-1 text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4" />
              Help Center
            </ULink>
            <ULink
                to="/status"
                class="flex items-center gap-1 text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              <UIcon name="i-heroicons-signal" class="w-4 h-4" />
              System Status
            </ULink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

// Define the error prop
const props = defineProps<{
  error: NuxtError
}>()

// Check if we're in development mode
const isDevelopment = process.dev

// Get appropriate icon based on error status
const getErrorIcon = (): string => {
  const statusCode = props.error.statusCode || 500

  switch (statusCode) {
    case 404:
      return 'i-heroicons-magnifying-glass'
    case 403:
      return 'i-heroicons-lock-closed'
    case 500:
      return 'i-heroicons-server-stack'
    case 503:
      return 'i-heroicons-wrench-screwdriver'
    default:
      return 'i-heroicons-exclamation-triangle'
  }
}

// Get error title based on status code
const getErrorTitle = (): string => {
  const statusCode = props.error.statusCode || 500

  switch (statusCode) {
    case 404:
      return 'Page Not Found'
    case 403:
      return 'Access Forbidden'
    case 500:
      return 'Server Error'
    case 503:
      return 'Service Unavailable'
    default:
      return 'Something Went Wrong'
  }
}

// Get error description based on status code
const getErrorDescription = (): string => {
  const statusCode = props.error.statusCode || 500

  switch (statusCode) {
    case 404:
      return 'The page you\'re looking for doesn\'t exist. It might have been moved, deleted, or you entered the wrong URL.'
    case 403:
      return 'You don\'t have permission to access this resource. Please check your credentials or contact support.'
    case 500:
      return 'We\'re experiencing some technical difficulties. Our team has been notified and is working to fix this.'
    case 503:
      return 'The service is temporarily unavailable. Please try again in a few moments.'
    default:
      return 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'
  }
}

// Handle error - clear error and redirect to home
const handleError = async () => {
  await clearError({ redirect: '/' })
}

// Refresh the page
const refresh = () => {
  window.location.reload()
}

// Go back to previous page
const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    handleError()
  }
}

// Set page meta
useSeoMeta({
  title: `${props.error.statusCode || 500} - ${getErrorTitle()}`,
  description: getErrorDescription(),
  robots: 'noindex,nofollow'
})
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Responsive typography */
@media (max-width: 640px) {
  .text-8xl {
    font-size: 6rem;
  }
}
</style>