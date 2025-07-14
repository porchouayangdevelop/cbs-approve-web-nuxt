interface NavigationItem {
  label: string
  to?: string
  icon: string
  badge?: string
  badgeColor?: string
  children?: NavigationItem[]
  expanded?: boolean
  description?: string
}

interface NavigationSection {
  title?: string
  items: NavigationItem[]
}

interface RoleConfig {
  title: string
  shortTitle: string
  subtitle: string
  icon: string
  logoColor: string
  badgeColor: string
  roleTextColor: string
  searchPlaceholder: string
  notificationCount: number
  quickActions: Array<{
    label: string
    icon: string
    to?: string
    click?: () => void
    class?: string
  }>
  navigationSections: NavigationSection[]
  userMenuItems: Array<Array<{
    label: string
    icon: string
    to?: string
    click?: () => void
  }>>
}

interface RoleSessionData {
  role: string
  config: RoleConfig
  permissions: readonly string[]
  // accessibleRoutes: string[]
}

export const useRoleSession = () => {
  const {user} = useAuth();
  const route = useRoute();

  const currentRole = computed(() => user.value?.role);

  console.log(currentRole.value)

  // Role configurations
  const roleConfigs: Record<string, RoleConfig> = {
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
      ],
      navigationSections: [
        {
          items: [
            {
              label: 'Dashboard',
              to: '/',
              icon: 'i-heroicons-home'
            }
          ]
        },
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
                }
              ]
            }
          ]
        },
        {
          title: 'System Administration',
          items: [
            {
              label: 'System Health',
              to: '/admin/system/health',
              icon: 'i-heroicons-heart',
              badge: 'OK',
              badgeColor: 'green'
            },
            {
              label: 'Analytics',
              to: '/admin/analytics',
              icon: 'i-heroicons-chart-bar'
            },
            {
              label: 'Settings',
              to: '/admin/settings',
              icon: 'i-heroicons-cog-6-tooth'
            }
          ]
        }
      ],
      userMenuItems: [
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
          label: 'Switch to User View',
          icon: 'i-heroicons-arrow-right-circle',
          click: () => navigateTo('/users')
        }],
        [{
          label: 'Sign Out',
          icon: 'i-heroicons-arrow-right-on-rectangle',
          click: () => console.log('Admin logout')
        }]
      ]
    },

    checker: {
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
      ],
      navigationSections: [
        {
          items: [
            {
              label: 'Dashboard',
              to: '/checkers',
              icon: 'i-heroicons-squares-2x2'
            }
          ]
        },
        {
          title: 'Workflow Management',
          items: [
            {
              label: 'Pending Requests',
              to: '/checkers/requests/pending',
              icon: 'i-heroicons-clock',
              badge: '12',
              badgeColor: 'orange'
            },
            {
              label: 'Review Queue',
              to: '/checkers/requests/review',
              icon: 'i-heroicons-eye',
              badge: '5',
              badgeColor: 'blue'
            },
            {
              label: 'Approved',
              to: '/checkers/requests/approved',
              icon: 'i-heroicons-check-circle',
              badge: '48',
              badgeColor: 'green'
            },
            {
              label: 'Rejected',
              to: '/checkers/requests/rejected',
              icon: 'i-heroicons-x-circle',
              badge: '3',
              badgeColor: 'red'
            }
          ]
        },
        {
          title: 'Analytics & Reports',
          items: [
            {
              label: 'Approval Stats',
              to: '/checkers/stats',
              icon: 'i-heroicons-chart-bar'
            },
            {
              label: 'Workflow Analytics',
              to: '/checkers/reports/workflow',
              icon: 'i-heroicons-presentation-chart-line'
            }
          ]
        },
        {
          title: 'Tools & Settings',
          items: [
            {
              label: 'Notifications',
              to: '/checkers/notifications',
              icon: 'i-heroicons-bell',
              badge: '7',
              badgeColor: 'yellow'
            },
            {
              label: 'Settings',
              to: '/checkers/settings',
              icon: 'i-heroicons-cog-6-tooth'
            }
          ]
        }
      ],
      userMenuItems: [
        [{
          label: 'My Profile',
          icon: 'i-heroicons-user',
          to: '/checkers/profile'
        }],
        [{
          label: 'Approval History',
          icon: 'i-heroicons-clock',
          to: '/checkers/history'
        }],
        [{
          label: 'Settings',
          icon: 'i-heroicons-cog-6-tooth',
          to: '/checkers/settings'
        }],
        [{
          label: 'Sign Out',
          icon: 'i-heroicons-arrow-right-on-rectangle',
          click: () => console.log('Checker logout')
        }]
      ]
    },

    user: {
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
      ],
      navigationSections: [
        {
          items: [
            {
              label: 'Dashboard',
              to: '/users',
              icon: 'i-heroicons-squares-2x2'
            }
          ]
        },
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
                  label: 'Approved',
                  to: '/users/requests/approved',
                  icon: 'i-heroicons-check-circle',
                  badge: '15',
                  badgeColor: 'green'
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
            }
          ]
        }
      ],
      userMenuItems: [
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
          label: 'Sign Out',
          icon: 'i-heroicons-arrow-right-on-rectangle',
          click: () => console.log('User logout')
        }]
      ]
    }
  }

  // Get current role configuration
  const currentConfig = computed(() => {
    return roleConfigs[currentRole.value] || roleConfigs.user
  })

  // Get pages title based on current route
  const pageTitle = computed(() => {
    const titleMap: Record<string, string> = {
      '/': 'Dashboard',
      '/admin': 'Admin Dashboard',
      '/admin/users': 'User Management',
      '/admin/users/create': 'Create User',
      '/admin/settings': 'Settings',
      '/admin/analytics': 'Analytics',
      '/checkers': 'Checker Dashboard',
      '/checkers/requests': 'Request Management',
      '/checkers/requests/pending': 'Pending Requests',
      '/checkers/requests/review': 'Review Queue',
      '/checkers/stats': 'Approval Statistics',
      '/users': 'User Dashboard',
      '/users/requests': 'My Requests',
      '/users/requests/create': 'Create Request',
      '/users/profile': 'My Profile'
    }

    return titleMap[route.path] || currentConfig.value.subtitle
  })

  // Get breadcrumbs for current route
  const breadcrumbs = computed(() => {
    const pathSegments = route.path.split('/').filter(Boolean)
    const crumbs: Array<{ label: string; to: string }> = []

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`

      let label = segment.charAt(0).toUpperCase() + segment.slice(1)

      // Custom labels for specific routes
      const customLabels: Record<string, string> = {
        '/admin': 'Admin',
        '/checkers': 'Checker Portal',
        '/users': 'User Portal',
        '/requests': 'Requests',
        '/create': 'Create',
        '/pending': 'Pending',
        '/approved': 'Approved',
        '/rejected': 'Rejected',
        '/settings': 'Settings',
        '/profile': 'Profile'
      }

      if (customLabels[currentPath]) {
        label = customLabels[currentPath]
      }

      crumbs.push({
        label,
        to: currentPath
      })
    })

    return crumbs
  })

  // Check if current route is active
  const isActiveRoute = (to?: string): boolean => {
    if (!to) return false
    return route.path === to
  }

  // Check if parent menu is active
  const isActiveParent = (item: NavigationItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => child.to && route.path === child.to)
  }

  // Get role-specific notifications
  const getNotifications = () => {
    const notifications = {
      admin: [
        {
          title: 'New user registration',
          description: '5 new users registered today',
          icon: 'i-heroicons-user-plus',
          time: '10 minutes ago',
          type: 'info'
        },
        {
          title: 'System alert',
          description: 'Server memory usage high',
          icon: 'i-heroicons-exclamation-triangle',
          time: '30 minutes ago',
          type: 'warning'
        }
      ],
      checker: [
        {
          title: 'Pending approvals',
          description: '12 requests awaiting approval',
          icon: 'i-heroicons-clock',
          time: '5 minutes ago',
          type: 'warning'
        },
        {
          title: 'Priority request',
          description: 'High priority loan approval needed',
          icon: 'i-heroicons-exclamation-circle',
          time: '15 minutes ago',
          type: 'error'
        }
      ],
      user: [
        {
          title: 'Request approved',
          description: 'Your leave request has been approved',
          icon: 'i-heroicons-check-circle',
          time: '2 hours ago',
          type: 'success'
        },
        {
          title: 'Document required',
          description: 'Please upload supporting documents',
          icon: 'i-heroicons-paper-clip',
          time: '1 day ago',
          type: 'info'
        }
      ]
    }

    return notifications[currentRole.value as keyof typeof notifications] || []
  }

  // Navigation helpers
  const toggleSubmenu = (item: NavigationItem, sections: NavigationSection[]) => {
    if (item.children) {
      // Close all other expanded menus first
      sections.forEach(section => {
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

  // Auto-expand active parent menus
  const autoExpandActiveMenus = (sections: NavigationSection[]) => {
    sections.forEach(section => {
      section.items.forEach(item => {
        if (item.children) {
          if (isActiveParent(item)) {
            item.expanded = true
          }
        }
      })
    })
  }

  // Get user profile data
  const userProfile = computed(() => ({
    name: user.value?.firstName && user.value?.lastName
      ? `${user.value.firstName} ${user.value.lastName}`
      : user.value?.username || 'User',
    avatar: user.value?.avatar || 'https://avatars.githubusercontent.com/u/739984?v=4',
    email: user.value?.email || 'user@example.com',
    roleTitle: getRoleTitle(user.value?.role)
  }))

  // Helper function to get role title
  const getRoleTitle = (role?: string) => {
    const titles = {
      admin: 'System Administrator',
      checker: 'Approval Specialist',
      user: 'Standard User',
      manager: 'Department Manager'
    }
    return titles[role as keyof typeof titles]
  }

  // Session management
  const sessionData = computed((): RoleSessionData => ({
    role: currentRole.value,
    config: currentConfig.value,
    permissions: user.value?.permissions || [],
    // accessibleRoutes: getAccessibleRoutes()
  }))

  // Get accessible routes based on a role and permissions
  // const getAccessibleRoutes = (): string[] => {
  //   const {getAccessibleRoutes} = useGuards()
  //   return getAccessibleRoutes()
  // }

  return {
    // Current state
    currentRole: readonly(currentRole),
    currentConfig: readonly(currentConfig),
    pageTitle: readonly(pageTitle),
    breadcrumbs: readonly(breadcrumbs),
    userProfile: readonly(userProfile),
    sessionData: readonly(sessionData),

    // Navigation helpers
    isActiveRoute,
    isActiveParent,
    toggleSubmenu,
    autoExpandActiveMenus,

    // Data getters
    getNotifications,
    getRoleTitle,
    // getAccessibleRoutes,

    // Role configs (for reference)
    roleConfigs: readonly(roleConfigs)
  }

}
