<template>
  <aside
      :class="[
      'fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none">
      <!-- Logo -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-user" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            User Portal
          </span>
        </div>

        <!-- Close button (mobile only) -->
        <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark"
            class="lg:hidden"
            @click="$emit('close')"
        />
      </div>

      <!-- Navigation Menu - Vertical Orientation -->
      <nav class="flex-1 overflow-y-auto p-4">
        <div class="space-y-6">
          <template v-for="(section, sectionIndex) in navigationSections" :key="sectionIndex">
            <!-- Section Header -->
            <div v-if="section.title" class="space-y-3">
              <div v-if="sectionIndex > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6"></div>
              <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ section.title }}
              </h3>
            </div>

            <!-- Navigation Items -->
            <div class="space-y-1">
              <template v-for="item in section.items" :key="item.label">
                <!-- Single Navigation Item -->
                <div v-if="!item.children">
                  <NuxtLink
                      :to="item.to"
                      class="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg border-l-3 transition-all duration-200"
                      :class="[
                      isActiveRoute(item.to)
                        ? 'border-l-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                        : 'border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                      @click="$emit('navigate'); handleDirectNavigation()"
                  >
                    <UIcon
                        :name="item.icon"
                        :class="[
                        'flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200',
                        isActiveRoute(item.to)
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                      ]"
                    />
                    <span class="flex-1 truncate">{{ item.label }}</span>
                    <UBadge
                        v-if="item.badge"
                        :color="item.badgeColor || 'green'"
                        size="xs"
                        variant="solid"
                    >
                      {{ item.badge }}
                    </UBadge>
                  </NuxtLink>
                </div>

                <!-- Navigation Item with Children (Dropdown) -->
                <div v-else class="space-y-1">
                  <UButton
                      variant="ghost"
                      :class="[
                      'w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg border-l-3 transition-all duration-200',
                      isActiveParent(item)
                        ? 'border-l-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                        : 'border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                      @click="toggleSubmenu(item)"
                  >
                    <template #leading>
                      <UIcon
                          :name="item.icon"
                          :class="[
                          'w-5 h-5 transition-colors duration-200',
                          isActiveParent(item)
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400 dark:text-gray-500'
                        ]"
                      />
                    </template>

                    <span class="flex-1 text-left truncate">{{ item.label }}</span>

                    <template #trailing>
                      <div class="flex items-center space-x-2">
                        <UBadge
                            v-if="item.badge"
                            :color="item.badgeColor || 'green'"
                            size="xs"
                            variant="solid"
                        >
                          {{ item.badge }}
                        </UBadge>
                        <UIcon
                            name="i-heroicons-chevron-down"
                            :class="[
                            'w-4 h-4 transition-transform duration-200',
                            item.expanded ? 'rotate-180' : ''
                          ]"
                        />
                      </div>
                    </template>
                  </UButton>

                  <!-- Submenu Items -->
                  <Transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 max-h-0"
                      enter-to-class="opacity-100 max-h-96"
                      leave-active-class="transition-all duration-300 ease-in"
                      leave-from-class="opacity-100 max-h-96"
                      leave-to-class="opacity-0 max-h-0"
                  >
                    <div v-show="item.expanded" class="overflow-hidden">
                      <div class="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                        <NuxtLink
                            v-for="child in item.children"
                            :key="child.label"
                            :to="child.to"
                            class="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                            :class="[
                            isActiveRoute(child.to)
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                          ]"
                            @click="$emit('navigate'); handleDirectNavigation()"
                        >
                          <UIcon
                              :name="child.icon"
                              :class="[
                              'flex-shrink-0 w-4 h-4 mr-3 transition-colors duration-200',
                              isActiveRoute(child.to)
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                            ]"
                          />
                          <span class="flex-1 truncate">{{ child.label }}</span>
                          <UBadge
                              v-if="child.badge"
                              :color="child.badgeColor || 'green'"
                              size="xs"
                              variant="soft"
                          >
                            {{ child.badge }}
                          </UBadge>
                        </NuxtLink>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>
          </template>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <UDropdown
            :items="userMenuItems"
            :popper="{ placement: 'top-start' }"
            class="w-full"
        >
          <div class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
            <UAvatar
                src="https://avatars.githubusercontent.com/u/739984?v=4"
                alt="User Avatar"
                size="sm"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                John Doe
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                user@example.com
              </p>
            </div>
            <UIcon name="i-heroicons-chevron-up" class="w-4 h-4 text-gray-400" />
          </div>
        </UDropdown>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface NavigationItem {
  label: string
  to?: string
  icon: string
  badge?: string
  badgeColor?: string
  children?: NavigationItem[]
  expanded?: boolean
}

interface NavigationSection {
  title?: string
  items: NavigationItem[]
}

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  navigate: []
}>()

const route = useRoute()

