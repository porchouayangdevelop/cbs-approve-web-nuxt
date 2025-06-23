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

        <!-- Page Title -->
        <div class="hidden md:block">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ pageTitle }}
          </h1>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center space-x-3">
        <!-- Search -->
        <div class="hidden md:block">
          <UInput
              v-model="searchQuery"
              placeholder="Search..."
              icon="i-heroicons-magnifying-glass"
              size="sm"
              class="w-64"
          />
        </div>

        <!-- Notifications -->
        <UDropdownMenu :items="notificationItems" :popper="{ placement: 'bottom-end' }">
          <UButton variant="ghost" size="sm" class="relative">
            <UIcon name="i-heroicons-bell" class="w-5 h-5" />
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ unreadCount }}
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
                src="https://avatars.githubusercontent.com/u/739984?v=4"
                alt="User Avatar"
                size="xs"
            />
            <div class="hidden md:flex flex-col items-start">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                John Doe
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                Administrator
              </span>
            </div>
            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400" />
          </UButton>
        </UDropdownMenu>
      </div>
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

const isDark = computed(() => colorMode.value === 'dark')
const searchQuery = ref('')
const unreadCount = ref(3)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/users': 'Users',
    '/products': 'Products',
    '/orders': 'Orders',
    '/reports': 'Reports',
    '/analytics': 'Analytics',
    '/settings': 'Settings'
  }
  return titles[route.path] || 'Admin Panel'
})

const notificationItems = [
  [{
    label: 'New order received',
    icon: 'i-heroicons-shopping-cart',
    to: '/orders'
  }],
  [{
    label: 'User registration',
    icon: 'i-heroicons-user-plus',
    to: '/users'
  }],
  [{
    label: 'System update available',
    icon: 'i-heroicons-arrow-up-circle',
    to: '/settings'
  }],
  [{
    label: 'View all notifications',
    to: '/notifications'
  }]
]

const userMenuItems = [
  [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    to: '/users/profile'
  }],
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings'
  }],
  [{
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
    to: '/help'
  }],
  [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => {
      // Emit logout event to parent
      const emit = getCurrentInstance()?.emit
      emit?.('logout')
    }
  }]
]
</script>