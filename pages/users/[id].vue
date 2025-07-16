<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Back Navigation -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center space-x-4">
        <UButton
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="$router.go(-1)"
        >
          Back to Users
        </UButton>
        <div class="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">User Profile</h1>
      </div>
    </div>

    <!-- Profile Cover & Header -->
    <div class="relative">
      <!-- Cover Image -->
      <div class="h-48 md:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <img
            v-if="user?.coverImage"
            :src="user.coverImage"
            alt="Cover"
            class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>

        <!-- Admin Actions -->
        <div class="absolute top-4 right-4 flex space-x-2">
          <UButton
              variant="solid"
              color="white"
              size="sm"
              icon="i-heroicons-pencil-square"
              @click="editUser"
          >
            Edit User
          </UButton>
          <UDropdown :items="adminActions">
            <UButton
                variant="solid"
                color="white"
                size="sm"
                icon="i-heroicons-ellipsis-horizontal"
            />
          </UDropdown>
        </div>
      </div>

      <!-- Profile Header -->
      <div class="relative px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="relative -mt-16 md:-mt-20 pb-6">
            <div class="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <!-- Profile Picture -->
              <div class="relative">
                <UAvatar
                    :src="user?.avatar"
                    :alt="user?.name"
                    size="2xl"
                    class="ring-4 ring-white dark:ring-gray-800 shadow-xl"
                />
                <div class="absolute bottom-2 right-2">
                  <UBadge
                      :color="user?.status === 'active' ? 'green' : user?.status === 'inactive' ? 'red' : 'yellow'"
                      size="xs"
                  >
                    {{ user?.status }}
                  </UBadge>
                </div>
              </div>

              <!-- Profile Info -->
              <div class="flex-1 min-w-0">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                  <div class="flex flex-col md:flex-row md:items-center justify-between">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                          {{ user?.name }}
                        </h1>
                        <UBadge
                            :color="getRoleColor(user?.role)"
                            variant="soft"
                        >
                          {{ user?.role }}
                        </UBadge>
                      </div>
                      <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
                        {{ user?.department }} Department
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-500">
                        Member since {{ formatDate(user?.createdAt) }}
                      </p>

                      <!-- Quick Stats -->
                      <div class="flex items-center space-x-6 mt-4">
                        <div class="text-center">
                          <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ getTimeAgo(user?.lastLogin) }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">Last Login</div>
                        </div>
                        <div class="text-center">
                          <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ user?.projectCount || 12 }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                        </div>
                        <div class="text-center">
                          <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ user?.teamSize || 8 }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">Team Size</div>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center space-x-3 mt-4 md:mt-0">
                      <UButton
                          variant="outline"
                          icon="i-heroicons-envelope"
                          size="sm"
                          @click="sendMessage"
                      >
                        Message
                      </UButton>
                      <UButton
                          variant="outline"
                          icon="i-heroicons-phone"
                          size="sm"
                          @click="callUser"
                      >
                        Call
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Vertical Tab Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">User Details</h3>
            </div>

            <nav class="p-2">
              <div class="space-y-1">
                <button
                    v-for="tab in userTabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                    'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg border-l-3 transition-all duration-200',
                    activeTab === tab.id
                      ? 'border-l-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  <UIcon :name="tab.icon" class="w-5 h-5 mr-3" />
                  <span class="flex-1 text-left">{{ tab.label }}</span>
                  <UBadge
                      v-if="tab.badge"
                      :color="tab.badgeColor || 'primary'"
                      size="xs"
                      variant="soft"
                  >
                    {{ tab.badge }}
                  </UBadge>
                </button>
              </div>
            </nav>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Overview</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Personal Information -->
                <div class="space-y-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ user?.email }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-phone" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ user?.phone || 'Not provided' }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ user?.location || 'Not provided' }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">Joined {{ formatDate(user?.createdAt) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Professional Details -->
                <div class="space-y-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Professional Details</h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ user?.department }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-identification" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">ID: {{ user?.id }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ user?.role }} Role</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-clock" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">Last login {{ getTimeAgo(user?.lastLogin) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Permissions -->
              <div class="mt-8">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Permissions & Access</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="permission in userPermissions" :key="permission.name" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <UIcon :name="permission.icon" class="w-5 h-5 text-gray-400" />
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ permission.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ permission.description }}</p>
                      </div>
                    </div>
                    <UBadge
                        :color="permission.granted ? 'green' : 'red'"
                        variant="soft"
                        size="xs"
                    >
                      {{ permission.granted ? 'Granted' : 'Denied' }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Tab -->
            <div v-else-if="activeTab === 'activity'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Activity</h2>

              <div class="space-y-4">
                <div v-for="activity in userActivity" :key="activity.id" class="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    activity.type === 'login' ? 'bg-green-100 dark:bg-green-900' :
                    activity.type === 'update' ? 'bg-blue-100 dark:bg-blue-900' :
                    activity.type === 'security' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-gray-100 dark:bg-gray-700'
                  ]">
                    <UIcon :name="activity.icon" :class="[
                      'w-5 h-5',
                      activity.type === 'login' ? 'text-green-600 dark:text-green-400' :
                      activity.type === 'update' ? 'text-blue-600 dark:text-blue-400' :
                      activity.type === 'security' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-gray-600 dark:text-gray-400'
                    ]" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
                    <div class="flex items-center space-x-4 mt-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.timestamp }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.ipAddress }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sessions Tab -->
            <div v-else-if="activeTab === 'sessions'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Active Sessions</h2>

              <div class="space-y-3">
                <div v-for="session in userSessions" :key="session.id" class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <UIcon :name="session.device === 'desktop' ? 'i-heroicons-computer-desktop' : 'i-heroicons-device-phone-mobile'" class="w-6 h-6 text-gray-400" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ session.browser }} on {{ session.os }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ session.location }} • {{ session.lastActive }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">IP: {{ session.ipAddress }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <UBadge v-if="session.current" color="green" size="xs">Current</UBadge>
                    <UButton v-else variant="outline" size="xs" color="red" @click="revokeSession(session.id)">
                      Revoke
                    </UButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Tab -->
            <div v-else-if="activeTab === 'admin'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Admin Actions</h2>

              <div class="space-y-6">
                <!-- Account Status -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Status</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UCard>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">Current user status</p>
                        </div>
                        <USelectMenu
                            v-model="user.status"
                            :options="['active', 'inactive', 'pending']"
                            @change="updateUserStatus"
                        />
                      </div>
                    </UCard>

                    <UCard>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">User Role</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">Permission level</p>
                        </div>
                        <USelectMenu
                            v-model="user.role"
                            :options="['Admin', 'Manager', 'User']"
                            @change="updateUserRole"
                        />
                      </div>
                    </UCard>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UButton variant="outline" block @click="resetPassword">
                      <template #leading>
                        <UIcon name="i-heroicons-key" class="w-4 h-4" />
                      </template>
                      Reset Password
                    </UButton>

                    <UButton variant="outline" block @click="sendWelcomeEmail">
                      <template #leading>
                        <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                      </template>
                      Send Welcome Email
                    </UButton>

                    <UButton variant="outline" block @click="revokeAllSessions">
                      <template #leading>
                        <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4" />
                      </template>
                      Revoke All Sessions
                    </UButton>

                    <UButton variant="outline" block @click="exportUserData">
                      <template #leading>
                        <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                      </template>
                      Export User Data
                    </UButton>
                  </div>
                </div>

                <!-- Danger Zone -->
                <div>
                  <h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                  <UCard class="border-red-200 dark:border-red-800">
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">Suspend Account</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">Temporarily disable user access</p>
                        </div>
                        <UButton variant="outline" color="red" size="sm" @click="suspendAccount">
                          Suspend
                        </UButton>
                      </div>

                      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Permanently remove user and all data</p>
                          </div>
                          <UButton variant="solid" color="red" size="sm" @click="deleteAccount">
                            Delete
                          </UButton>
                        </div>
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'user-session',
  middleware: ['auth-guard', 'user-guard'],
})

