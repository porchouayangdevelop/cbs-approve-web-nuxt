<template>
  <div class="w-full max-w-md mx-auto">
    <UCard class="shadow-xl">
      <template #header>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title || 'Login' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ subtitle || 'Please login to proceed.' }}
          </p>
        </div>
      </template>

      <UForm :schema="loginSchema" :state="loginForm" @submit="handleLogin" class="space-y-6">
        <!-- Username/Email Field -->
        <UFormField label="username" name="username" required>
          <UInput
              v-model="loginForm.username"
              type="text"
              :placeholder="usernamePlaceholder || 'Please enter the username.'"
              icon="i-heroicons-user"
              size="lg"
              :loading="loading"
              class="w-full"
          />
        </UFormField>

        <!-- Password Field -->
        <UFormField label="password" name="password" required>
          <UInput
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="passwordPlaceholder || 'Please enter the password.'"
              icon="i-heroicons-lock-closed"
              size="lg"
              :loading="loading"
              class="w-full"
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
        </UFormField>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between">
          <UCheckbox
              v-model="loginForm.remember"
              label="Remember the login"
              class="cursor-pointer"
          />
          <UButton
              variant="link"
              size="sm"
              @click="$emit('forgot-password')"
              class="text-primary-600 hover:text-primary-500"
          >
            Forget the password?
          </UButton>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div class="flex items-center">
            <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-500 mr-2" />
            <span class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            :disabled="loading || !isFormValid"
            class="cursor-pointer bg-primary-600 hover:bg-primary-700 text-white"
        >
          <template #leading>
            <UIcon v-if="!loading" name="i-heroicons-arrow-right-on-rectangle" />
          </template>
          <span v-if="!loading">{{ submitText || 'Login' }}</span>
          <span v-else>{{ loadingText || 'Log in...' }}</span>
        </UButton>
      </UForm>

      <!-- Register Link (Only for Admin) -->
<!--      <div v-if="showRegisterLink" class="mt-6 text-center">-->
<!--        <div class="relative">-->
<!--          <div class="absolute inset-0 flex items-center">-->
<!--            <div class="w-full border-t border-gray-300 dark:border-gray-600" />-->
<!--          </div>-->
<!--          <div class="relative flex justify-center text-sm">-->
<!--            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">-->
<!--              For system administrators-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="mt-4">-->
<!--          <p class="text-sm text-gray-600 dark:text-gray-400">-->
<!--            Want to create a new user account?-->
<!--          </p>-->
<!--          <UButton-->
<!--              variant="link"-->
<!--              size="sm"-->
<!--              @click="$emit('register')"-->
<!--              class="mt-1 text-primary-600 hover:text-primary-500"-->
<!--          >-->
<!--            Create Account (Admin only)-->
<!--          </UButton>-->
<!--        </div>-->
<!--      </div>-->

      <!-- Additional Links -->
      <div v-if="showHelpLinks" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-center space-x-6 text-sm">
          <UButton
              variant="link"
              size="xs"
              icon="i-heroicons-question-mark-circle"
              @click="$emit('help')"
          >
            help
          </UButton>
          <UButton
              variant="link"
              size="xs"
              icon="i-heroicons-phone"
              @click="$emit('contact')"
          >
            contact us
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Props
interface Props {
  title?: string
  subtitle?: string
  usernamePlaceholder?: string
  passwordPlaceholder?: string
  submitText?: string
  loadingText?: string
  showRegisterLink?: boolean
  showHelpLinks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRegisterLink: false,
  showHelpLinks: true
})

// Emits
const emit = defineEmits<{
  'login': [credentials: LoginCredentials]
  'forgot-password': []
  'register': []
  'help': []
  'contact': []
}>()

// Types
interface LoginCredentials {
  username: string
  password: string
  remember: boolean
}

// State
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Please enter the username.'),
  password: z.string().min(1, 'Please enter the password.')
})

// Computed
const isFormValid = computed(() => {
  try {
    loginSchema.parse(loginForm.value)
    return true
  } catch {
    return false
  }
})

// Methods
const handleLogin = async () => {
  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    // Validate form data
    const validatedData = loginSchema.parse(loginForm.value)

    // Emit login event to parent
    emit('login', validatedData)

  } catch (error) {
    if (error instanceof z.ZodError) {
      errorMessage.value = 'Incorrect '
    } else {
      errorMessage.value = 'There was an error in logging.'
    }
    console.error('Login form error:', error)
  } finally {
    loading.value = false
  }
}

// Reset form method
const resetForm = () => {
  loginForm.value = {
    username: '',
    password: '',
    remember: false
  }
  errorMessage.value = ''
  showPassword.value = false
}

// Set loading state (for parent component)
const setLoading = (state: boolean) => {
  loading.value = state
}

// Set error message (for parent component)
const setError = (message: string) => {
  errorMessage.value = message
}

// Expose methods to parent
defineExpose({
  resetForm,
  setLoading,
  setError
})
</script>