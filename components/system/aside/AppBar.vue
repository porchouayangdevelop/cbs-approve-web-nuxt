// components/system/aside/AppBar.vue
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
              currentConfig.logoColor
            ]">
              <UIcon :name="currentConfig.icon" class="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ currentConfig.title }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ currentConfig.subtitle }}
              </p>
            </div>
          </div>

          <!-- Role Badge -->
          <UBadge
              :color="currentConfig.badgeColor"
              variant="soft"
              size="sm"
          >
            {{ displayRole }} Portal
          </UBadge>
        </div>

        <!-- Mobile Title -->
        <div class="md:hidden">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ currentConfig.shortTitle }}
          </h1>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center space-x-3">
        <!-- Search -->
        <div class="hidden md:block">
          <UInput
              v-model="searchQuery"
              :placeholder="currentConfig.searchPlaceholder"
              icon="i-heroicons-magnifying-glass"
              size="sm"
              class="w-64"
          />
        </div>

        <!-- Quick Actions (Role-specific) -->
        <div class="hidden lg:flex items-center space-x-2">
          <UButton
              v-for="action in currentConfig.quickActions"
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
            <UIcon name="i-heroicons-bell" class="w-5 h-5"/>
            <span v-if="currentConfig.notificationCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ currentConfig.notificationCount }}
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
              <span class="text-xs leading-tight" :class="currentConfig.roleTextColor">
                {{ userProfile.roleTitle }}
              </span>
            </div>
            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400"/>
          </UButton>
        </UDropdownMenu>
      </div>
    </div>

    <!-- Mobile Search Bar (Collapsible) -->
    <div v-if="showMobileSearch" class="md:hidden px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
      <UInput
          v-model="searchQuery"
          :placeholder="currentConfig.searchPlaceholder"
          icon="i-heroicons-magnifying-glass"
          size="sm"
          class="w-full"
      />
    </div>

    <!-- Mobile Quick Actions -->
    <div
        class="lg:hidden flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <UButton
            v-for="action in currentConfig.quickActions.slice(0, 3)"
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
import {useRoleSession} from '~/composables/useRoleSession'
import {useAuth} from '~/composables/useAuth'
import {useCheckAuth} from '~/composables/useCheckAuth'

defineEmits<{
  'toggle-sidebar': []
  'toggle-theme': []
}>()

const colorMode = useColorMode()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const {user, logout: authLogout, isLoading} = useAuth()
const {currentUserRole} = useCheckAuth()

// Use role session composable
const {
  currentConfig,
  userProfile,
  getNotifications
} = useRoleSession()

// Get the current user role - prioritize user.value.role, fallback to JWT token
const displayRole = computed(() => {
  // First try to get from authenticated user
  if (user.value?.role) {
    return user.value.role.charAt(0).toUpperCase() + user.value.role.slice(1)
  }

  // Fallback to JWT token role
  const jwtRole = currentUserRole()
  if (jwtRole) {
    return jwtRole.charAt(0).toUpperCase() + jwtRole.slice(1)
  }

  // Default fallback
  return 'User'
})

// Reactive states
const isDark = computed(() => colorMode.value === 'dark')
const searchQuery = ref('')
const showMobileSearch = ref(false)
const loggingOut = ref(false)

// Get role-specific notifications
const notificationItems = computed(() => {
  const notifications = getNotifications()

  return [
    ...notifications.map(notification => [{
      label: notification.title,
      description: notification.description,
      icon: notification.icon,
      click: () => console.log('Notification clicked:', notification.title)
    }]),
    [{
      label: 'View all notifications',
      to: `/${displayRole.value.toLowerCase()}/notifications`
    }]
  ]
})

// FIXED: Proper logout handler with better error handling and cleanup
const handleLogout = async () => {
  if (loggingOut.value || isLoading.value) return;

  try {
    loggingOut.value = true;

    // Show logout confirmation
    toast.add({
      icon: 'i-heroicons-arrow-right-on-rectangle',
      title: 'Logging out...',
      description: 'Please wait while we sign you out.',
    });

    // Clear all cookies and tokens first
    const accessTokenCookie = useCookie('access_token');
    const refreshTokenCookie = useCookie('refresh_token');

    // Clear cookies immediately
    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;

    // Clear localStorage items
    if (process.client) {
      localStorage.removeItem('preferred-language');
      localStorage.removeItem('preferredRole');
      // Clear any request drafts
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('request_draft_')) {
          localStorage.removeItem(key);
        }
      });
    }

    // Call the logout function from useAuth (this will handle server-side logout)
    try {
      await authLogout();
    } catch (logoutError) {
      console.warn('Server logout failed, but continuing with local cleanup:', logoutError);
    }

    // Show success message
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'Logged out successfully',
      description: 'You have been signed out of your account.',
    });

    // Force navigation to login page
    await navigateTo('/auth/login', { replace: true });

  } catch (error) {
    console.error('Logout error:', error);

    // Even if logout fails, clear local data and redirect
    const accessTokenCookie = useCookie('access_token');
    const refreshTokenCookie = useCookie('refresh_token');
    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;

    // Show error message
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Logout completed',
      description: 'You have been signed out (with local cleanup).',
    });

    // Force redirect regardless
    await navigateTo('/auth/login', { replace: true });

  } finally {
    loggingOut.value = false;
  }
};

// Role-specific user menu with access control
const userMenuItems = computed(() => {
  const roleValue = displayRole.value.toLowerCase()

  const baseItems = [
    [{
      label: 'Profile',
      icon: 'i-heroicons-user',
      to: `/${roleValue}/profile`
    }],
    [{
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: `/${roleValue}/settings`
    }]
  ]

  // Add role-specific menu items
  const roleSpecificItems = {
    admin: [{
      label: 'System Settings',
      icon: 'i-heroicons-server',
      to: '/admin/system'
    }],
    checker: [{
      label: 'Approval History',
      icon: 'i-heroicons-clock',
      to: '/checkers/history'
    }],
    user: [{
      label: 'My Requests',
      icon: 'i-heroicons-document-text',
      to: '/users/requests'
    }]
  }

  const specificItems = roleSpecificItems[roleValue as keyof typeof roleSpecificItems]
  if (specificItems) {
    baseItems.splice(1, 0, specificItems)
  }

  baseItems.push([{
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
    to: '/help'
  }])

  // FIXED: Proper logout menu item with loading state
  baseItems.push([{
    label: loggingOut.value ? 'Logging out...' : 'Logout',
    icon: loggingOut.value ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-right-on-rectangle',
    click: handleLogout,
    disabled: loggingOut.value || isLoading.value
  }])

  return baseItems
})

// Watch for route changes to close mobile search
watch(() => route.path, () => {
  showMobileSearch.value = false
})

// Debug logging for role changes
watch(() => user.value?.role, (newRole) => {
  if (newRole) {
    console.log('AppBar - User role changed to:', newRole)
  }
}, {immediate: true})
</script>