const route = useRoute()
const userId = route.params.id as string

// State
const activeTab = ref('overview')
const user = ref<User | null>(null)
const loading = ref(false)

// Tab navigation
const userTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'i-heroicons-user'
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: 'i-heroicons-clock'
  },
  {
    id: 'sessions',
    label: 'Sessions',
    icon: 'i-heroicons-device-phone-mobile',
    badge: '2'
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'i-heroicons-cog-6-tooth'
  }
]

// Admin actions dropdown
const adminActions = [
  [{
    label: 'Reset Password',
    icon: 'i-heroicons-key',
    click: () => resetPassword()
  }],
  [{
    label: 'Send Email',
    icon: 'i-heroicons-envelope',
    click: () => sendWelcomeEmail()
  }],
  [{
    label: 'Export Data',
    icon: 'i-heroicons-arrow-down-tray',
    click: () => exportUserData()
  }],
  [{
    label: 'Delete User',
    icon: 'i-heroicons-trash',
    click: () => deleteAccount()
  }]
]

// Sample data
const userPermissions = ref([
  {
    name: 'Dashboard Access',
    description: 'View dashboard and analytics',
    icon: 'i-heroicons-chart-bar',
    granted: true
  },
  {
    name: 'User Management',
    description: 'Manage other users',
    icon: 'i-heroicons-users',
    granted: false
  },
  {
    name: 'Financial Data',
    description: 'Access financial reports',
    icon: 'i-heroicons-currency-dollar',
    granted: true
  },
  {
    name: 'System Settings',
    description: 'Modify system configuration',
    icon: 'i-heroicons-cog-6-tooth',
    granted: false
  }
])

