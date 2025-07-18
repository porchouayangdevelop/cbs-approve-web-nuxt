<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding -->
    <div
        class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 text-white">
        <div class="max-w-md">
          <!-- Logo -->
          <div class="flex items-center mb-8">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <UIcon name="i-heroicons-squares-2x2" class="w-7 h-7 text-white"/>
            </div>
            <h1 class="text-2xl font-bold">CBS Approve Web</h1>
          </div>

          <!-- Hero Content -->
          <h2 class="text-4xl font-bold mb-6 leading-tight">
            Welcome to the system
            <span class="text-primary-200">Approve</span>
          </h2>
          <p class="text-xl text-primary-100 mb-8 leading-relaxed">
            Complete approval management system For organizations that need the most efficiency
          </p>

          <!-- Features -->
          <div class="space-y-4">
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3"/>
              <span class="text-primary-100">
              Advanced data reporting and analysis system
              </span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3"/>
              <span class="text-primary-100">
                Team work tools
              </span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3"/>
              <span class="text-primary-100">
                Corporate safety
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div
          class="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
      <div
          class="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
            <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 text-white"/>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">CBS Approve Web</h1>
        </div>
      </div>

      <!-- Login Form Component -->
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm
            ref="loginFormRef"
            @login="handleLogin"
            @forgot-password="handleForgotPassword"
            @help="handleHelp"
            @contact="handleContact"
        />
      </div>
      <!-- Loading indicator for auth operations -->
      <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3 min-w-[250px]">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span class="text-gray-900 dark:text-white">{{ loadingMessage }}</span>
        </div>
      </div>

      <!-- System Information -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <UCard class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div class="flex items-start space-x-3">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500 mt-0.5"/>
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-medium mb-1">System Access Information:</p>
              <p>Your role and permissions will be automatically determined from your account credentials. Access level
                includes dashboard, request management, and role-specific features.</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Footer Links -->
      <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 CBS Approve Web. All rights reserved.</p>
        <div class="mt-2 space-x-4">
          <UButton variant="link" size="xs" @click="handleHelp">Help</UButton>
          <UButton variant="link" size="xs" @click="handleContact">Contact</UButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'

definePageMeta({
  layout: false,
  middleware: []
})

// Types
interface LoginCredentials {
  username: string
  password: string
  remember: boolean
}

// State
const loginFormRef = ref()
const {isLoading} = useAuth();
const loadingMessage = ref('Sign in...');

// Event handlers
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    loginFormRef.value?.setLoading(true)
    loadingMessage.value = 'Authenticating...';

    // Call authentication service
    const {login} = useAuth()
    await login({
      username: credentials.username,
      password: credentials.password
    })

// Update loading message
    loadingMessage.value = 'Verifying credentials...'
    // Show a success message
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'login success',
    })

  } catch (error: any) {
    console.error('Login error:', error)

    // Show error message
    let errorMessage = 'There was an error logging in.'

    if (error?.response?.status === 401) {
      errorMessage = 'Username or password is incorrect'
    } else if (error?.response?.status === 403) {
      errorMessage = 'No permission to access'
    } else if (error?.response?.status === 429) {
      errorMessage = 'Too many login attempts, please wait'
    } else if (error?.message) {
      errorMessage = error.message
    }

    loginFormRef.value?.setError(errorMessage)
  } finally {
    loginFormRef.value?.setLoading(false)
  }
}

const handleForgotPassword = () => {
  navigateTo('/auth/forgot-password')
}

const handleHelp = () => {
  navigateTo('/help')
}

const handleContact = () => {
  navigateTo('/contact')
}


// SEO
useSeoMeta({
  title: 'Login - CBS Approve Web',
  description: 'Enter the online approval system. For system administrators, approval and general users'
})
</script>