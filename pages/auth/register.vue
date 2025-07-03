<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Admin Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 text-white">
        <div class="max-w-md">
          <!-- Logo -->
          <div class="flex items-center mb-8">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <UIcon name="i-heroicons-shield-check" class="w-7 h-7 text-white"/>
            </div>
            <h1 class="text-2xl font-bold">CBS Admin Portal</h1>
          </div>

          <!-- Hero Content -->
          <h2 class="text-4xl font-bold mb-6 leading-tight">
            สร้างบัญชี
            <span class="text-red-200">ผู้ดูแลระบบ</span>
          </h2>
          <p class="text-xl text-red-100 mb-8 leading-relaxed">
            สร้างบัญชีผู้ใช้งานใหม่สำหรับระบบ CBS Approve Web ด้วยสิทธิ์การเข้าถึงที่เหมาะสม
          </p>

          <!-- Admin Features -->
          <div class="space-y-4">
            <div class="flex items-center">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-red-200 mr-3"/>
              <span class="text-red-100">จัดการผู้ใช้และสิทธิ์การเข้าถึง</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-red-200 mr-3"/>
              <span class="text-red-100">ควบคุมการตั้งค่าระบบ</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-red-200 mr-3"/>
              <span class="text-red-100">ติดตามและรายงานผล</span>
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

    <!-- Right Side - Registration Form -->
    <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
            <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-white"/>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">CBS Admin</h1>
        </div>

        <!-- Header -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">สร้างบัญชีผู้ใช้งาน</h2>
          <div class="mt-2 flex items-center justify-center">
            <UBadge color="error" variant="soft" size="sm">
              <UIcon name="i-heroicons-shield-check" class="w-3 h-3 mr-1"/>
              สำหรับผู้ดูแลระบบเท่านั้น
            </UBadge>
          </div>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            มีบัญชีอยู่แล้ว?
            <NuxtLink to="/auth/login" class="font-medium text-red-600 hover:text-red-500">
              เข้าสู่ระบบที่นี่
            </NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Admin Verification -->
        <div v-if="!isAdminVerified" class="mb-6">
          <UCard class="border-red-200 dark:border-red-800">
            <template #header>
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5 text-red-500"/>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">ยืนยันสิทธิ์ผู้ดูแลระบบ</h3>
              </div>
            </template>

            <div class="space-y-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                กรุณาป้อนรหัสผู้ดูแลระบบเพื่อยืนยันสิทธิ์ในการสร้างบัญชีใหม่
              </p>

              <UFormGroup label="รหัสผู้ดูแลระบบ" required>
                <UInput
                    v-model="adminCode"
                    type="password"
                    placeholder="ป้อนรหัสผู้ดูแลระบบ"
                    icon="i-heroicons-key"
                    :loading="verifyingAdmin"
                />
              </UFormGroup>

              <UButton
                  @click="verifyAdminCode"
                  :loading="verifyingAdmin"
                  :disabled="!adminCode.trim()"
                  block
                  color="error"
                  class="cursor-pointer"
              >
                ยืนยันสิทธิ์
              </UButton>

              <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                ติดต่อผู้ดูแลระบบหลักหากต้องการรหัสผู้ดูแลระบบ
              </div>
            </div>
          </UCard>
        </div>

        <!-- Registration Form (Show only after admin verification) -->
        <div v-else>
          <UCard class="shadow-xl">
            <template #header>
              <div class="text-center">
                <div class="flex items-center justify-center mb-2">
                  <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mr-2"/>
                  <span class="text-green-600 font-medium">สิทธิ์ได้รับการยืนยันแล้ว</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">สร้างบัญชีผู้ใช้งาน</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">กรอกข้อมูลผู้ใช้งานใหม่</p>
              </div>
            </template>

            <UForm :schema="registerSchema" :state="registerForm" @submit="handleRegister" class="space-y-6">
              <!-- User Type Selection -->
              <UFormGroup label="ประเภทผู้ใช้งาน" name="userType" required>
                <USelectMenu
                    v-model="registerForm.userType"
                    :options="userTypeOptions"
                    placeholder="เลือกประเภทผู้ใช้งาน"
                    size="lg"
                />
              </UFormGroup>

              <!-- Personal Information -->
              <div class="grid grid-cols-2 gap-4">
                <UFormGroup label="ชื่อ" name="firstName" required>
                  <UInput
                      v-model="registerForm.firstName"
                      placeholder="ชื่อ"
                      icon="i-heroicons-user"
                      :loading="loading"
                  />
                </UFormGroup>

                <UFormGroup label="นามสกุล" name="lastName" required>
                  <UInput
                      v-model="registerForm.lastName"
                      placeholder="นามสกุล"
                      :loading="loading"
                  />
                </UFormGroup>
              </div>

              <!-- Username -->
              <UFormGroup label="ชื่อผู้ใช้งาน" name="username" required>
                <UInput
                    v-model="registerForm.username"
                    placeholder="ชื่อผู้ใช้งานสำหรับเข้าสู่ระบบ"
                    icon="i-heroicons-at-symbol"
                    :loading="loading"
                />
              </UFormGroup>

              <!-- Email -->
              <UFormGroup label="อีเมล" name="email" required>
                <UInput
                    v-model="registerForm.email"
                    type="email"
                    placeholder="example@company.com"
                    icon="i-heroicons-envelope"
                    :loading="loading"
                />
              </UFormGroup>

              <!-- Department -->
              <UFormGroup label="แผนก" name="department" required>
                <USelectMenu
                    v-model="registerForm.department"
                    :options="departmentOptions"
                    placeholder="เลือกแผนก"
                />
              </UFormGroup>

              <!-- Phone -->
              <UFormGroup label="หมายเลขโทรศัพท์" name="phone">
                <UInput
                    v-model="registerForm.phone"
                    placeholder="08X-XXX-XXXX"
                    icon="i-heroicons-phone"
                    :loading="loading"
                />
              </UFormGroup>

              <!-- Password -->
              <UFormGroup label="รหัสผ่าน" name="password" required>
                <UInput
                    v-model="registerForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="สร้างรหัสผ่านที่แข็งแกร่ง"
                    icon="i-heroicons-lock-closed"
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

              <!-- Confirm Password -->
              <UFormGroup label="ยืนยันรหัสผ่าน" name="confirmPassword" required>
                <UInput
                    v-model="registerForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="ยืนยันรหัสผ่าน"
                    icon="i-heroicons-lock-closed"
                    :loading="loading"
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
              </UFormGroup>

              <!-- Password Strength Indicator -->
              <div v-if="registerForm.password" class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-600 dark:text-gray-400">ความแข็งแกร่งของรหัสผ่าน</span>
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
                    label="ยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว"
                    required
                />
              </UFormGroup>

              <!-- Submit Button -->
              <UButton
                  type="submit"
                  block
                  size="lg"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                  color="error"
                  class="cursor-pointer"
              >
                <template #leading>
                  <UIcon v-if="!loading" name="i-heroicons-user-plus"/>
                </template>
                <span v-if="!loading">สร้างบัญชีผู้ใช้งาน</span>
                <span v-else>กำลังสร้างบัญชี...</span>
              </UButton>
            </UForm>
          </UCard>
        </div>

        <!-- Security Notice -->
        <div class="mt-6">
          <UCard class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5 text-yellow-500 mt-0.5"/>
              <div class="text-sm text-yellow-700 dark:text-yellow-300">
                <p class="font-medium mb-1">ข้อควรระวัง:</p>
                <ul class="list-disc list-inside space-y-1 text-xs">
                  <li>บัญชีที่สร้างขึ้นจะได้รับสิทธิ์ตามประเภทที่เลือก</li>
                  <li>ผู้ดูแลระบบสามารถแก้ไขสิทธิ์ได้ภายหลัง</li>
                  <li>ข้อมูลทั้งหมดจะถูกเข้ารหัสและป้องกันอย่างปลอดภัย</li>
                </ul>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {z} from 'zod'

