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
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3" />
              <span class="text-primary-100">
              Advanced data reporting and analysis system
              </span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3" />
              <span class="text-primary-100">
                Team work tools
              </span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-200 mr-3" />
              <span class="text-primary-100">
                Corporate safety
              </span>
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
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">CBS Approve Web</h1>
        </div>

        <!-- Role Selector -->
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose the type of user</h2>
          <div class="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
                v-for="role in availableRoles"
                :key="role.key"
                @click="selectedRole = role.key"
                :class="[
                'py-2 px-3 text-sm font-medium rounded-md transition-all duration-200',
                selectedRole === role.key
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              ]"
            >
              <UIcon :name="role.icon" class="w-4 h-4 mx-auto mb-1" />
              <div class="text-xs">{{ role.label }}</div>
            </button>
          </div>
        </div>

        <!-- Selected Role Info -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm" :class="getCurrentRoleStyle().class">
            <UIcon :name="getCurrentRoleStyle().icon" class="w-4 h-4 mr-2" />
            <span>{{ getCurrentRoleStyle().description }}</span>
          </div>
        </div>
      </div>

      <!-- Login Form Component -->
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm
            ref="loginFormRef"
            :title="getLoginTitle()"
            :subtitle="getLoginSubtitle()"
            :username-placeholder="getUsernamePlaceholder()"
            :show-register-link="selectedRole === 'admin'"
            @login="handleLogin"
            @forgot-password="handleForgotPassword"
            @help="handleHelp"
            @contact="handleContact"
        />
      </div>

      <!-- Role Information -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <UCard v-if="selectedRole" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div class="flex items-start space-x-3">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500 mt-0.5" />
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-medium mb-1">System login information:</p>
              <p>{{ getRoleInfo() }}</p>
            </div>
          </div>
        </UCard>
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

interface UserRole {
  key: string
  label: string
  icon: string
  description: string
  redirectPath: string
}

// State
const selectedRole = ref()
const loginFormRef = ref()

// Available roles
const availableRoles: UserRole[] = [
  {
    key: 'admin',
    label: 'admin',
    icon: 'i-heroicons-shield-check',
    description: 'Manage systems and users',
    redirectPath: '/admin'
  },
  {
    key: 'checker',
    label: 'checker',
    icon: 'i-heroicons-check-circle',
    description: 'Approve and check the request',
    redirectPath: '/checkers'
  },
  {
    key: 'user',
    label: 'user',
    icon: 'i-heroicons-user',
    description: 'Send a request and follow up the status',
    redirectPath: '/users'
  }
]

// Methods
const getCurrentRoleStyle = () => {
  const role = availableRoles.find(r => r.key === selectedRole.value)
  const styles = {
    admin: {
      class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      icon: 'i-heroicons-shield-check',
      description: role?.description || ''
    },
    checker: {
      class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      icon: 'i-heroicons-check-circle',
      description: role?.description || ''
    },
    user: {
      class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      icon: 'i-heroicons-user',
      description: role?.description || ''
    }
  }
  return styles[selectedRole.value as keyof typeof styles] || styles.user
}

const getLoginTitle = () => {
  const titles = {
    admin: 'Log in the administrator system',
    checker: 'Log in the approval system',
    user: 'Enter the user system'
  }
  return titles[selectedRole.value as keyof typeof titles] || 'เข้าสู่ระบบ'
}

const getLoginSubtitle = () => {
  const subtitles = {
    admin: 'Management and control system',
    checker: 'Approval system and inspection',
    user: 'Request and follow -up system'
  }
  return subtitles[selectedRole.value as keyof typeof subtitles] || 'Please login to proceed.'
}

const getUsernamePlaceholder = () => {
  const placeholders = {
    admin: 'Username',
    checker: 'Username',
    user: 'Username'
  }
  return placeholders[selectedRole.value as keyof typeof placeholders] || 'Username'
}

const getRoleInfo = () => {
  const info = {
    // admin: 'สามารถเข้าถึงระบบจัดการผู้ใช้ การตั้งค่าระบบ และสร้างบัญชีผู้ใช้ใหม่',
    admin: 'Can access the user management system System settings And create a new user account',
    // checker: 'สามารถดูและอนุมัติคำขอต่างๆ ตรวจสอบเอกสาร และจัดการขั้นตอนการอนุมัติ',
    checker: 'Can see and approve various requests Check documents And manage the approval process',
    // user: 'สามารถส่งคำขอใหม่ ติดตามสถานะคำขอ และจัดการข้อมูลส่วนตัว'
    user: 'Can send a new request Follow the request status And manage personal information'
  }
  return info[selectedRole.value as keyof typeof info] || ''
}

// Event handlers
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    loginFormRef.value?.setLoading(true)

    // Add role to credentials
    const loginData = {
      ...credentials,
      role: selectedRole.value
    }
    // Call authentication service
    const { login } = useAuth()
    const response = await login({
      username: credentials.username,
      password: credentials.password
    })

    // Get redirect path based on role
    const role = availableRoles.find(r => r.key === selectedRole.value)
    const redirectPath = role?.redirectPath || '/'

    // Redirect to appropriate dashboard
    await navigateTo(redirectPath)

    // Show success message
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'login success',
      description: `Welcome ${role?.label}`,
      // timeout: 3000
    })

  } catch (error: any) {
    console.error('Login error:', error)

    // Show error message
    let errorMessage = 'There was an error in logging.'

    if (error?.response?.status === 401) {
      errorMessage = 'Username or password is incorrect'
    } else if (error?.response?.status === 403) {
      errorMessage = `No right to access as${getLoginTitle()}`
    } else if (error?.response?.status === 429) {
      errorMessage = 'Trying to log in too much please wait a moment่'
    }

    loginFormRef.value?.setError(errorMessage)
  } finally {
    loginFormRef.value?.setLoading(false)
  }
}

const handleForgotPassword = () => {
  navigateTo('/auth/forgot-password')
}

const handleRegister = () => {
  // Only allow admin registration
  if (selectedRole.value === 'admin') {
    navigateTo('/auth/register')
  } else {
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Not allowed',
      description: 'Only the system administrator can apply for membership.',
      color: 'error',
      // timeout: 5000
    })
  }
}

const handleHelp = () => {
  navigateTo('/help')
}

const handleContact = () => {
  navigateTo('/contact')
}

// Set default role on mount
onMounted(() => {
  // Check if there's a preferred role in localStorage
  const savedRole = localStorage.getItem('preferredRole')
  if (savedRole && availableRoles.some(role => role.key === savedRole)) {
    selectedRole.value = savedRole
  }
})

// Save role preference when changed
watch(selectedRole, (newRole) => {
  localStorage.setItem('preferredRole', newRole)
  useCookie('preferredRole').value = newRole
})

// SEO
useSeoMeta({
  title: 'Login - CBS Approve Web',
  description: 'Enter the online approval system. For system administrators, approval and general users'
})
</script>