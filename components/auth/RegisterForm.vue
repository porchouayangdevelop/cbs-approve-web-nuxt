<template>
  <div class="w-full max-w-md mx-auto">
    <UCard class="shadow-xl">
      <template #header>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title || 'Create Account' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ subtitle || 'Fill in your information to get started' }}
          </p>
        </div>
      </template>

      <UForm :schema="registerSchema" :state="registerForm" @submit="handleRegister" class="space-y-4">
        <!-- Personal Information -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="First Name" name="firstName" required>
            <UInput
              v-model="registerForm.firstName"
              type="text"
              :placeholder="firstNamePlaceholder || 'Enter your first name'"
              icon="i-heroicons-user"
              size="lg"
              :loading="loading"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Last Name" name="lastName" required>
            <UInput
              v-model="registerForm.lastName"
              type="text"
              :placeholder="lastNamePlaceholder || 'Enter your last name'"
              icon="i-heroicons-user"
              size="lg"
              :loading="loading"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Username Field -->
        <UFormField label="Username" name="username" required>
          <UInput
            v-model="registerForm.username"
            type="text"
            :placeholder="usernamePlaceholder || 'Choose a username'"
            icon="i-heroicons-at-symbol"
            size="lg"
            :loading="loading"
            class="w-full"
          />
        </UFormField>

        <!-- Email Field -->
        <UFormField label="Email Address" name="email" required>
          <UInput
            v-model="registerForm.email"
            type="email"
            :placeholder="emailPlaceholder || 'Enter your email'"
            icon="i-heroicons-envelope"
            size="lg"
            :loading="loading"
            class="w-full"
          />
        </UFormField>

        <!-- Phone Field (Optional) -->
        <UFormField label="Phone Number" name="phone">
          <UInput
            v-model="registerForm.phone"
            type="tel"
            :placeholder="phonePlaceholder || 'Enter your phone number (optional)'"
            icon="i-heroicons-phone"
            size="lg"
            :loading="loading"
            class="w-full"
          />
        </UFormField>

        <!-- Department Field (Optional) -->
        <UFormField label="Department" name="department">
          <UInput
            v-model="registerForm.department"
            type="text"
            :placeholder="departmentPlaceholder || 'Your department (optional)'"
            icon="i-heroicons-building-office"
            size="lg"
            :loading="loading"
            class="w-full"
          />
        </UFormField>

        <!-- Position Field (Optional) -->
        <UFormField label="Position" name="position">
          <UInput
            v-model="registerForm.position"
            type="text"
            :placeholder="positionPlaceholder || 'Your position (optional)'"
            icon="i-heroicons-briefcase"
            size="lg"
            :loading="loading"
            class="w-full"
          />
        </UFormField>

        <!-- Password Field -->
        <UFormField label="Password" name="password" required>
          <UInput
            v-model="registerForm.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="passwordPlaceholder || 'Create a password'"
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

        <!-- Password Strength Indicator -->
        <div v-if="registerForm.password" class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-600 dark:text-gray-400">Password strength</span>
            <span :class="[
              'text-xs font-medium',
              passwordStrength.score >= 3 ? 'text-green-600' : 
              passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
            ]">
              {{ passwordStrength.label }}
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div :class="[
              'h-2 rounded-full transition-all duration-300',
              passwordStrength.score >= 3 ? 'bg-green-500' : 
              passwordStrength.score >= 2 ? 'bg-yellow-500' : 'bg-red-500'
            ]" :style="{ width: `${(passwordStrength.score / 4) * 100}%` }"></div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <UFormField name="acceptTerms" required>
          <UCheckbox
            v-model="registerForm.acceptTerms"
            class="cursor-pointer"
          >
            <template #label>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                I agree to the 
                <UButton variant="link" size="xs" @click="$emit('view-terms')" class="p-0 h-auto text-blue-600 hover:text-blue-500">
                  Terms of Service
                </UButton>
                and 
                <UButton variant="link" size="xs" @click="$emit('view-privacy')" class="p-0 h-auto text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </UButton>
              </span>
            </template>
          </UCheckbox>
        </UFormField>

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
          class="cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          color="blue"
        >
          <template #leading>
            <UIcon v-if="!loading" name="i-heroicons-user-plus" />
          </template>
          <span v-if="!loading">{{ submitText || 'Create Account' }}</span>
          <span v-else>{{ loadingText || 'Creating account...' }}</span>
        </UButton>
      </UForm>

      <!-- Account Creation Info -->
      <div class="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-start space-x-2">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-blue-500 mt-0.5" />
          <div class="text-xs text-blue-700 dark:text-blue-300">
            <p class="font-medium">Account Verification</p>
            <p>Your account will be reviewed and activated by an administrator. You'll receive an email confirmation once approved.</p>
          </div>
        </div>
      </div>

      <!-- Login Link -->
      <div v-if="showLoginLink" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-center text-sm">
          <span class="text-gray-600 dark:text-gray-400">Already have an account? </span>
          <UButton
            variant="link"
            size="xs"
            @click="$emit('login')"
            class="text-blue-600 hover:text-blue-500"
          >
            Sign in here
          </UButton>
        </div>
      </div>

      <!-- Help Links -->
      <div v-if="showHelpLinks" class="mt-4">
        <div class="flex justify-center space-x-6 text-sm">
          <UButton
            variant="link"
            size="xs"
            icon="i-heroicons-question-mark-circle"
            @click="$emit('help')"
            class="text-blue-600 hover:text-blue-500"
          >
            Help
          </UButton>
          <UButton
            variant="link"
            size="xs"
            icon="i-heroicons-phone"
            @click="$emit('contact')"
            class="text-blue-600 hover:text-blue-500"
          >
            Contact Support
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
  firstNamePlaceholder?: string
  lastNamePlaceholder?: string
  usernamePlaceholder?: string
  emailPlaceholder?: string
  phonePlaceholder?: string
  departmentPlaceholder?: string
  positionPlaceholder?: string
  passwordPlaceholder?: string
  submitText?: string
  loadingText?: string
  showLoginLink?: boolean
  showHelpLinks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLoginLink: true,
  showHelpLinks: true
})