const userActivity = ref([
  {
    id: 1,
    type: 'login',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    title: 'Successful Login',
    description: 'Logged in from Chrome browser',
    timestamp: '2 hours ago',
    ipAddress: '192.168.1.100'
  },
  {
    id: 2,
    type: 'update',
    icon: 'i-heroicons-pencil-square',
    title: 'Profile Updated',
    description: 'Updated contact information',
    timestamp: '1 day ago',
    ipAddress: '192.168.1.100'
  },
  {
    id: 3,
    type: 'security',
    icon: 'i-heroicons-shield-check',
    title: 'Password Changed',
    description: 'Successfully updated password',
    timestamp: '3 days ago',
    ipAddress: '192.168.1.100'
  }
])

const userSessions = ref([
  {
    id: 1,
    device: 'desktop',
    browser: 'Chrome',
    os: 'macOS',
    location: 'San Francisco, CA',
    lastActive: '2 minutes ago',
    ipAddress: '192.168.1.100',
    current: true
  },
  {
    id: 2,
    device: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    location: 'San Francisco, CA',
    lastActive: '1 hour ago',
    ipAddress: '192.168.1.101',
    current: false
  }
])

// Methods
const getRoleColor = (role?: string) => {
  const colors: Record<string, string> = {
    'Admin': 'red',
    'Manager': 'blue',
    'User': 'green'
  }
  return colors[role || ''] || 'gray'
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const getTimeAgo = (dateString?: string) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

// Load user data
const loadUser = async () => {
  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock user data - in real app, fetch from API
    user.value = {
      id: userId,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Admin',
      status: 'active',
      department: 'Engineering',
      avatar: 'https://avatars.githubusercontent.com/u/739984?v=4',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-01-15T10:30:00Z',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      coverImage: '',
      projectCount: 12,
      teamSize: 8
    }
  } catch (error) {
    console.error('Error loading user:', error)
  } finally {
    loading.value = false
  }
}

// Admin actions
const editUser = () => {
  navigateTo(`/admin/users/${userId}/edit`)
}

const sendMessage = () => {
  console.log('Send message to user')
}

const callUser = () => {
  console.log('Call user')
}

const updateUserStatus = (status: string) => {
  console.log('Update user status:', status)
}

const updateUserRole = (role: string) => {
  console.log('Update user role:', role)
}

const resetPassword = () => {
  console.log('Reset password')
}

const sendWelcomeEmail = () => {
  console.log('Send welcome email')
}

const revokeAllSessions = () => {
  console.log('Revoke all sessions')
}

const revokeSession = (sessionId: number) => {
  console.log('Revoke session:', sessionId)
  userSessions.value = userSessions.value.filter(s => s.id !== sessionId)
}

const exportUserData = () => {
  console.log('Export user data')
}

const suspendAccount = () => {
  console.log('Suspend account')
}

const deleteAccount = () => {
  console.log('Delete account')
}

// Load user on mount
onMounted(() => {
  loadUser()
})

// SEO
useSeoMeta({
  title: `${user.value?.name || 'User'} - Profile`,
  description: `View and manage user profile information and settings.`
})
</script>