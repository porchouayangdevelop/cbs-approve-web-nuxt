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
  userProfile: any
}

export const useRoleSession = () => {
  const { user } = useAuth();
  const { currentUserRole, getUserProfile } = useCheckAuth();
  const { getUserPermissions } = usePermissions();
  const route = useRoute();

  // Get the current role from user state or JWT token
  const currentRole = computed(() => {
    if (user.value?.role) {
      return user.value.role.toLowerCase();
    }

    const jwtRole = currentUserRole();
    if (jwtRole) {
      return jwtRole.toLowerCase();
    }

    return user.value?.role;
  });

  // Get enhanced user profile from JWT token
  const userProfile = computed(() => {
    // First try to get from auth state
    if (user.value) {
      return {
        name: `${user.value.firstName} ${user.value.lastName}`.trim(),
        avatar: user.value.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value.firstName || '')}+${encodeURIComponent(user.value.lastName || '')}`,
        email: user.value.email || '',
        roleTitle: getRoleTitle(user.value.role),
        username: user.value.username || '',
        id: user.value.id || '',
        department: user.value.department || '',
        permissions: user.value.permissions || []
      };
    }

    // Fallback to JWT token profile
    const profile = getUserProfile();
    if (profile) {
      return {
        name: profile.firstName,
        avatar: profile.avatar,
        email: profile.email,
        roleTitle: getRoleTitle(profile.currentRole || ''),
        username: profile.username,
        id: profile.id,
        department: profile.department,
        permissions: profile.permissions
      };
    }

    // Default profile
    return {
      name: 'User',
      avatar: 'https://ui-avatars.com/api/?name=User',
      email: 'user@example.com',
      roleTitle: 'Standard User',
      username: 'user',
      id: '1',
      department: '',
      permissions: []
    };
  });

  // Role configurations with dynamic data
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
          to: '/admin/users/create',
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
              to: '/admin',
              icon: 'i-heroicons-home'
            }
          ]
        },

        {
          title: 'User & Role Management',
          items: [
            {
              label: 'User Management',
              to: '/admin/users',
              icon: 'i-heroicons-users',
              badge: '245',
              badgeColor: 'blue'
            },
            {
              label: 'Roles & Permissions',
              to: '/admin/roles',
              icon: 'i-heroicons-shield-check'
            },
            {
              label: 'Audit Logs',
              to: '/admin/audit-logs',
              icon: 'i-heroicons-document-text'
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
          click: () => handleLogout()
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
          click: () => handleLogout()
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
          click: () => handleLogout()
        }]
      ]
    },
  }

  // Get current role configuration
  const currentConfig = computed(() => {
    return roleConfigs[currentRole.value || ''] || roleConfigs.user
  })

  // Get page title based on current route
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
      '/users/profile': 'My Profile',
      '/users/team': 'Team Management'
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
        '/profile': 'Profile',
        '/team': 'Team'
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

  // Get role-specific notifications with real-time data
  const getNotifications = () => {
    const role = currentRole.value
    const userPermissions = getUserPermissions.value

    const notifications = {
      admin: [
        {
          title: 'New user registration',
          description: '5 new users registered today',
          icon: 'i-heroicons-user-plus',
          time: '10 minutes ago',
          type: 'info',
          count: 5
        },
        {
          title: 'System alert',
          description: 'Server memory usage high',
          icon: 'i-heroicons-exclamation-triangle',
          time: '30 minutes ago',
          type: 'warning',
          count: 1
        },
        {
          title: 'Security update',
          description: 'New security patch available',
          icon: 'i-heroicons-shield-check',
          time: '2 hours ago',
          type: 'info',
          count: 1
        }
      ],
      checker: [
        {
          title: 'Pending approvals',
          description: '12 requests awaiting approval',
          icon: 'i-heroicons-clock',
          time: '5 minutes ago',
          type: 'warning',
          count: 12
        },
        {
          title: 'Priority request',
          description: 'High priority loan approval needed',
          icon: 'i-heroicons-exclamation-circle',
          time: '15 minutes ago',
          type: 'error',
          count: 1
        },
        {
          title: 'Workflow update',
          description: 'New approval workflow activated',
          icon: 'i-heroicons-arrow-path',
          time: '1 hour ago',
          type: 'info',
          count: 1
        }
      ],
      user: [
        {
          title: 'Request approved',
          description: 'Your leave request has been approved',
          icon: 'i-heroicons-check-circle',
          time: '2 hours ago',
          type: 'success',
          count: 1
        },
        {
          title: 'Document required',
          description: 'Please upload supporting documents',
          icon: 'i-heroicons-paper-clip',
          time: '1 day ago',
          type: 'info',
          count: 1
        },
        {
          title: 'Template updated',
          description: 'New request template available',
          icon: 'i-heroicons-document-duplicate',
          time: '2 days ago',
          type: 'info',
          count: 1
        }
      ],
      manager: [
        {
          title: 'Team request pending',
          description: '3 team requests need your approval',
          icon: 'i-heroicons-user-group',
          time: '1 hour ago',
          type: 'warning',
          count: 3
        },
        {
          title: 'Performance report',
          description: 'Weekly team performance report available',
          icon: 'i-heroicons-chart-bar',
          time: '4 hours ago',
          type: 'info',
          count: 1
        }
      ]
    }

    return notifications[role as keyof typeof notifications] || []
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

  // Helper function to get role title
  const getRoleTitle = (role?: string) => {
    const titles = {
      admin: 'System Administrator',
      checker: 'Approval Specialist',
      user: 'Standard User',
      manager: 'Team Manager'
    }
    return titles[role as keyof typeof titles] || 'Standard User'
  }

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      const { logout } = useAuth()
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Session management
  const sessionData = computed((): RoleSessionData => ({
    role: currentRole.value ? currentRole.value : '',
    config: currentConfig.value,
    permissions: getUserPermissions.value,
    userProfile: userProfile.value
  }))

  // Get role-specific dashboard metrics
  const getDashboardMetrics = () => {
    const role = currentRole.value

    const metrics = {
      admin: [
        { label: 'Total Users', value: '1,234', icon: 'i-heroicons-users', color: 'blue' },
        { label: 'Active Sessions', value: '89', icon: 'i-heroicons-signal', color: 'green' },
        { label: 'System Health', value: '98%', icon: 'i-heroicons-heart', color: 'green' },
        { label: 'Pending Tasks', value: '12', icon: 'i-heroicons-exclamation-triangle', color: 'orange' }
      ],
      checker: [
        { label: 'Pending Approvals', value: '23', icon: 'i-heroicons-clock', color: 'orange' },
        { label: 'Approved Today', value: '45', icon: 'i-heroicons-check-circle', color: 'green' },
        { label: 'Avg. Response Time', value: '2.3h', icon: 'i-heroicons-bolt', color: 'blue' },
        { label: 'Success Rate', value: '94%', icon: 'i-heroicons-chart-bar', color: 'green' }
      ],
      user: [
        { label: 'My Requests', value: '8', icon: 'i-heroicons-document-text', color: 'blue' },
        { label: 'Approved', value: '15', icon: 'i-heroicons-check-circle', color: 'green' },
        { label: 'Pending', value: '3', icon: 'i-heroicons-clock', color: 'orange' },
        { label: 'Draft', value: '2', icon: 'i-heroicons-document-plus', color: 'gray' }
      ],
      manager: [
        { label: 'Team Requests', value: '34', icon: 'i-heroicons-user-group', color: 'blue' },
        { label: 'Team Performance', value: '92%', icon: 'i-heroicons-chart-bar', color: 'green' },
        { label: 'Pending Approvals', value: '7', icon: 'i-heroicons-clock', color: 'orange' },
        { label: 'Team Size', value: '12', icon: 'i-heroicons-users', color: 'purple' }
      ]
    }

    return metrics[role as keyof typeof metrics] || metrics.user
  }

  // Get recent activity based on role
  const getRecentActivity = () => {
    const role = currentRole.value

    const activities = {
      admin: [
        { action: 'User created', subject: 'john.doe@company.com', time: '2 minutes ago', type: 'create' },
        { action: 'System backup', subject: 'completed successfully', time: '1 hour ago', type: 'success' },
        { action: 'Security alert', subject: 'resolved', time: '3 hours ago', type: 'warning' }
      ],
      checker: [
        { action: 'Request approved', subject: 'Leave Request #1234', time: '5 minutes ago', type: 'approve' },
        { action: 'Request reviewed', subject: 'Expense Report #5678', time: '30 minutes ago', type: 'review' },
        { action: 'Workflow updated', subject: 'Priority approval process', time: '2 hours ago', type: 'update' }
      ],
      user: [
        { action: 'Request submitted', subject: 'Annual Leave Request', time: '1 hour ago', type: 'create' },
        { action: 'Document uploaded', subject: 'Supporting documents', time: '3 hours ago', type: 'upload' },
        { action: 'Profile updated', subject: 'Contact information', time: '1 day ago', type: 'update' }
      ],
    }

    return activities[role as keyof typeof activities] || activities.user
  }

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
    getDashboardMetrics,
    getRecentActivity,
    getRoleTitle,

    // Utility functions
    handleLogout,

    // Role configs (for reference)
    roleConfigs: readonly(roleConfigs)
  }
}