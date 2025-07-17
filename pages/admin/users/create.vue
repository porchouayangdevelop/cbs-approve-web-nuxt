<template>
  <div class="">
    <div class="flex-1 flex flex-col justify-center px-6  lg:px-1  ">
      <div class="">
        <div class="">
          <!-- Registration Form (Show only after admin verification) -->
          <!--        v-if="isAdminVerified"-->
          <div>
            <UCard class="shadow-xl">
              <template #header>
                <div class="text-center">
                  <div class="flex items-center justify-center mb-2">
                    <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2"/>
                    <span class="text-green-600 font-medium">The rights have been confirmed.</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create a user</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Fill in new user information</p>
                </div>
              </template>

              <UForm :schema="registerSchema" :state="state" @submit="handleRegister" class="space-y-4">
                <!-- User Type Selection -->
                <UFormField label="UserType" name="userType" required>
                  <USelectMenu
                      v-model="state.userType"
                      value-key="value"
                      :items="userTypeOptions"
                      placeholder="Select user type"
                      icon="i-heroicons-shield-check"
                      size="md"
                      class="w-full mb-[.2rem]"
                  />
                </UFormField>

                <!-- Personal Information -->
                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="FirstName" name="firstName">
                    <UInput
                        v-model="state.firstName"
                        placeholder="First name"
                        icon="i-heroicons-user"
                        :loading="loading"
                        class="w-full mb-[.2rem]"
                    />
                  </UFormField>

                  <UFormField label="LastName" name="lastName" required>
                    <UInput
                        v-model="state.lastName"
                        placeholder="Last name"
                        :loading="loading"
                        class="w-full mb-[.2rem]"
                    />
                  </UFormField>
                </div>

                <!-- Username -->
                <UFormField label="Username" name="username" required>
                  <UInput
                      v-model="state.username"
                      placeholder="Username for login"
                      icon="i-heroicons-at-symbol"
                      :loading="loading"
                      class="w-full mb-[.2rem] normal-case"
                  />
                </UFormField>

                <!-- Email -->
                <UFormField label="Email" name="email" required>
                  <UInput
                      v-model="state.email"
                      type="email"
                      placeholder="example@company.com"
                      icon="i-heroicons-envelope"
                      :loading="loading"
                      class="w-full mb-[.2rem]"
                  />
                </UFormField>

                <!-- Department -->
                <UFormField label="Department" name="department" required>
                  <USelectMenu
                      v-model="state.department"
                      :options="departmentOptions"
                      :items="departmentOptions"
                      icon="i-heroicons-academic-cap"
                      placeholder="Select department"
                      class="w-full mb-[.2rem]"
                  />
                </UFormField>

                <!-- Phone -->
                <UFormField label="Phone" name="phone">
                  <UInput
                      v-model="state.phone"
                      placeholder="020-XX-XXX-XXX"
                      icon="i-heroicons-phone"
                      :loading="loading"
                      class="w-full mb-[.2rem]"
                  />
                </UFormField>

                <!-- Password -->
                <UFormField label="Password" name="password" required>
                  <UInput
                      v-model="state.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Password"
                      icon="i-heroicons-lock-closed"
                      :loading="loading"
                      class="w-full mb-[.2rem]"
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

                <!-- Confirm Password -->
                <UFormField label="Confirm Password" name="confirmPassword" required>
                  <UInput
                      v-model="state.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Confirm password"
                      icon="i-heroicons-lock-closed"
                      :loading="loading"
                      class="w-full mb-[.2rem]"
                  >
                    <template #trailing>
                      <UButton
                          variant="ghost"
                          size="xs"
                          :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                          @click="showConfirmPassword = !showConfirmPassword"
                      />
                    </template>
                  </UInput>
                </UFormField>

                <!-- Password Strength Indicator -->
                <div v-if="state.password" class="space-y-2">
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
                <UFormField name="acceptTerms">
                  <UCheckbox
                      v-model="state.acceptTerms"
                      label="Accept the Terms of Use and Privacy Policy."
                      required
                      class="cursor-pointer my-1"
                  />
                </UFormField>

                <!-- Submit Button -->
                <UButton
                    type="submit"
                    block
                    size="lg"
                    :loading="loading"
                    :disabled="loading"
                    color="error"
                    class="cursor-pointer"
                    variant="outline"
                    @click="handleRegister"
                >
                  <template #leading>
                    <UIcon v-if="!loading" name="i-heroicons-user-plus"/>
                  </template>
                  <span v-if="!loading">Create User Account</span>
                  <span v-else>Creating account...</span>
                </UButton>
              </UForm>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {z} from 'zod'
import {useDepartmentWithSignUp} from "~/composables/useDepartmentWithSignUp";
import type {FormSubmitEvent} from '@nuxt/ui'

definePageMeta({
  layout: 'admin-session', // Use admin session layout
  middleware: ['auth-guard', 'admin-guard'] // Require authentication to access
})

