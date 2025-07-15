export const useRoleNavigation = () => {
  const { user } = useAuth();
  const { currentUserRole } = useCheckAuth();
  const { hasPermission, hasAnyPermission } = usePermissions();

  // Get the current user's role from either auth state or JWT token
  const getCurrentRole = (): string | null => {
    // First try to get from user state
    if (user.value?.role) {
      return user.value.role.toLowerCase();
    }

    // Fallback to JWT token
    return currentUserRole();
  };

  // Get default route based on user role
  const getDefaultRoute = (): string => {
    const role = getCurrentRole();

    if (!role) {
      return '/auth/login';
    }

    const defaultRoutes: Record<string, string> = {
      'admin': '/admin',
      'checker': '/checkers',
      'user': '/users',
      'manager': '/users' // Managers use the same interface as users but with elevated permissions
    };

    return defaultRoutes[role] || '/dashboard';
  };

  // Check if user can register new users (admin only)
  const canRegister = (): boolean => {
    const role = getCurrentRole();
    return role === 'admin' && hasPermission('users:create');
  };

  // Get accessible navigation items based on role and permissions
  const getAccessibleNavigation = () => {
    const role = getCurrentRole();

    if (!role) {
      return [];
    }

    const navigationItems = {
      admin: [
        {
          label: 'Dashboard',
          path: '/admin',
          icon: 'i-heroicons-home',
          permission: 'admin:access'
        },
        {
          label: 'User Management',
          path: '/admin/users',
          icon: 'i-heroicons-users',
          permission: 'users:manage'
        },
        {
          label: 'System Settings',
          path: '/admin/settings',
          icon: 'i-heroicons-cog-6-tooth',
          permission: 'settings:manage'
        },
        {
          label: 'Analytics',
          path: '/admin/analytics',
          icon: 'i-heroicons-chart-bar',
          permission: 'analytics:read'
        },
        {
          label: 'Checkers',
          path: '/admin/checkers',
          icon: 'i-heroicons-check-circle',
          permission: 'checkers:manage'
        },
        {
          label: 'Reports',
          path: '/admin/reports',
          icon: 'i-heroicons-document-chart-bar',
          permission: 'reports:read'
        }
      ],
      checker: [
        {
          label: 'Dashboard',
          path: '/checkers',
          icon: 'i-heroicons-squares-2x2',
          permission: 'checker:access'
        },
        {
          label: 'Pending Requests',
          path: '/checkers/requests/pending',
          icon: 'i-heroicons-clock',
          permission: 'requests:review'
        },
        {
          label: 'Review Queue',
          path: '/checkers/requests/review',
          icon: 'i-heroicons-eye',
          permission: 'requests:review'
        },
        {
          label: 'Approved Requests',
          path: '/checkers/requests/approved',
          icon: 'i-heroicons-check-circle',
          permission: 'requests:read'
        },
        {
          label: 'Statistics',
          path: '/checkers/stats',
          icon: 'i-heroicons-chart-bar',
          permission: 'stats:review'
        },
        {
          label: 'Workflows',
          path: '/checkers/workflows',
          icon: 'i-heroicons-arrow-path',
          permission: 'workflows:review'
        }
      ],
      user: [
        {
          label: 'Dashboard',
          path: '/users',
          icon: 'i-heroicons-squares-2x2',
          permission: 'users:read'
        },
        {
          label: 'Create Request',
          path: '/users/requests/create',
          icon: 'i-heroicons-plus-circle',
          permission: 'requests:create'
        },
        {
          label: 'My Requests',
          path: '/users/requests',
          icon: 'i-heroicons-document-text',
          permission: 'requests:read'
        },
        {
          label: 'Templates',
          path: '/users/templates',
          icon: 'i-heroicons-document-duplicate',
          permission: 'templates:read'
        },
        {
          label: 'Profile',
          path: '/users/profile',
          icon: 'i-heroicons-user',
          permission: 'profile:read'
        }
      ],
      manager: [
        {
          label: 'Dashboard',
          path: '/users',
          icon: 'i-heroicons-squares-2x2',
          permission: 'users:read'
        },
        {
          label: 'Team Requests',
          path: '/users/requests',
          icon: 'i-heroicons-document-text',
          permission: 'requests:review'
        },
        {
          label: 'Create Request',
          path: '/users/requests/create',
          icon: 'i-heroicons-plus-circle',
          permission: 'requests:create'
        },
        {
          label: 'Team Management',
          path: '/users/team',
          icon: 'i-heroicons-user-group',
          permission: 'team:manage'
        },
        {
          label: 'Analytics',
          path: '/users/analytics',
          icon: 'i-heroicons-chart-bar',
          permission: 'analytics:read'
        }
      ]
    };

    const roleNavigation = navigationItems[role as keyof typeof navigationItems] || [];

    // Filter navigation items based on permissions
    return roleNavigation.filter(item =>
      !item.permission || hasPermission(item.permission)
    );
  };

  // Get role-specific quick actions
  const getQuickActions = () => {
    const role = getCurrentRole();

    if (!role) {
      return [];
    }

    const quickActions = {
      admin: [
        {
          label: 'Add User',
          action: () => navigateTo('/admin/users/create'),
          icon: 'i-heroicons-user-plus',
          permission: 'users:create'
        },
        {
          label: 'System Status',
          action: () => navigateTo('/admin/system/health'),
          icon: 'i-heroicons-heart',
          permission: 'system:manage'
        },
        {
          label: 'View Reports',
          action: () => navigateTo('/admin/reports'),
          icon: 'i-heroicons-document-chart-bar',
          permission: 'reports:read'
        }
      ],
      checker: [
        {
          label: 'Review Queue',
          action: () => navigateTo('/checkers/requests/review'),
          icon: 'i-heroicons-eye',
          permission: 'requests:review'
        },
        {
          label: 'Pending Items',
          action: () => navigateTo('/checkers/requests/pending'),
          icon: 'i-heroicons-clock',
          permission: 'requests:review'
        },
        {
          label: 'My Stats',
          action: () => navigateTo('/checkers/stats'),
          icon: 'i-heroicons-chart-pie',
          permission: 'stats:review'
        }
      ],
      user: [
        {
          label: 'New Request',
          action: () => navigateTo('/users/requests/create'),
          icon: 'i-heroicons-plus-circle',
          permission: 'requests:create'
        },
        {
          label: 'My Requests',
          action: () => navigateTo('/users/requests'),
          icon: 'i-heroicons-document-text',
          permission: 'requests:read'
        },
        {
          label: 'Profile',
          action: () => navigateTo('/users/profile'),
          icon: 'i-heroicons-user',
          permission: 'profile:read'
        }
      ],
      manager: [
        {
          label: 'Team Overview',
          action: () => navigateTo('/users/team'),
          icon: 'i-heroicons-user-group',
          permission: 'team:manage'
        },
        {
          label: 'Approve Requests',
          action: () => navigateTo('/users/requests/review'),
          icon: 'i-heroicons-check-circle',
          permission: 'requests:approve'
        },
        {
          label: 'Team Analytics',
          action: () => navigateTo('/users/analytics'),
          icon: 'i-heroicons-chart-bar',
          permission: 'analytics:read'
        }
      ]
    };

    const roleActions = quickActions[role as keyof typeof quickActions] || [];

    // Filter actions based on permissions
    return roleActions.filter(action =>
      !action.permission || hasPermission(action.permission)
    );
  };

  // Get role-specific dashboard widgets
  const getDashboardWidgets = () => {
    const role = getCurrentRole();

    if (!role) {
      return [];
    }

    const widgets = {
      admin: [
        {
          id: 'users-overview',
          title: 'Users Overview',
          component: 'AdminUsersWidget',
          permission: 'users:read',
          size: 'large'
        },
        {
          id: 'system-health',
          title: 'System Health',
          component: 'SystemHealthWidget',
          permission: 'system:manage',
          size: 'medium'
        },
        {
          id: 'recent-activity',
          title: 'Recent Activity',
          component: 'RecentActivityWidget',
          permission: 'audit:read',
          size: 'medium'
        }
      ],
      checker: [
        {
          id: 'pending-requests',
          title: 'Pending Requests',
          component: 'PendingRequestsWidget',
          permission: 'requests:review',
          size: 'large'
        },
        {
          id: 'approval-stats',
          title: 'Approval Statistics',
          component: 'ApprovalStatsWidget',
          permission: 'stats:review',
          size: 'medium'
        },
        {
          id: 'workflow-status',
          title: 'Workflow Status',
          component: 'WorkflowStatusWidget',
          permission: 'workflows:review',
          size: 'medium'
        }
      ],
      user: [
        {
          id: 'my-requests',
          title: 'My Requests',
          component: 'UserRequestsWidget',
          permission: 'requests:read',
          size: 'large'
        },
        {
          id: 'quick-actions',
          title: 'Quick Actions',
          component: 'QuickActionsWidget',
          permission: 'requests:create',
          size: 'medium'
        },
        {
          id: 'notifications',
          title: 'Notifications',
          component: 'NotificationsWidget',
          permission: 'notifications:read',
          size: 'medium'
        }
      ],
      manager: [
        {
          id: 'team-requests',
          title: 'Team Requests',
          component: 'TeamRequestsWidget',
          permission: 'requests:review',
          size: 'large'
        },
        {
          id: 'team-performance',
          title: 'Team Performance',
          component: 'TeamPerformanceWidget',
          permission: 'analytics:read',
          size: 'medium'
        },
        {
          id: 'approval-queue',
          title: 'Approval Queue',
          component: 'ApprovalQueueWidget',
          permission: 'requests:approve',
          size: 'medium'
        }
      ]
    };

    const roleWidgets = widgets[role as keyof typeof widgets] || [];

    // Filter widgets based on permissions
    return roleWidgets.filter(widget =>
      !widget.permission || hasPermission(widget.permission)
    );
  };

  // Check if user can access a specific feature
  const canAccessFeature = (feature: string): boolean => {
    const featurePermissions: Record<string, string[]> = {
      'user-creation': ['users:create'],
      'user-management': ['users:manage', 'users:edit'],
      'system-settings': ['settings:manage'],
      'approval-workflow': ['approval:access', 'checker:access'],
      'analytics': ['analytics:read', 'reports:read'],
      'audit-logs': ['audit:read'],
      'role-management': ['roles:manage'],
      'permission-management': ['permissions:manage']
    };

    const requiredPermissions = featurePermissions[feature] || [];
    return hasAnyPermission(requiredPermissions);
  };

  // Get role-specific layout preferences
  const getLayoutPreferences = () => {
    const role = getCurrentRole();

    const layoutPreferences = {
      admin: {
        sidebarCollapsed: false,
        theme: 'system',
        compactMode: false,
        showAdvancedFeatures: true,
        primaryColor: 'red'
      },
      checker: {
        sidebarCollapsed: false,
        theme: 'system',
        compactMode: true,
        showAdvancedFeatures: false,
        primaryColor: 'blue'
      },
      user: {
        sidebarCollapsed: true,
        theme: 'light',
        compactMode: true,
        showAdvancedFeatures: false,
        primaryColor: 'green'
      },
      manager: {
        sidebarCollapsed: false,
        theme: 'system',
        compactMode: false,
        showAdvancedFeatures: true,
        primaryColor: 'purple'
      }
    };

    return layoutPreferences[role as keyof typeof layoutPreferences] || layoutPreferences.user;
  };

  // Navigate to role-appropriate home page
  const navigateToHome = async () => {
    const defaultRoute = getDefaultRoute();
    await navigateTo(defaultRoute);
  };

  // Get role display information
  const getRoleDisplayInfo = () => {
    const role = getCurrentRole();

    const roleInfo = {
      admin: {
        title: 'System Administrator',
        description: 'Full system access and user management',
        badgeColor: 'red',
        icon: 'i-heroicons-shield-check'
      },
      checker: {
        title: 'Approval Specialist',
        description: 'Request review and approval workflow',
        badgeColor: 'blue',
        icon: 'i-heroicons-check-circle'
      },
      user: {
        title: 'Standard User',
        description: 'Create and manage personal requests',
        badgeColor: 'green',
        icon: 'i-heroicons-user'
      },
      manager: {
        title: 'Team Manager',
        description: 'Team oversight and approval authority',
        badgeColor: 'purple',
        icon: 'i-heroicons-user-group'
      }
    };

    return roleInfo[role as keyof typeof roleInfo] || roleInfo.user;
  };

  return {
    getCurrentRole,
    getDefaultRoute,
    canRegister,
    getAccessibleNavigation,
    getQuickActions,
    getDashboardWidgets,
    canAccessFeature,
    getLayoutPreferences,
    navigateToHome,
    getRoleDisplayInfo
  };
};