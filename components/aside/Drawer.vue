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
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            Admin
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
                        ? 'border-l-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                        : 'border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                      @click="$emit('navigate')"
                  >
                    <UIcon
                        :name="item.icon"
                        :class="[
                        'flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200',
                        isActiveRoute(item.to)
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                      ]"
                    />
                    <span class="flex-1 truncate">{{ item.label }}</span>
                    <UBadge
                        v-if="item.badge"
                        :color="item.badgeColor || 'primary'"
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
                        ? 'border-l-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
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
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-400 dark:text-gray-500'
                        ]"
                      />
                    </template>

                    <span class="flex-1 text-left truncate">{{ item.label }}</span>

                    <template #trailing>
                      <div class="flex items-center space-x-2">
                        <UBadge
                            v-if="item.badge"
                            :color="item.badgeColor || 'primary'"
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
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                          ]"
                            @click="$emit('navigate')"
                        >
                          <UIcon
                              :name="child.icon"
                              :class="[
                              'flex-shrink-0 w-4 h-4 mr-3 transition-colors duration-200',
                              isActiveRoute(child.to)
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                            ]"
                          />
                          <span class="flex-1 truncate">{{ child.label }}</span>
                          <UBadge
                              v-if="child.badge"
                              :color="child.badgeColor || 'primary'"
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
                john@example.com
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

// Reactive navigation state
const navigationSections = ref<NavigationSection[]>([
  // Main Dashboard
  {
    items: [
      {
        label: 'Dashboard',
        to: '/',
        icon: 'i-heroicons-home'
      }
    ]
  },

  // Management Section
  {
    title: 'Management',
    items: [
      {
        label: 'Users',
        to: '/users',
        icon: 'i-heroicons-users',
        // badge: '12',
        badgeColor: 'blue'
      },
      {
        label: 'Products',
        icon: 'i-heroicons-cube',
        expanded: false,
        children: [
          {
            label: 'All Products',
            to: '/products',
            icon: 'i-heroicons-list-bullet'
          },
          {
            label: 'Categories',
            to: '/products/categories',
            icon: 'i-heroicons-tag'
          },
          {
            label: 'Inventory',
            to: '/products/inventory',
            icon: 'i-heroicons-archive-box'
          }
        ]
      },
      {
        label: 'Orders',
        to: '/admin/orders',
        icon: 'i-heroicons-shopping-cart',
        // badge: '5',
        badgeColor: 'red'
      },
      {
        label: 'Support',
        icon: 'i-heroicons-chat-bubble-left-right',
        expanded: false,
        children: [
          {
            label: 'Tickets',
            to: '/admin/support/tickets',
            icon: 'i-heroicons-ticket',
            badge: '3',
            badgeColor: 'orange'
          },
          {
            label: 'Live Chat',
            to: '/admin/support/chat',
            icon: 'i-heroicons-chat-bubble-oval-left'
          },
          {
            label: 'Knowledge Base',
            to: '/admin/support/kb',
            icon: 'i-heroicons-book-open'
          }
        ]
      }
    ]
  },

  // Analytics & Reports
  {
    title: 'Analytics & Reports',
    items: [
      {
        label: 'Reports',
        to: '/admin/reports',
        icon: 'i-heroicons-chart-bar'
      },
      {
        label: 'Analytics',
        to: '/admin/analytics',
        icon: 'i-heroicons-chart-pie'
      },
      {
        label: 'Marketing',
        icon: 'i-heroicons-megaphone',
        expanded: false,
        children: [
          {
            label: 'Campaigns',
            to: '/admin/marketing/campaigns',
            icon: 'i-heroicons-envelope'
          },
          {
            label: 'Promotions',
            to: '/admin/marketing/promotions',
            icon: 'i-heroicons-gift'
          },
          {
            label: 'SEO',
            to: '/admin/marketing/seo',
            icon: 'i-heroicons-magnifying-glass'
          }
        ]
      }
    ]
  },

  // System Section
  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        expanded: false,
        children: [
          {
            label: 'General',
            to: '/settings/general',
            icon: 'i-heroicons-adjustments-horizontal'
          },
          {
            label: 'Security',
            to: '/settings/security',
            icon: 'i-heroicons-shield-check'
          },
          {
            label: 'Integrations',
            to: '/settings/integration',
            icon: 'i-heroicons-puzzle-piece'
          }
        ]
      },
      {
        label: 'Help Center',
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
  return item.children.some(child => child.to && route.path.startsWith(child.to))
}

const toggleSubmenu = (item: NavigationItem) => {
  if (item.children) {
    item.expanded = !item.expanded
  }
}

// Auto-expand active parent menus
watch(() => route.path, () => {
  navigationSections.value.forEach(section => {
    section.items.forEach(item => {
      if (item.children && isActiveParent(item)) {
        item.expanded = true
      }
    })
  })
}, { immediate: true })

const userMenuItems = [
  [{
    label: 'View Profile',
    icon: 'i-heroicons-user',
    to: '/admin/profile'
  }],
  [{
    label: 'Account Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/admin/account'
  }],
  [{
    label: 'Preferences',
    icon: 'i-heroicons-adjustments-horizontal',
    to: '/admin/preferences'
  }],
  [{
    label: 'Switch Organization',
    icon: 'i-heroicons-building-office',
    click: () => console.log('Switch organization')
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