// Reactive navigation state for User
const navigationSections = ref<NavigationSection[]>([
  // Dashboard
  {
    items: [
      {
        label: 'Dashboard',
        to: '/users',
        icon: 'i-heroicons-squares-2x2'
      }
    ]
  },

  // Request Management
  {
    title: 'Request Management',
    items: [
      {
        label: 'Create Request',
        to: '/users/requests/create',
        icon: 'i-heroicons-plus-circle',
        badgeColor: 'green'
      },
      {
        label: 'My Requests',
        icon: 'i-heroicons-document-text',
        expanded: false,
        children: [
          {
            label: 'All Requests',
            to: '/users/requests',
            icon: 'i-heroicons-list-bullet'
          },
          {
            label: 'Draft',
            to: '/users/requests/draft',
            icon: 'i-heroicons-document-plus',
            badge: '3',
            badgeColor: 'gray'
          },
          {
            label: 'Pending',
            to: '/users/requests/pending',
            icon: 'i-heroicons-clock',
            badge: '8',
            badgeColor: 'yellow'
          },
          {
            label: 'In Review',
            to: '/users/requests/review',
            icon: 'i-heroicons-eye',
            badge: '2',
            badgeColor: 'blue'
          },
          {
            label: 'Approved',
            to: '/users/requests/approved',
            icon: 'i-heroicons-check-circle',
            badge: '15',
            badgeColor: 'green'
          },
          {
            label: 'Rejected',
            to: '/users/requests/rejected',
            icon: 'i-heroicons-x-circle',
            badge: '1',
            badgeColor: 'red'
          }
        ]
      },
      {
        label: 'Request Templates',
        to: '/users/templates',
        icon: 'i-heroicons-document-duplicate'
      }
    ]
  },

  // Analytics & Tracking
  {
    title: 'Analytics & Tracking',
    items: [
      {
        label: 'Request Stats',
        to: '/users/stats',
        icon: 'i-heroicons-chart-bar'
      },
      {
        label: 'Request History',
        to: '/users/history',
        icon: 'i-heroicons-clock'
      },
      {
        label: 'Performance Report',
        to: '/users/reports',
        icon: 'i-heroicons-chart-pie'
      }
    ]
  },

  // Quick Actions
  {
    title: 'Quick Actions',
    items: [
      {
        label: 'Update Request',
        icon: 'i-heroicons-pencil-square',
        expanded: false,
        children: [
          {
            label: 'Update Draft',
            to: '/users/requests/update/draft',
            icon: 'i-heroicons-document-text',
            badge: '3',
            badgeColor: 'orange'
          },
          {
            label: 'Add Documents',
            to: '/users/requests/documents',
            icon: 'i-heroicons-paper-clip'
          },
          {
            label: 'Request Changes',
            to: '/users/requests/changes',
            icon: 'i-heroicons-arrow-path'
          }
        ]
      },
      {
        label: 'Bulk Operations',
        to: '/users/bulk',
        icon: 'i-heroicons-queue-list'
      }
    ]
  },

  // Personal & Settings
  {
    title: 'Personal & Settings',
    items: [
      {
        label: 'My Profile',
        to: '/users/profile',
        icon: 'i-heroicons-user'
      },
      {
        label: 'Notifications',
        to: '/users/notifications',
        icon: 'i-heroicons-bell',
        badge: '4',
        badgeColor: 'red'
      },
      {
        label: 'Preferences',
        to: '/users/preferences',
        icon: 'i-heroicons-adjustments-horizontal'
      },
      {
        label: 'Help & Support',
        to: '/help',
        icon: 'i-heroicons-question-mark-circle'
      }
    ]
  }
])

// Helper functions
const isActiveRoute = (to?: string): boolean => {
  if (!to) return false
  return route.path === to
}

const isActiveParent = (item: NavigationItem): boolean => {
  if (!item.children) return false
  return item.children.some(child => child.to && route.path === child.to)
}

const toggleSubmenu = (item: NavigationItem) => {
  if (item.children) {
    // Close all other expanded menus first
    navigationSections.value.forEach(section => {
      section.items.forEach(menuItem => {
        if (menuItem.children && menuItem !== item) {
          menuItem.expanded = false
        }
      })
    })
    // Toggle current menu
    item.expanded = !item.expanded
  }
}

// Auto-expand active parent menus and close others
watch(() => route.path, () => {
  navigationSections.value.forEach(section => {
    section.items.forEach(item => {
      if (item.children) {
        if (isActiveParent(item)) {
          item.expanded = true
        } else {
          item.expanded = false
        }
      }
    })
  })
}, { immediate: true })

// Close expanded menus when navigating to a direct route
const handleDirectNavigation = () => {
  navigationSections.value.forEach(section => {
    section.items.forEach(item => {
      if (item.children && !isActiveParent(item)) {
        item.expanded = false
      }
    })
  })
}

const userMenuItems = [
  [{
    label: 'View Profile',
    icon: 'i-heroicons-user',
    to: '/users/profile'
  }],
  [{
    label: 'My Requests',
    icon: 'i-heroicons-document-text',
    to: '/users/requests'
  }],
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/users/settings'
  }],
  [{
    label: 'Help & Support',
    icon: 'i-heroicons-question-mark-circle',
    to: '/help'
  }],
  [{
    label: 'Sign Out',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => {
      console.log('Logout clicked')
      emit('navigate')
    }
  }]
]
</script>