// Emits
const emit = defineEmits<{
  'register': [credentials: RegisterCredentials]
  'login': []
  'help': []
  'contact': []
  'view-terms': []
  'view-privacy': []
}>()

// Types
interface RegisterCredentials {
  firstName: string
  lastName: string
  username: string
  email: string
  phone?: string
  department?: string
  position?: string
  password: string
  acceptTerms: boolean
}

// State
const registerForm = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  password: '',
  acceptTerms: false
})

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'Please enter your first name.'),
  lastName: z.string().min(1, 'Please enter your last name.'),
  username: z
    .string()
    .min(5, 'Username must be at least 5 characters.')
    .max(20, 'Username must be less than 20 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must include uppercase, lowercase, number, and special character'
    ),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions.')
})

// Computed
const isFormValid = computed(() => {
  try {
    registerSchema.parse(registerForm.value)
    return true
  } catch {
    return false
  }
})

const passwordStrength = computed(() => {
  const password = registerForm.value.password
  if (!password) return { score: 0, label: 'Very weak' }
  
  let score = 0
  
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++
  
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  return {
    score,
    label: labels[score] || 'Very weak'
  }
})

// Methods
const handleRegister = async () => {
  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    // Validate form data
    const validatedData = registerSchema.parse(registerForm.value)

    // Emit register event to parent
    emit('register', validatedData)

  } catch (error) {
    if (error instanceof z.ZodError) {
      errorMessage.value = error.errors[0].message
    } else {
      errorMessage.value = 'There was an error creating your account.'
    }
    console.error('Register form error:', error)
  } finally {
    loading.value = false
  }
}

// Reset form method
const resetForm = () => {
  registerForm.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    password: '',
    acceptTerms: false
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