// Interfaces
interface RegisterForm {
  userType: string
  firstName: string
  lastName: string
  username: string
  email: string
  department: string
  phone: string
  password: string
  // confirmPassword: string
  acceptTerms: boolean
}

interface UserCreateRequest {
  userType: string
  username: string
  firstName: string
  lastName: string
  email: string
  department: string
  phone: string
  enabled: boolean
  emailVerified: boolean
  credentials: Array<{
    type: string
    value: string
    temporary: boolean
  }>
}

// State
const isAdminVerified = ref(false)
const adminCode = ref('')
const verifyingAdmin = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)


// Form data - using simple reactive object
const form = ref<RegisterForm>({
  userType: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  department: '',
  phone: '',
  password: '',
  // confirmPassword: '',
  acceptTerms: false
})


// Options
const userTypeOptions = [
  {label: 'Admin', value: 'admin'},
  {label: 'Checker', value: 'checker'},
  {label: 'User', value: 'user'}
]

const departmentOptions = useDepartmentWithSignUp();

// Validation schema
const registerSchema = z.object({
  userType: z.string().min(1, 'Please select user type.'),
  firstName: z.string().min(2, 'First name must contain at least 2 characters.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long.'),
  username: z.string().min(8, 'Username must contain at least 8 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  department: z.string().min(1, 'Please select a department.'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must contain at least 8 characters.').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must include uppercase, lowercase, number, and special character'),
  // confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val, 'Please accept the terms of use.')
})
//     .refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"]
// })

type Schema = z.output<typeof registerSchema>

const state = reactive<Partial<Schema>>({
  userType: undefined,
  firstName: undefined,
  lastName: undefined,
  username: undefined,
  email: undefined,
  department: undefined,
  phone: undefined,
  password: undefined,
  // confirmPassword: undefined,
  acceptTerms: undefined,
})


// Computed
const isFormValid = computed(() => {
  try {
    registerSchema.parse(state)
    return true
  } catch {
    return false
  }
})

const passwordStrength = computed(() => {
  const password = state.password
  let score = 0

  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++

  const labels = ['Very soft', 'Weak', 'Medium', 'Strong', 'Very strong']
  return {
    score,
    label: labels[score] || 'Very soft'
  }
})

// Methods

const verifyAdminCode = async () => {
  verifyingAdmin.value = true

  try {
    // Simulate admin code verification
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock verification - in real app, verify against backend
    if (adminCode.value === 'ADMIN2024' || adminCode.value === 'CBS_ADMIN') {
      isAdminVerified.value = true

      const toast = useToast()
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: 'Successfully confirmed',
        description: 'You can now create an account.',
        color: 'success',
      })
    } else {
      throw new Error('Administrator code is invalid.')
    }

  } catch (error: any) {
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Unable to verify eligibility',
      description: error.message || 'Administrator code is invalid.',
      color: 'error',
    })

    adminCode.value = ''
  } finally {
    verifyingAdmin.value = false
  }
}

const handleRegister = async () => {
  loading.value = true;
  const toast = useToast();
  try {
    // Validate form data
    const validatedData = registerSchema.parse(state)
    console.log(validatedData)

    // Transform form data to API request format
    // const requestData = transformFormToRequest(validatedData)

    const registeredUser = userStorageService.addUserFromRegistration({
      userType: validatedData.userType,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      username: validatedData.username,
      email: validatedData.email,
      department: validatedData.department,
      phone: validatedData.phone,
      password: validatedData.password
    });

    console.log(`User registered in your format :`, registeredUser);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Show success message
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'Account created successfully',
      description: `Created account ${validatedData.userType} for ${validatedData.firstName} ${validatedData.lastName}`,
      color: 'success',
    })

    // Reset form
    form.value = {
      userType: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      department: '',
      phone: '',
      password: '',
      // confirmPassword: '',
      acceptTerms: false
    }

    // Redirect to login after delay
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 2000)

  } catch (error: any) {
    console.error('Registration error:', error)

    const toast = useToast()
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      toast.add({
        icon: 'i-heroicons-exclamation-circle',
        title: 'Validation Error',
        description: firstError.message,
        color: 'error',
      })
    } else {
      toast.add({
        icon: 'i-heroicons-exclamation-circle',
        title: 'Unable to create account',
        description: error.message || 'An error occurred while creating your account. Please try again.',
        color: 'error',
      })
    }
  } finally {
    loading.value = false
  }
}

// Check if user is admin on mount
onMounted(async () => {
  const {user} = useAuth()

  // If user is already logged in and is admin, skip verification
  if (user.value && user.value.role === 'admin') {
    isAdminVerified.value = true
  }
})

// SEO
useSeoMeta({
  title: 'Create a user account',
  description: 'Create a new user account for the CBS Approve Web system (administrators only)',
  robots: 'noindex,nofollow'
})
</script>
<style scoped>

</style>