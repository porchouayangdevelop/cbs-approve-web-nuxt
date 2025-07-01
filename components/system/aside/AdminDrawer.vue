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
                      @click="$emit('navigate'); handleDirectNavigation()"
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
                            @click="$emit('navigate'); handleDirectNavigation()"
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
        <UDropdownMenu
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
        </UDropdownMenu>
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

// Reactive navigation state for Admin
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

  // User Management Section
  {
    title: 'User Management',
    items: [
      {
        label: 'All Users',
        to: '/admin/users',
        icon: 'i-heroicons-users',
        badge: '245',
        badgeColor: 'blue'
      },
      {
        label: 'User Management',
        icon: 'i-heroicons-user-group',
        expanded: false,
        children: [
          {
            label: 'Create User',
            to: '/admin/users/create',
            icon: 'i-heroicons-user-plus'
          },
          {
            label: 'Bulk Import',
            to: '/admin/users/import',
            icon: 'i-heroicons-arrow-up-tray'
          },
          {
            label: 'Active Users',
            to: '/admin/users/active',
            icon: 'i-heroicons-check-circle',
            badge: '198',
            badgeColor: 'green'
          },
          {
            label: 'Inactive Users',
            to: '/admin/users/inactive',
            icon: 'i-heroicons-x-circle',
            badge: '47',
            badgeColor: 'red'
          },
          {
            label: 'Pending Approval',
            to: '/admin/users/pending',
            icon: 'i-heroicons-clock',
            badge: '12',
            badgeColor: 'yellow'
          }
        ]
      },
      {
        label: 'Roles & Permissions',
        icon: 'i-heroicons-shield-check',
        expanded: false,
        children: [
          {
            label: 'Manage Roles',
            to: '/admin/roles',
            icon: 'i-heroicons-key'
          },
          {
            label: 'Permissions',
            to: '/admin/permissions',
            icon: 'i-heroicons-lock-closed'
          },
          {
            label: 'Access Control',
            to: '/admin/access-control',
            icon: 'i-heroicons-shield-exclamation'
          }
        ]
      }
    ]
  },

  // Checker Management Section
  {
    title: 'Checker Management',
    items: [
      {
        label: 'All Checkers',
        to: '/admin/checkers',
        icon: 'i-heroicons-check-badge',
        badge: '24',
        badgeColor: 'blue'
      },
      {
        label: 'Checker Operations',
        icon: 'i-heroicons-clipboard-document-check',
        expanded: false,
        children: [
          {
            label: 'Create Checker',
            to: '/admin/checkers/create',
            icon: 'i-heroicons-user-plus'
          },
          {
            label: 'Checker Assignments',
            to: '/admin/checkers/assignments',
            icon: 'i-heroicons-user-group'
          },
          {
            label: 'Active Checkers',
            to: '/admin/checkers/active',
            icon: 'i-heroicons-check-circle',
            badge: '18',
            badgeColor: 'green'
          },
          {
            label: 'Checker Performance',
            to: '/admin/checkers/performance',
            icon: 'i-heroicons-chart-bar'
          }
        ]
      },
      {
        label: 'Approval Workflows',
        icon: 'i-heroicons-arrow-path',
        expanded: false,
        children: [
          {
            label: 'Workflow Templates',
            to: '/admin/workflows/templates',
            icon: 'i-heroicons-document-duplicate'
          },
          {
            label: 'Approval Rules',
            to: '/admin/workflows/rules',
            icon: 'i-heroicons-clipboard-document-list'
          },
          {
            label: 'Escalation Matrix',
            to: '/admin/workflows/escalation',
            icon: 'i-heroicons-arrow-trending-up'
          },
          {
            label: 'SLA Management',
            to: '/admin/workflows/sla',
            icon: 'i-heroicons-clock'
          }
        ]
      },
      {
        label: 'Approval Analytics',
        to: '/admin/checkers/analytics',
        icon: 'i-heroicons-chart-pie',
        badge: 'New',
        badgeColor: 'purple'
      }
    ]
  },

  // System Maintenance Section
  {
    title: 'System Maintenance',
    items: [
      {
        label: 'System Health',
        to: '/admin/system/health',
        icon: 'i-heroicons-heart',
        badge: 'OK',
        badgeColor: 'green'
      },
      {
        label: 'Database Management',
        icon: 'i-heroicons-circle-stack',
        expanded: false,
        children: [
          {
            label: 'Database Status',
            to: '/admin/database/status',
            icon: 'i-heroicons-cpu-chip'
          },
          {
            label: 'Backup & Restore',
            to: '/admin/database/backup',
            icon: 'i-heroicons-archive-box'
          },
          {
            label: 'Data Migration',
            to: '/admin/database/migration',
            icon: 'i-heroicons-arrow-right'
          },
          {
            label: 'Performance Tuning',
            to: '/admin/database/performance',
            icon: 'i-heroicons-bolt'
          }
        ]
      },
      {
        label: 'Security & Monitoring',
        icon: 'i-heroicons-shield-check',
        expanded: false,
        children: [
          {
            label: 'Security Logs',
            to: '/admin/security/logs',
            icon: 'i-heroicons-document-text'
          },
          {
            label: 'Access Monitoring',
            to: '/admin/security/monitoring',
            icon: 'i-heroicons-eye'
          },
          {
            label: 'Firewall Settings',
            to: '/admin/security/firewall',
            icon: 'i-heroicons-shield-exclamation'
          },
          {
            label: 'Vulnerability Scan',
            to: '/admin/security/scan',
            icon: 'i-heroicons-bug-ant',
            badge: '2',
            badgeColor: 'orange'
          }
        ]
      },
      {
        label: 'System Configuration',
        icon: 'i-heroicons-cog-8-tooth',
        expanded: false,
        children: [
          {
            label: 'General Settings',
            to: '/admin/config/general',
            icon: 'i-heroicons-adjustments-horizontal'
          },
          {
            label: 'Email Settings',
            to: '/admin/config/email',
            icon: 'i-heroicons-envelope'
          },
          {
            label: 'Notification Settings',
            to: '/admin/config/notifications',
            icon: 'i-heroicons-bell'
          },
          {
            label: 'API Configuration',
            to: '/admin/config/api',
            icon: 'i-heroicons-code-bracket'
          }
        ]
      }
    ]
  },

  // Content & Operations
  {
    title: 'Content & Operations',
    items: [
      {
        label: 'Request Management',
        icon: 'i-heroicons-document-text',
        expanded: false,
        children: [
          {
            label: 'All Requests',
            to: '/admin/requests',
            icon: 'i-heroicons-list-bullet',
            badge: '1,234',
            badgeColor: 'blue'
          },
          {
            label: 'Request Categories',
            to: '/admin/requests/categories',
            icon: 'i-heroicons-tag'
          },
          {
            label: 'Templates',
            to: '/admin/requests/templates',
            icon: 'i-heroicons-document-duplicate'
          },
          {
            label: 'Archived Requests',
            to: '/admin/requests/archived',
            icon: 'i-heroicons-archive-box'
          }
        ]
      },
      {
        label: 'Content Management',
        icon: 'i-heroicons-document-text',
        expanded: false,
        children: [
          {
            label: 'Pages',
            to: '/admin/content/pages',
            icon: 'i-heroicons-document'
          },
          {
            label: 'Announcements',
            to: '/admin/content/announcements',
            icon: 'i-heroicons-megaphone'
          },
          {
            label: 'Help Documents',
            to: '/admin/content/help',
            icon: 'i-heroicons-question-mark-circle'
          },
          {
            label: 'File Manager',
            to: '/admin/content/files',
            icon: 'i-heroicons-folder'
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
        label: 'System Analytics',
        to: '/admin/analytics',
        icon: 'i-heroicons-chart-bar'
      },
      {
        label: 'Reports',
        icon: 'i-heroicons-document-chart-bar',
        expanded: false,
        children: [
          {
            label: 'User Activity',
            to: '/admin/reports/user-activity',
            icon: 'i-heroicons-users'
          },
          {
            label: 'Approval Reports',
            to: '/admin/reports/approvals',
            icon: 'i-heroicons-check-circle'
          },
          {
            label: 'Performance Reports',
            to: '/admin/reports/performance',
            icon: 'i-heroicons-chart-pie'
          },
          {
            label: 'Custom Reports',
            to: '/admin/reports/custom',
            icon: 'i-heroicons-document-plus'
          }
        ]
      },
      {
        label: 'Audit Logs',
        to: '/admin/audit-logs',
        icon: 'i-heroicons-clipboard-document-list'
      }
    ]
  },

  // System Administration
  {
    title: 'System Administration',
    items: [
      {
        label: 'Application Settings',
        icon: 'i-heroicons-cog-6-tooth',
        expanded: false,
        children: [
          {
            label: 'General Settings',
            to: '/admin/settings/general',
            icon: 'i-heroicons-adjustments-horizontal'
          },
          {
            label: 'Security Settings',
            to: '/admin/settings/security',
            icon: 'i-heroicons-shield-check'
          },
          {
            label: 'Integration Settings',
            to: '/admin/settings/integrations',
            icon: 'i-heroicons-puzzle-piece'
          },
          {
            label: 'Backup Settings',
            to: '/admin/settings/backup',
            icon: 'i-heroicons-cloud-arrow-up'
          }
        ]
      },
      {
        label: 'Maintenance Tasks',
        icon: 'i-heroicons-wrench-screwdriver',
        expanded: false,
        children: [
          {
            label: 'Scheduled Tasks',
            to: '/admin/maintenance/tasks',
            icon: 'i-heroicons-calendar'
          },
          {
            label: 'System Cleanup',
            to: '/admin/maintenance/cleanup',
            icon: 'i-heroicons-trash'
          },
          {
            label: 'Cache Management',
            to: '/admin/maintenance/cache',
            icon: 'i-heroicons-server'
          },
          {
            label: 'Log Rotation',
            to: '/admin/maintenance/logs',
            icon: 'i-heroicons-arrow-path'
          }
        ]
      },
      {
        label: 'Help & Support',
        to: '/admin/help',
        icon: 'i-heroicons-question-mark-circle'
      }
    ]
  }
])

// Helper functions - Updated for exact route matching and proper menu behavior
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
    label: 'Admin Profile',
    icon: 'i-heroicons-user',
    to: '/admin/profile'
  }],
  [{
    label: 'System Status',
    icon: 'i-heroicons-server',
    to: '/admin/system/status'
  }],
  [{
    label: 'Quick Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/admin/settings/quick'
  }],
  [{
    label: 'Admin Preferences',
    icon: 'i-heroicons-adjustments-horizontal',
    to: '/admin/preferences'
  }],
  [{
    label: 'Switch to User View',
    icon: 'i-heroicons-arrow-right-circle',
    click: () => console.log('Switch to user view')
  }],
  [{
    label: 'Emergency Mode',
    icon: 'i-heroicons-exclamation-triangle',
    click: () => console.log('Enable emergency mode')
  }],
  [{
    label: 'Admin Help',
    icon: 'i-heroicons-question-mark-circle',
    to: '/admin/help'
  }],
  [{
    label: 'Sign Out',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => {
      console.log('Admin logout clicked')
      emit('navigate')
    }
  }]
]
</script>