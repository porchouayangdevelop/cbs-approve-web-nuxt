<template>
  <div class="w-full max-w-md mx-auto">
    <UCard class="shadow-xl">
      <template #header>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title || 'Sign In' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ subtitle || 'Enter your credentials to continue' }}
          </p>
        </div>
      </template>

      <UForm :schema="loginSchema" :state="loginForm" @submit="handleLogin" class="space-y-6">
        <!-- Username/Email Field -->
        <UFormField label="ລະຫັດພະນັກງານ" name="username" required>
          <UInput
              v-model="loginForm.username"
              type="text"
              :placeholder="usernamePlaceholder || 'ປ້ອນລະຫັດພະນັກງານ'"
              icon="i-heroicons-user"
              size="lg"
              :loading="loading"
              class="w-full"
          />
        </UFormField>

        <!-- Password Field -->
        <UFormField label="ລະຫັດຜ່ານ" name="password" required>
          <UInput
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="passwordPlaceholder || 'ປ້ອນລະຫັດຜ່ານ'"
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
              label="ຈື່ຈຳຂ້ອຍ"
              class="cursor-pointer"
          />
          <UButton
              variant="link"
              size="sm"
              @click="$emit('forgot-password')"
              class="text-primary-600 hover:text-primary-500"
          >
            ລືມລະຫັດຜ່ານ?
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
            class="cursor-pointer"
        >
          <template #leading>
            <UIcon v-if="!loading" name="i-heroicons-arrow-right-on-rectangle" />
          </template>
          <span v-if="!loading">{{ submitText || 'ເຂົ້າສູ່ລະບົບ' }}</span>
          <span v-else>{{ loadingText || 'ກຳລັງເຂົ້າສູ່ລະບົບ...' }}</span>
        </UButton>
      </UForm>

      <!-- Role Auto-Detection Info -->
      <div class="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-start space-x-2">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-blue-500 mt-0.5" />
          <div class="text-xs text-blue-700 dark:text-blue-300">
            <p class="font-medium">ການກວດຫາລະດັບການເຂົ້າເຖິງອັດຕະໂນມັດ</p>
            <p>ບົດບາດ ແລະການອະນຸຍາດຂອງທ່ານຖືກກໍານົດໂດຍອັດຕະໂນມັດຈາກຂໍ້ມູນປະຈໍາບັນຊີຂອງທ່ານ.</p>
          </div>
        </div>
      </div>

      <!-- Help Links -->
      <!-- <div v-if="showHelpLinks" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-center space-x-6 text-sm">
          <UButton
              variant="link"
              size="xs"
              icon="i-heroicons-question-mark-circle"
              @click="$emit('help')"
          >
            Help
          </UButton>
          <UButton
              variant="link"
              size="xs"
              icon="i-heroicons-phone"
              @click="$emit('contact')"
          >
            Contact Support
          </UButton>
        </div>
      </div> -->
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

// Set loading state (for a parent component)
const setLoading = (state: boolean) => {
  loading.value = state
}

// Set error message (for a parent component)
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