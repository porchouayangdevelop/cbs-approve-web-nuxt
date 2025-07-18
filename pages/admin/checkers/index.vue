<script setup lang="ts">
import BaseTable from "~/components/common/BaseTable.vue";

definePageMeta({
  layout: 'admin-session',
  middleware: ['auth-guard', 'admin-guard']
})
const users = ref([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    department: 'Engineering',
    avatar: 'https://avatars.githubusercontent.com/u/739984?v=4',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    department: 'Marketing',
    avatar: 'https://avatars.githubusercontent.com/u/739984?v=4',
    lastLogin: '2024-01-14T15:45:00Z',
    createdAt: '2023-02-10T09:15:00Z'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Checker',
    status: 'inactive',
    department: 'Operations',
    avatar: 'https://avatars.githubusercontent.com/u/739984?v=4',
    lastLogin: '2024-01-10T08:20:00Z',
    createdAt: '2023-03-20T14:30:00Z'
  }
])

// Table configuration
const userColumns = [
  {
    key: 'name',
    label: 'User',
    type: 'text',
    sortable: true,
    required: true
  },
  {
    key: 'role',
    label: 'Role',
    type: 'badge',
    colorMap: {
      'Admin': 'red',
      'Checker': 'blue',
      'User': 'green'
    }
  },
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    colorMap: {
      'active': 'green',
      'inactive': 'red',
      'pending': 'yellow'
    }
  },
  {
    key: 'department',
    label: 'Department',
    type: 'text'
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    type: 'date',
    showRelative: true
  },
  {
    key: 'actions',
    label: 'Actions',
    type: 'actions'
  }
]

const userFilters = [
  {
    key: 'status',
    type: 'select',
    placeholder: 'Filter by status',
    options: ['active', 'inactive', 'pending']
  },
  {
    key: 'role',
    type: 'select',
    placeholder: 'Filter by role',
    options: ['Admin', 'Checker', 'User']
  }
]

const userBulkActions = [
  {
    label: 'Activate Users',
    icon: 'i-heroicons-check-circle',
    action: (selectedUsers: any[]) => {
      console.log('Activating users:', selectedUsers)
    }
  },
  {
    label: 'Deactivate Users',
    icon: 'i-heroicons-x-circle',
    action: (selectedUsers: any[]) => {
      console.log('Deactivating users:', selectedUsers)
    }
  },
  {
    label: 'Delete Users',
    icon: 'i-heroicons-trash',
    action: (selectedUsers: any[]) => {
      console.log('Deleting users:', selectedUsers)
    }
  }
]

// State
const loading = ref(false)
const statusFilter = ref('')
const roleFilter = ref('')
const departmentFilter = ref('')

// Options for filters
const statusOptions = ['All Status', 'active', 'inactive', 'pending']
const roleOptions = ['All Roles', 'Admin', 'Checker', 'User']
const departmentOptions = ['All Departments', 'Engineering', 'Marketing', 'Operations']

// Methods
const getUserRowActions = (row: any, index: number) => {
  return [
    [{
      label: 'View Profile',
      icon: 'i-heroicons-eye',
      click: () => handleUserAction('view', row, index)
    }],
    [{
      label: 'Edit User',
      icon: 'i-heroicons-pencil-square',
      click: () => handleUserAction('edit', row, index)
    }],
    [{
      label: 'Delete User',
      icon: 'i-heroicons-trash',
      click: () => handleUserAction('delete', row, index)
    }]
  ]
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'green',
    'inactive': 'red',
    'pending': 'yellow'
  }
  return colors[status] || 'gray'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return `${Math.floor(days / 7)} weeks ago`
}

// Event handlers
const handleCreateUser = () => {
  console.log('Create user clicked')
  navigateTo('/admin/users/create')
}

const handleRefreshUsers = () => {
  console.log('Refresh users')
  // Reload data from API
}

const handleExportUsers = (selectedUsers: any[]) => {
  console.log('Export users:', selectedUsers)
  // Export logic here
}

const handleSearchUsers = (query: string) => {
  console.log('Search users:', query)
  // Search logic here
}

const handleFilterUsers = (filters: Record<string, any>) => {
  console.log('Filter users:', filters)
  // Filter logic here
}

const handleSelectUsers = (selectedUsers: any[]) => {
  console.log('Selected users:', selectedUsers)
  // Handle selection
}

const handleUserAction = (action: string, user: any, index: number) => {
  console.log('User action:', action, user, index)

  switch (action) {
    case 'view':
      navigateTo(`/admin/users/${user.id}`)
      break
    case 'edit':
      navigateTo(`/admin/users/${user.id}/edit`)
      break
    case 'delete':
      // Show confirmation modal
      break
  }
}
</script>


<template>
  <div class="p-6">
    <BaseTable
        :data="users"
        :columns="userColumns"
        :loading="loading"
        :filters="userFilters"
        :bulk-actions="userBulkActions"
        :row-actions="getUserRowActions"
        title="Checkers"
        description="Manage and organize your team members"
        create-button="Add Checker"
        search-placeholder="Search users by name or email..."
        search-key="name"
        empty-title="No Checker found"
        empty-description="Get started by creating your first user"
        @create="handleCreateUser"
        @refresh="handleRefreshUsers"
        @export="handleExportUsers"
        @search="handleSearchUsers"
        @filter="handleFilterUsers"
        @select="handleSelectUsers"
        @action="handleUserAction"
    >
      <!-- Custom filter slot -->
      <template #filters="{ updateFilter }">
        <USelectMenu
            :model-value="statusFilter"
            :items="statusOptions"
            placeholder="Filter by status"
            @update:model-value="updateFilter('status', $event)"
        />
        <USelectMenu
            :model-value="roleFilter"
            :items="roleOptions"
            placeholder="Filter by role"
            @update:model-value="updateFilter('role', $event)"
        />
        <USelectMenu
            :model-value="departmentFilter"
            :items="departmentOptions"
            placeholder="Filter by department"
            @update:model-value="updateFilter('department', $event)"
        />
      </template>

      <!-- Custom name column with avatar -->
      <template #name-data="{ row }">
        <div class="flex items-center space-x-3">
          <UAvatar
              :src="row.avatar"
              :alt="row.name"
              size="sm"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ row.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ row.email }}</p>
          </div>
        </div>
      </template>

      <!-- Custom status column -->
      <template #status-data="{ row }">
        <UBadge
            :color="getStatusColor(row.status)"
            variant="soft"
        >
          {{ row.status }}
        </UBadge>
      </template>

      <!-- Custom last login column -->
      <!--        <template #lastLogin-data="{ row }">-->
      <!--          <div class="text-sm">-->
      <!--            <p class="text-gray-900 dark:text-white">{{ formatDate(row.lastLogin) }}</p>-->
      <!--            <p class="text-gray-500 dark:text-gray-400">{{ getTimeAgo(row.lastLogin) }}</p>-->
      <!--          </div>-->
      <!--        </template>-->
    </BaseTable>
  </div>
</template>

<style scoped></style>