definePageMeta({
  layout: false,
  middleware: ['auth-guard'] // Require authentication to access
})

// State
const isAdminVerified = ref(false)
const adminCode = ref('')
const verifyingAdmin = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const registerForm = ref({
  userType: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  department: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// Options
const userTypeOptions = [
  {label: 'ผู้ดูแลระบบ (Admin)', value: 'admin'},
  {label: 'ผู้อนุมัติ (Checker)', value: 'checker'},
  {label: 'ผู้ใช้งานทั่วไป (User)', value: 'user'}
]

const departmentOptions = [
  'เทคโนโลยีสารสนเทศ',
  'ทรัพยากรบุคคล',
  'การเงินและบัญชี',
  'การตลาด',
  'การขาย',
  'ปฏิบัติการ',
  'กฎหมายและกำกับดูแล',
  'อื่นๆ'
]

// Validation schema
const registerSchema = z.object({
  userType: z.string().min(1, 'กรุณาเลือกประเภทผู้ใช้งาน'),
  firstName: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  lastName: z.string().min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'),
  username: z.string().min(3, 'ชื่อผู้ใช้งานต้องมีอย่างน้อย 3 ตัวอักษร'),
  email: z.string().email('กรุณาป้อนอีเมลที่ถูกต้อง'),
  department: z.string().min(1, 'กรุณาเลือกแผนก'),
  phone: z.string().optional(),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'กรุณายอมรับเงื่อนไขการใช้งาน')
}).refine(data => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"]
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
  let score = 0

  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++

  const labels = ['อ่อนมาก', 'อ่อน', 'ปานกลาง', 'แข็งแกร่ง', 'แข็งแกร่งมาก']
  return {
    score,
    label: labels[score] || 'อ่อนมาก'
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
        title: 'ยืนยันสิทธิ์สำเร็จ',
        description: 'คุณสามารถสร้างบัญชีผู้ใช้งานได้แล้ว',
        color: 'success',
        // timeout: 3000
      })
    } else {
      throw new Error('รหัสผู้ดูแลระบบไม่ถูกต้อง')
    }

  } catch (error: any) {
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'ไม่สามารถยืนยันสิทธิ์ได้',
      description: error.message || 'รหัสผู้ดูแลระบบไม่ถูกต้อง',
      color: 'error',
      // timeout: 5000
    })

    adminCode.value = ''
  } finally {
    verifyingAdmin.value = false
  }
}

const handleRegister = async (data: any) => {
  loading.value = true

  try {
    // Validate form data
    const validatedData = registerSchema.parse(data)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Creating user:', validatedData)

    // Show success message
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'สร้างบัญชีสำเร็จ',
      description: `สร้างบัญชี ${validatedData.userType} สำหรับ ${validatedData.firstName} ${validatedData.lastName} เรียบร้อยแล้ว`,
      color: 'success',
      // timeout: 5000
    })

    // Redirect to login
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 2000)

  } catch (error: any) {
    console.error('Registration error:', error)

    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'ไม่สามารถสร้างบัญชีได้',
      description: error.message || 'เกิดข้อผิดพลาดในการสร้างบัญชี กรุณาลองใหม่อีกครั้ง',
      color: 'error',
      // timeout: 5000
    })
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
  title: 'สร้างบัญชีผู้ใช้งาน - CBS Approve Web',
  description: 'สร้างบัญชีผู้ใช้งานใหม่สำหรับระบบ CBS Approve Web (เฉพาะผู้ดูแลระบบ)',
  robots: 'noindex,nofollow'
})
</script>