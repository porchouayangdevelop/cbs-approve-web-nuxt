<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Left Side -->
      <div class="flex items-center space-x-4">
        <!-- Sidebar Toggle -->
        <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-bars-3"
            class="lg:hidden"
            @click="$emit('toggle-sidebar')"
        />

        <!-- App Title & Role Badge -->
        <div class="hidden md:flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center',
              roleConfig.logoColor
            ]">
              <UIcon :name="roleConfig.icon" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ roleConfig.title }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ roleConfig.subtitle }}
              </p>
            </div>
          </div>

          <!-- Role Badge -->
          <UBadge
              :color="roleConfig.badgeColor"
              variant="soft"
              size="sm"
          >
            {{ userRole }} Portal
          </UBadge>
        </div>

        <!-- Mobile Title -->
        <div class="md:hidden">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ roleConfig.shortTitle }}
          </h1>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center space-x-3">
        <!-- Search -->
        <div class="hidden md:block">
          <UInput
              v-model="searchQuery"
              :placeholder="roleConfig.searchPlaceholder"
              icon="i-heroicons-magnifying-glass"
              size="sm"
              class="w-64"
          />
        </div>

        <!-- Quick Actions (Role-specific) -->
        <div class="hidden lg:flex items-center space-x-2">
          <UButton
              v-for="action in roleConfig.quickActions"
              :key="action.label"
              variant="ghost"
              size="sm"
              :icon="action.icon"
              :to="action.to"
              :class="action.class"
              @click="action.click"
          >
            <span class="hidden xl:inline">{{ action.label }}</span>
          </UButton>
        </div>

        <!-- Notifications -->
        <UDropdownMenu :items="notificationItems" :popper="{ placement: 'bottom-end' }">
          <UButton variant="ghost" size="sm" class="relative">
            <UIcon name="i-heroicons-bell" class="w-5 h-5" />
            <span v-if="roleConfig.notificationCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ roleConfig.notificationCount }}
            </span>
          </UButton>
        </UDropdownMenu>

        <!-- Theme Toggle -->
        <UButton
            variant="ghost"
            size="sm"
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            @click="$emit('toggle-theme')"
        />

        <!-- User Menu -->
        <UDropdownMenu :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
          <UButton variant="ghost" size="sm" class="flex items-center space-x-2 px-2 py-1.5">
            <UAvatar
                :src="userProfile.avatar"
                :alt="userProfile.name"
                size="xs"
            />
            <div class="hidden md:flex flex-col items-start">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                {{ userProfile.name }}
              </span>
              <span class="text-xs leading-tight" :class="roleConfig.roleTextColor">
                {{ userProfile.roleTitle }}
              </span>
            </div>
            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400" />
          </UButton>
        </UDropdownMenu>
      </div>
    </div>

    <!-- Mobile Search Bar (Collapsible) -->
    <div v-if="showMobileSearch" class="md:hidden px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
      <UInput
          v-model="searchQuery"
          :placeholder="roleConfig.searchPlaceholder"
          icon="i-heroicons-magnifying-glass"
          size="sm"
          class="w-full"
      />
    </div>

    <!-- Mobile Quick Actions -->
    <div class="lg:hidden flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <UButton
            v-for="action in roleConfig.quickActions.slice(0, 3)"
            :key="action.label"
            variant="ghost"
            size="xs"
            :icon="action.icon"
            :to="action.to"
            @click="action.click"
        />
      </div>
      <UButton
          variant="ghost"
          size="xs"
          icon="i-heroicons-magnifying-glass"
          @click="showMobileSearch = !showMobileSearch"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  'toggle-sidebar': []
  'toggle-theme': []
  logout: []
}>()

const colorMode = useColorMode()
const route = useRoute()
const { user } = useAuth()

// Reactive states
const isDark = computed(() => colorMode.value === 'dark')
const searchQuery = ref('')
const showMobileSearch = ref(false)

// User profile information
const userProfile = computed(() => ({
  name: user.value?.firstName && user.value?.lastName
      ? `${user.value.firstName} ${user.value.lastName}`
      : user.value?.username || 'Mr Porchouayang',
  avatar: user.value?.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4',
  email: user.value?.email || 'porchouayang.vaj@apb.com.la',
  roleTitle: getRoleTitle(user.value?.role)
}))

// Get user role
const userRole = computed(() => user.value?.role || 'admin')

