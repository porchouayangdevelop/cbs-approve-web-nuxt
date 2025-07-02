<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
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
            Start your journey with
            <span class="text-emerald-200">powerful tools</span>
          </h2>
          <p class="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join thousands of businesses already using our platform to streamline their operations and boost productivity.
          </p>

          <!-- Benefits -->
          <div class="space-y-4">
            <div class="flex items-center">
              <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 text-emerald-200 mr-3" />
              <span class="text-emerald-100">Quick 5-minute setup</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-emerald-200 mr-3" />
              <span class="text-emerald-100">Bank-level security</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-emerald-200 mr-3" />
              <span class="text-emerald-100">24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
    </div>

    <!-- Right Side - Register Form -->
    <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
            <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">AdminPanel</h1>
        </div>

        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <NuxtLink to="/cbs-approve-web-nuxt/pages/auth/login" class="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in here
            </NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <UCard class="shadow-xl">
          <template #header>
            <div class="text-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Get Started</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Create your account in seconds</p>
            </div>
          </template>

          <UForm :schema="registerSchema" :state="registerForm" @submit="handleRegister" class="space-y-6">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="First Name" name="firstName" required>
                <UInput
                    v-model="registerForm.firstName"
                    placeholder="John"
                    icon="i-heroicons-user"
                    :loading="loading"
                />
              </UFormGroup>

              <UFormGroup label="Last Name" name="lastName" required>
                <UInput
                    v-model="registerForm.lastName"
                    placeholder="Doe"
                    :loading="loading"
                />
              </UFormGroup>
            </div>

            <!-- Email Field -->
            <UFormGroup  label="Email" name="email" required>
              <UInput
                  class="py-1 w-full"
                  v-model="registerForm.email"
                  type="email"
                  placeholder="john@example.com"
                  icon="i-heroicons-envelope"
                  :loading="loading"
              />
            </UFormGroup>

            <!-- Company Field -->
            <UFormGroup label="Company" name="company">
              <UInput
                  class="py-1 w-full"
                  v-model="registerForm.company"
                  placeholder="Your company name"
                  icon="i-heroicons-building-office"
                  :loading="loading"
              />
            </UFormGroup>

            <!-- Password Field -->
            <UFormGroup label="Password" name="password" required>
              <UInput
                  class="py-1 w-full"
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a strong password"
                  icon="i-heroicons-lock-closed"
                  :loading="loading"
              >
                <template #trailing>
                  <UButton
                      class="py-1 w-full"
                      variant="ghost"
                      size="xs"
                      :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                      @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <!-- Confirm Password Field -->
            <UFormGroup label="Confirm Password" name="confirmPassword" required>
              <UInput
                  class="py-1 w-full"
                  v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  icon="i-heroicons-lock-closed"
                  :loading="loading"
              >
                <template #trailing>
                  <UButton
                      variant="subtle"
                      size="xs"
                      :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                      @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <!-- Password Strength Indicator -->
            <div v-if="registerForm.password" class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                <span :class="[
                  'text-xs font-medium',
                  passwordStrength.score >= 3 ? 'text-green-600' :
                  passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
                ]">
                  {{ passwordStrength.label }}
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    :class="[
                    'h-2 rounded-full transition-all duration-300',
                    passwordStrength.score >= 3 ? 'bg-green-500' :
                    passwordStrength.score >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                  ]"
                    :style="{ width: `${(passwordStrength.score / 4) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <UFormGroup name="acceptTerms">
              <UCheckbox
                  v-model="registerForm.acceptTerms"
                  :label="`I agree to the Terms of Service and Privacy Policy`"
                  required
              />
            </UFormGroup>

            <!-- Submit Button -->
            <UButton
                type="submit"
                block
                size="lg"
                color="emerald"
                :loading="loading"
                :disabled="loading"
            >
              <span v-if="!loading">Create Account</span>
              <span v-else>Creating account...</span>
            </UButton>
          </UForm>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or sign up with comming soon...</span>
              </div>
            </div>
          </div>

          <!-- Social Registration -->
          <div class="mt-6 grid grid-cols-2 gap-3">
            <UButton variant="outline" disabled block @click="signUpWithGoogle" :loading="socialLoading.google">
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

            <UButton variant="outline" disabled block @click="signUpWithGithub" :loading="socialLoading.github">
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
  layout: 'auth-session',
  middleware: []
})

// Form state
const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const socialLoading = ref({
  google: false,
  github: false
})

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Password strength calculation
const passwordStrength = computed(() => {
  const password = registerForm.value.password
  let score = 0

  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return {
    score,
    label: labels[score] || 'Very Weak'
  }
})

// Methods
const handleRegister = async (data: any) => {
  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Register data:', data)

    // Success - redirect to admin dashboard
    await navigateTo('/admin')

    // Show success notification
    // You can add toast notification here

  } catch (error) {
    console.error('Registration error:', error)
    // Show error notification
  } finally {
    loading.value = false
  }
}

const signUpWithGoogle = async () => {
  socialLoading.value.google = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Google sign up')
    await navigateTo('/admin')
  } catch (error) {
    console.error('Google sign up error:', error)
  } finally {
    socialLoading.value.google = false
  }
}

const signUpWithGithub = async () => {
  socialLoading.value.github = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('GitHub sign up')
    await navigateTo('/admin')
  } catch (error) {
    console.error('GitHub sign up error:', error)
  } finally {
    socialLoading.value.github = false
  }
}

// SEO
useSeoMeta({
  title: 'Create Account - AdminPanel',
  description: 'Create your admin account to start managing your business with powerful tools and insights.'
})
</script>