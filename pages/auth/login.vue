<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 text-white">
        <div class="max-w-md">
          <!-- Logo -->
          <div class="flex items-center mb-8">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <UIcon name="i-heroicons-squares-2x2" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-2xl font-bold">AdminPanel</h1>
          </div>

          <!-- Hero Content -->
          <h2 class="text-4xl font-bold mb-6 leading-tight">
            Welcome back to your
            <span class="text-primary-200">admin dashboard</span>
          </h2>
          <p class="text-xl text-primary-100 mb-8 leading-relaxed">
            Manage your business with powerful tools and insights. Sign in to continue your journey.
          </p>

          <!-- Features -->
          <div class="space-y-4">
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3" />
              <span class="text-primary-100">Advanced Analytics & Reporting</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3" />
              <span class="text-primary-100">Team Collaboration Tools</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3" />
              <span class="text-primary-100">Enterprise-grade Security</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
            <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">AdminPanel</h1>
        </div>

        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Or
            <NuxtLink to="/cbs-approve-web-nuxt/pages/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <UCard class="shadow-xl">
          <template #header>
            <div class="text-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Welcome Back</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Please sign in to continue</p>
            </div>
          </template>

          <UForm :schema="loginSchema" :state="loginForm" @submit="handleLogin" class="space-y-6">
            <!-- Email Field -->
            <UFormGroup label="Email" name="email" required>
              <UInput
                  v-model="loginForm.email"
                  type="email"
                  placeholder="Enter your email"
                  icon="i-heroicons-envelope"
                  size="lg"
                  :loading="loading"
                  class="my-1 w-full"
              />
            </UFormGroup>

            <!-- Password Field -->
            <UFormGroup label="Password" name="password" required>
              <UInput class="my-1 w-full"
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  :loading="loading"
              >
                <template #trailing>
                  <UButton
                      variant="ghost"
                      size="xs"
                      :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                      @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between">
              <UCheckbox v-model="loginForm.remember" label="Remember me" class="cursor-pointer" />
              <NuxtLink to="/cbs-approve-web-nuxt/pages/auth/forgot-password" class="text-sm text-primary-600 hover:text-primary-500">
                Forgot password?
              </NuxtLink>
            </div>

            <!-- Submit Button -->
            <UButton
                type="submit"
                block
                size="lg"
                :loading="loading"
                :disabled="loading"
                class="cursor-pointer bg-primary-600 hover:bg-primary-700 text-white"
            >
              <span v-if="!loading">Sign In</span>
              <span v-else>Signing in...</span>
            </UButton>
          </UForm>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with comming soon...</span>
              </div>
            </div>
          </div>

          <!-- Social Login -->
          <div class="mt-6 grid grid-cols-2 gap-3">
            <UButton variant="outline" disabled block @click="signInWithGoogle" :loading="socialLoading.google">
              <template #leading>
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </template>
              Google
            </UButton>

            <UButton variant="outline" disabled block @click="signInWithGithub" :loading="socialLoading.github">
              <template #leading>
                <UIcon name="i-simple-icons-github" class="w-5 h-5" />
              </template>
              GitHub
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Form state
const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const showPassword = ref(false)
const socialLoading = ref({
  google: false,
  github: false
})

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// Methods
const handleLogin = async (data: any) => {
  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Login data:', data)

    // Success - redirect to admin dashboard
    await navigateTo('/')

    // Show success notification
    // You can add toast notification here

  } catch (error) {
    console.error('Login error:', error)
    // Show error notification
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  socialLoading.value.google = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Google sign in')
    await navigateTo('/admin')
  } catch (error) {
    console.error('Google sign in error:', error)
  } finally {
    socialLoading.value.google = false
  }
}

const signInWithGithub = async () => {
  socialLoading.value.github = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('GitHub sign in')
    await navigateTo('/admin')
  } catch (error) {
    console.error('GitHub sign in error:', error)
  } finally {
    socialLoading.value.github = false
  }
}

// SEO
useSeoMeta({
  title: 'Sign In - AdminPanel',
  description: 'Sign in to your admin dashboard to manage your business with powerful tools and insights.'
})
</script>