// Role-based configuration
const roleConfig = computed(() => {
  const configs = {
    admin: {
      title: 'Admin Dashboard',
      shortTitle: 'Admin',
      subtitle: 'System Administration',
      icon: 'i-heroicons-squares-2x2',
      logoColor: 'bg-primary-600',
      badgeColor: 'primary',
      roleTextColor: 'text-primary-600 dark:text-primary-400',
      searchPlaceholder: 'Search users, orders, products...',
      notificationCount: 5,
      quickActions: [
        {
          label: 'Add User',
          icon: 'i-heroicons-user-plus',
          to: '/users/create',
          class: 'text-primary-600'
        },
        {
          label: 'System Stats',
          icon: 'i-heroicons-chart-bar',
          to: '/admin/analytics',
          class: 'text-blue-600'
        },
        {
          label: 'Settings',
          icon: 'i-heroicons-cog-6-tooth',
          to: '/admin/settings',
          class: 'text-gray-600'
        }
      ]
    },
    Checker: {
      title: 'Checker Portal',
      shortTitle: 'Checker',
      subtitle: 'Approval Management',
      icon: 'i-heroicons-check-circle',
      logoColor: 'bg-blue-600',
      badgeColor: 'blue',
      roleTextColor: 'text-blue-600 dark:text-blue-400',
      searchPlaceholder: 'Search requests, approvals...',
      notificationCount: 12,
      quickActions: [
        {
          label: 'Pending',
          icon: 'i-heroicons-clock',
          to: '/checkers/requests/pending',
          class: 'text-orange-600'
        },
        {
          label: 'Review',
          icon: 'i-heroicons-eye',
          to: '/checkers/requests/review',
          class: 'text-blue-600'
        },
        {
          label: 'Stats',
          icon: 'i-heroicons-chart-pie',
          to: '/checkers/stats',
          class: 'text-green-600'
        }
      ]
    },
    User: {
      title: 'User Portal',
      shortTitle: 'Portal',
      subtitle: 'Request Management',
      icon: 'i-heroicons-user',
      logoColor: 'bg-green-600',
      badgeColor: 'green',
      roleTextColor: 'text-green-600 dark:text-green-400',
      searchPlaceholder: 'Search my requests, templates...',
      notificationCount: 3,
      quickActions: [
        {
          label: 'New Request',
          icon: 'i-heroicons-plus-circle',
          to: '/users/requests/create',
          class: 'text-green-600'
        },
        {
          label: 'My Requests',
          icon: 'i-heroicons-document-text',
          to: '/users/requests',
          class: 'text-blue-600'
        },
        {
          label: 'Templates',
          icon: 'i-heroicons-document-duplicate',
          to: '/users/templates',
          class: 'text-purple-600'
        }
      ]
    }
  }

  return configs[userRole.value as keyof typeof configs] || configs.User
})

// Helper function to get role title
const getRoleTitle = (role?: string) => {
  const titles = {
    admin: 'System Administrator',
    Checker: 'Approval Specialist',
    User: 'Standard User',
    Manager: 'Department Manager'
  }
  return titles[role as keyof typeof titles] || 'User'
}

// Page title based on current route
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/users': 'User Management',
    '/users/create': 'Create User',
    '/reports': 'Reports',
    '/analytics': 'Analytics',
    '/settings': 'Settings',
    '/checkers': 'Approval Dashboard',
    '/checkers/requests': 'Request Management',
    '/checkers/requests/pending': 'Pending Requests',
    '/checkers/requests/review': 'Review Queue',
    '/checkers/stats': 'Approval Statistics',
    '/users/requests': 'My Requests',
    '/users/requests/create': 'Create Request',
    '/users/profile': 'My Profile'
  }
  return titles[route.path] || roleConfig.value.subtitle
})

// Role-specific notifications
const notificationItems = computed(() => {
  const notifications = {
    admin: [
      [{
        label: 'New user registration',
        icon: 'i-heroicons-user-plus',
        to: '/users'
      }],
      [{
        label: 'System alert: High CPU usage',
        icon: 'i-heroicons-exclamation-triangle',
        to: '/admin/system'
      }],
      [{
        label: 'Monthly report ready',
        icon: 'i-heroicons-document-text',
        to: '/admin/reports'
      }],
      [{
        label: 'View all notifications',
        to: '/admin/notifications'
      }]
    ],
    Checker: [
      [{
        label: '12 requests pending approval',
        icon: 'i-heroicons-clock',
        to: '/checkers/requests/pending'
      }],
      [{
        label: 'Priority request needs review',
        icon: 'i-heroicons-exclamation-circle',
        to: '/checkers/requests/review'
      }],
      [{
        label: 'Weekly approval summary',
        icon: 'i-heroicons-chart-bar',
        to: '/checkers/stats'
      }],
      [{
        label: 'View all notifications',
        to: '/checkers/notifications'
      }]
    ],
    User: [
      [{
        label: 'Request approved',
        icon: 'i-heroicons-check-circle',
        to: '/users/requests'
      }],
      [{
        label: 'Document upload required',
        icon: 'i-heroicons-paper-clip',
        to: '/users/requests/pending'
      }],
      [{
        label: 'New template available',
        icon: 'i-heroicons-document-plus',
        to: '/users/templates'
      }],
      [{
        label: 'View all notifications',
        to: '/users/notifications'
      }]
    ]
  }

  return notifications[userRole.value as keyof typeof notifications] || notifications.User
})

// Role-specific user menu
const userMenuItems = computed(() => {
  const baseItems = [
    [{
      label: 'Profile',
      icon: 'i-heroicons-user',
      to: `/${userRole.value.toLowerCase()}/profile`
    }],
    [{
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: `/${userRole.value.toLowerCase()}/settings`
    }]
  ]

  // Add role-specific menu items
  const roleSpecificItems = {
    admin: [{
      label: 'System Settings',
      icon: 'i-heroicons-server',
      to: '/admin/system'
    }],
    Checker: [{
      label: 'Approval History',
      icon: 'i-heroicons-clock',
      to: '/checkers/history'
    }],
    User: [{
      label: 'My Requests',
      icon: 'i-heroicons-document-text',
      to: '/users/requests'
    }]
  }

  const specificItems = roleSpecificItems[userRole.value as keyof typeof roleSpecificItems]
  if (specificItems) {
    baseItems.splice(1, 0, specificItems)
  }

  baseItems.push([{
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
    to: '/help'
  }])

  baseItems.push([{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => {
      console.log('Logout clicked')
      // Handle logout
    }
  }])

  return baseItems
})

// Watch for route changes to close mobile search
watch(() => route.path, () => {
  showMobileSearch.value = false
})
</script>