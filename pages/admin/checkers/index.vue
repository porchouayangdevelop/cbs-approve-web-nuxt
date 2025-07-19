<script setup lang="ts">
import {useSystemUserStore} from "~/store/systemUserStore";
import BaseTable from "~/components/common/BaseTable.vue";

definePageMeta({
  layout: 'admin-session',
  middleware: ['auth-guard', 'admin-guard']
})

const router = useRouter()
const toast = useToast()

import type {User} from '~/store/systemUserStore'

// Get store instance and reactive data
const systemUserStore = useSystemUserStore();
const { users, loading, error } = storeToRefs(systemUserStore);
const { getUsers } = systemUserStore;

// State
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const selectedDepartment = ref('')
const emailFilter = ref('')
const sortBy = ref('firstName')
const showAdvancedFilters = ref(false)
const currentPage = ref(1)
const pageSize = 10
const selectedUsers = ref<User[]>([])

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref<User | null>(null)

// Transform users data for table display
const userData = computed(() => {
  if (!users.value || users.value.length === 0) {
    return []
  }

  return users.value.map(user => ({
    id: user.id,
    name: user.firstName, // Using firstName as name for table
    lastName: user.lastName,
    email: user.email,
    status: user.enabled ? 'Active' : 'Inactive',
    enabled: user.enabled,
    emailVerified: user.emailVerified ? 'Yes' : 'No',
    createdAt: user.createTimestamp ? new Date(user.createTimestamp).toLocaleDateString() : 'N/A',
    role: user.role || 'User'
  }))
})

// Table configuration
const userColumns = [
  {
    key: 'name',
    label: 'First Name',
    type: 'text',
    sortable: true,
    required: true
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    colorMap: {
      'Active': 'green',
      'Inactive': 'red',
      'Pending': 'yellow'
    }
  },
  {
    key: 'createdAt',
    label: 'Created',
    type: 'text'
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
    options: ['Active', 'Inactive', 'Pending']
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
      toast.add({
        title: 'Users activated',
        description: `${selectedUsers.length} users have been activated`,
        color: 'success'
      })
    }
  },
  {
    label: 'Deactivate Users',
    icon: 'i-heroicons-x-circle',
    action: (selectedUsers: any[]) => {
      console.log('Deactivating users:', selectedUsers)
      toast.add({
        title: 'Users deactivated',
        description: `${selectedUsers.length} users have been deactivated`,
        color: 'warning'
      })
    }
  },
  {
    label: 'Delete Users',
    icon: 'i-heroicons-trash',
    action: (selectedUsers: any[]) => {
      console.log('Deleting users:', selectedUsers)
      toast.add({
        title: 'Users deleted',
        description: `${selectedUsers.length} users have been deleted`,
        color: 'error'
      })
    }
  }
]

// Filter options
const statusOptions = ['All Status', 'Active', 'Inactive', 'Pending']
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

// Event handlers
const handleCreateUser = () => {
  console.log('Create user clicked')
  router.push('/admin/users/create')
}

const handleRefreshUsers = async () => {
  console.log('Refresh users')
  try {
    await getUsers()
    toast.add({
      title: 'Users refreshed',
      description: 'User list has been updated',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Refresh failed',
      description: 'Failed to refresh user list',
      color: 'error'
    })
  }
}

const handleExportUsers = (selectedUsers: any[]) => {
  console.log('Export users:', selectedUsers)
  const dataToExport = selectedUsers.length > 0 ? selectedUsers : userData.value

  // Create CSV content
  const headers = ['Name', 'Last Name', 'Email', 'Status', 'Created At']
  const csvContent = [
    headers.join(','),
    ...dataToExport.map(user => [
      user.name,
      user.lastName,
      user.email,
      user.status,
      user.createdAt
    ].join(','))
  ].join('\n')

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)

  toast.add({
    title: 'Export completed',
    description: `Exported ${dataToExport.length} users`,
    color: 'success'
  })
}

const handleSearchUsers = (query: string) => {
  console.log('Search users:', query)
  searchQuery.value = query
}

const handleFilterUsers = (filters: Record<string, any>) => {
  console.log('Filter users:', filters)
  // Apply filters to local state
  Object.keys(filters).forEach(key => {
    switch (key) {
      case 'status':
        selectedStatus.value = filters[key]
        break
      case 'role':
        selectedRole.value = filters[key]
        break
      case 'department':
        selectedDepartment.value = filters[key]
        break
    }
  })
}

const handleSelectUsers = (selectedUsers: any[]) => {
  console.log('Selected users:', selectedUsers)
  // Handle user selection
}

const handleUserAction = (action: string, user: any, index: number) => {
  console.log('User action:', action, user, index)

  switch (action) {
    case 'view':
      router.push(`/admin/users/${user.id}`)
      break
    case 'edit':
      router.push(`/admin/users/${user.id}/edit`)
      break
    case 'delete':
      selectedUser.value = user
      showDeleteModal.value = true
      break
  }
}

// Load users on component mount
onMounted(async () => {
  console.log('Component mounted, loading users...')
  try {
    await getUsers()
    console.log('Users loaded:', users.value?.length || 0)
  } catch (error) {
    console.error('Failed to load users:', error)
    toast.add({
      title: 'Load failed',
      description: 'Failed to load users',
      color: 'error'
    })
  }
})

// Debug watchers
watch(users, (newUsers) => {
  console.log('Users changed:', newUsers?.length || 0)
}, { immediate: true })

watch(userData, (newData) => {
  console.log('UserData changed:', newData?.length || 0)
}, { immediate: true })

// SEO
useSeoMeta({
  title: 'User Management - Admin',
  description: 'Manage system users, roles and permissions'
})
</script>

<template>
  <div class="p-6">
    <!-- Debug information (remove in production) -->
    <div v-if="$nuxt.$dev" class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 class="font-bold mb-2">Debug Info:</h3>
      <p>Loading: {{ loading }}</p>
      <p>Error: {{ error }}</p>
      <p>Raw users count: {{ users?.length || 0 }}</p>
      <p>Transformed userData count: {{ userData?.length || 0 }}</p>
      <details class="mt-2">
        <summary class="cursor-pointer">Raw Users Data</summary>
        <pre class="text-xs mt-2 overflow-auto">{{ users }}</pre>
      </details>
      <details class="mt-2">
        <summary class="cursor-pointer">Transformed UserData</summary>
        <pre class="text-xs mt-2 overflow-auto">{{ userData }}</pre>
      </details>
    </div>

    <!-- Loading State -->
    <div v-if="loading && (!users || users.length === 0)" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load users</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <UButton @click="handleRefreshUsers" :loading="loading">
        Try Again
      </UButton>
    </div>

    <!-- Main Content -->
    <div v-else>
      <BaseTable
          :data="userData"
          :columns="userColumns"
          :loading="loading"
          :filters="userFilters"
          :bulk-actions="userBulkActions"
          :row-actions="getUserRowActions"
          title="System Users"
          description="Manage and organize system users"
          create-button="Add User"
          search-placeholder="Search users by name or email..."
          search-key="name"
          empty-title="No users found"
          empty-description="Get started by creating your first user"
          @create="handleCreateUser"
          @refresh="handleRefreshUsers"
          @export="handleExportUsers"
          @search="handleSearchUsers"
          @filter="handleFilterUsers"
          @select="handleSelectUsers"
          @action="handleUserAction"
      >
        <!-- Custom name column with better formatting -->
        <template #name-data="{ row }">
          <div class="flex items-center space-x-3">
            <UAvatar
                :alt="`${row.name} ${row.lastName}`"
                size="sm"
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name + ' ' + row.lastName)}`"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ row.name }} {{ row.lastName }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ row.email }}</p>
            </div>
          </div>
        </template>

        <!-- Custom status column -->
        <template #status-data="{ row }">
          <UBadge
              :color="row.status === 'Active' ? 'green' : 'red'"
              variant="soft"
          >
            {{ row.status }}
          </UBadge>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>