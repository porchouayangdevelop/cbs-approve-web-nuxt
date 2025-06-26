<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage and organize your team members</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <UButton
            icon="i-heroicons-arrow-down-tray"
            variant="outline"
            @click="exportUsers"
            class="cursor-pointer"
        >
          Export
        </UButton>
        <UButton
            icon="i-heroicons-plus"
            @click="createUser"
            class="cursor-pointer"
        >
          Add User
        </UButton>
      </div>
    </div>

    <!-- Filters & Search -->
    <UCard>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <UInput
              v-model="searchQuery"
              placeholder="Search users..."
              icon="i-heroicons-magnifying-glass"
              size="lg"
          />
        </div>

        <!-- Role Filter -->
        <USelectMenu
            v-model="selectedRole"
            :options="roleOptions"
            placeholder="Filter by role"
            size="lg"
        />

        <!-- Status Filter -->
        <USelectMenu
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="Filter by status"
            size="lg"
        />
      </div>
    </UCard>

    <!-- Users Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Users ({{ filteredUsers.length }})
          </h3>
          <div class="flex items-center space-x-2">
            <UButton
                variant="ghost"
                size="sm"
                icon="i-heroicons-funnel"
                @click="showAdvancedFilters = !showAdvancedFilters"
            >
              Advanced Filters
            </UButton>
            <UButton
                variant="ghost"
                size="sm"
                icon="i-heroicons-arrow-path"
                @click="refreshUsers"
                :loading="loading"
            >
              Refresh
            </UButton>
          </div>
        </div>
      </template>

      <!-- Advanced Filters (Collapsible) -->
      <div v-show="showAdvancedFilters" class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <USelectMenu
              v-model="selectedDepartment"
              :options="departmentOptions"
              placeholder="Department"
          />
          <UInput
              v-model="emailFilter"
              placeholder="Filter by email domain"
              icon="i-heroicons-envelope"
          />
          <USelectMenu
              v-model="sortBy"
              :options="sortOptions"
              placeholder="Sort by"
          />
        </div>
      </div>

      <UTable
          :rows="paginatedUsers"
          :head="columns"
          :loading="loading"
          :data="users"
          class="w-full"
      >
        <!-- User Avatar & Info -->
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

        <!-- Role Badge -->
        <template #role-data="{ row }">
          <UBadge
              :color="getRoleColor(row.role)"
              variant="soft"
          >
            {{ row.role }}
          </UBadge>
        </template>

        <!-- Status Badge -->
        <template #status-data="{ row }">
          <UBadge
              :color="row.status === 'active' ? 'green' : row.status === 'inactive' ? 'red' : 'yellow'"
              variant="soft"
          >
            {{ row.status }}
          </UBadge>
        </template>

        <!-- Last Login -->
        <template #lastLogin-data="{ row }">
          <div class="text-sm">
            <p class="text-gray-900 dark:text-white">{{ formatDate(row.lastLogin) }}</p>
            <p class="text-gray-500 dark:text-gray-400">{{ getTimeAgo(row.lastLogin) }}</p>
          </div>
        </template>

        <!-- Actions -->
        <template #actions-data="{ row }">
          <UDropdown :items="getActionItems(row)">
            <UButton variant="ghost" size="sm" icon="i-heroicons-ellipsis-horizontal" />
          </UDropdown>
        </template>
      </UTable>

      <!-- Pagination -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, filteredUsers.length) }} of {{ filteredUsers.length }} users
          </div>
          <UPagination
              v-model="currentPage"
              :page-count="pageSize"
              :total="filteredUsers.length"
          />
        </div>
      </template>
    </UCard>

    <!-- Bulk Actions (when users are selected) -->
    <div v-if="selectedUsers.length > 0" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <UCard class="shadow-lg">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium">{{ selectedUsers.length }} users selected</span>
          <UButton size="sm" variant="outline" @click="bulkEdit">
            Edit
          </UButton>
          <UButton size="sm" variant="outline" color="red" @click="bulkDelete">
            Delete
          </UButton>
          <UButton size="sm" variant="ghost" @click="clearSelection">
            Clear
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Modals -->
<!--    <UserCreateModal v-model="showCreateModal" @created="handleUserCreated" />-->
<!--    <UserEditModal v-model="showEditModal" :user="selectedUser" @updated="handleUserUpdated" />-->
<!--    <UModal v-model="showDeleteModal">-->
<!--      <UCard>-->
<!--        <template #header>-->
<!--          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>-->
<!--        </template>-->

<!--        <div class="space-y-4">-->
<!--          <p class="text-gray-600 dark:text-gray-400">-->
<!--            Are you sure you want to delete <strong>{{ selectedUser?.name }}</strong>? This action cannot be undone.-->
<!--          </p>-->

<!--          <div class="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">-->
<!--            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />-->
<!--            <span class="text-sm text-red-800 dark:text-red-200">This will permanently delete the user and all associated data.</span>-->
<!--          </div>-->
<!--        </div>-->

<!--        <template #footer>-->
<!--          <div class="flex justify-end space-x-3">-->
<!--            <UButton variant="outline" @click="showDeleteModal = false">-->
<!--              Cancel-->
<!--            </UButton>-->
<!--            <UButton color="error" @click="confirmDelete" :loading="deleting">-->
<!--              Delete User-->
<!--            </UButton>-->
<!--          </div>-->
<!--        </template>-->
<!--      </UCard>-->
<!--    </UModal>-->
  </div>
</template>

<script setup lang="ts">
import UserCreateModal from "~/components/modals/UserCreateModal.vue";
import UserEditModal from "~/components/modals/UserEditModal.vue";

definePageMeta({
  layout: 'default',
})

const router = useRouter()

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  department: string
  avatar: string
  lastLogin: string
  createdAt: string
  phone?: string
  location?: string
}

// State
const loading = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const selectedDepartment = ref('')
const emailFilter = ref('')
const sortBy = ref('name')
const showAdvancedFilters = ref(false)
const currentPage = ref(1)
const pageSize = 10
const selectedUsers = ref<User[]>([])

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref<User | null>(null)

// Sample data
const users = ref<User[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    status: 'active',
    department: 'Engineering',
    avatar: 'https://avatars.githubusercontent.com/u/739984?v=4',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-01-15T10:30:00Z',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'Manager',
    status: 'active',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    lastLogin: '2024-01-14T15:45:00Z',
    createdAt: '2023-02-10T10:30:00Z',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'User',
    status: 'inactive',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    lastLogin: '2024-01-10T09:15:00Z',
    createdAt: '2023-03-20T10:30:00Z',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX'
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily.brown@company.com',
    role: 'User',
    status: 'pending',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastLogin: '2024-01-13T11:20:00Z',
    createdAt: '2023-04-05T10:30:00Z',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA'
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'david.chen@company.com',
    role: 'Admin',
    status: 'active',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastLogin: '2024-01-15T14:10:00Z',
    createdAt: '2023-01-30T10:30:00Z',
    phone: '+1 (555) 567-8901',
    location: 'Los Angeles, CA'
  }
])

// Table columns
const columns = [
  { key: 'name', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'status', label: 'Status' },
  { key: 'lastLogin', label: 'Last Login' },
  { key: 'actions', label: 'Actions' }
]

// Filter options
const roleOptions = ['All Roles', 'Admin', 'Manager', 'User']
const statusOptions = ['All Status', 'active', 'inactive', 'pending']
const departmentOptions = ['All Departments', 'Engineering', 'Product', 'Sales', 'Marketing']
const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Role', value: 'role' },
  { label: 'Last Login', value: 'lastLogin' },
  { label: 'Created Date', value: 'createdAt' }
]

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
    )
  }

  // Role filter
  if (selectedRole.value && selectedRole.value !== 'All Roles') {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  // Status filter
  if (selectedStatus.value && selectedStatus.value !== 'All Status') {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }

  // Department filter
  if (selectedDepartment.value && selectedDepartment.value !== 'All Departments') {
    filtered = filtered.filter(user => user.department === selectedDepartment.value)
  }

  // Email filter
  if (emailFilter.value) {
    filtered = filtered.filter(user => user.email.includes(emailFilter.value))
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[sortBy.value as keyof User]
    const bValue = b[sortBy.value as keyof User]
    return String(aValue).localeCompare(String(bValue))
  })

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredUsers.value.slice(start, end)
})

// Methods
const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    'Admin': 'red',
    'Manager': 'blue',
    'User': 'green'
  }
  return colors[role] || 'gray'
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
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

const getActionItems = (user: User) => [
  [{
    label: 'View Profile',
    icon: 'i-heroicons-eye',
    click: () => viewUser(user)
  }],
  [{
    label: 'Edit User',
    icon: 'i-heroicons-pencil-square',
    click: () => editUser(user)
  }],
  [{
    label: 'Delete User',
    icon: 'i-heroicons-trash',
    click: () => deleteUser(user)
  }]
]

// Actions
const viewUser = (user: User) => {
  navigateTo(`/admin/users/${user.id}`)
}

const editUser = (user: User) => {
  selectedUser.value = user
  showEditModal.value = true
}

const deleteUser = (user: User) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedUser.value) return

  deleting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove user from list
    users.value = users.value.filter(u => u.id !== selectedUser.value?.id)

    showDeleteModal.value = false
    selectedUser.value = null

    // Show success notification
    console.log('User deleted successfully')

  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    deleting.value = false
  }
}

const createUser = () => {
  // showCreateModal.value = true

  router.push({path:'/users/create'});

}

const exportUsers = () => {
  console.log('Exporting users...')
  // Implement export functionality
}

const refreshUsers = async () => {
  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Users refreshed')
  } catch (error) {
    console.error('Refresh error:', error)
  } finally {
    loading.value = false
  }
}

const bulkEdit = () => {
  console.log('Bulk edit:', selectedUsers.value)
}

const bulkDelete = () => {
  console.log('Bulk delete:', selectedUsers.value)
}

const clearSelection = () => {
  selectedUsers.value = []
}

const handleUserCreated = (user: User) => {
  users.value.unshift(user)
  showCreateModal.value = false
}

const handleUserUpdated = (updatedUser: User) => {
  const index = users.value.findIndex(u => u.id === updatedUser.id)
  if (index > -1) {
    users.value[index] = updatedUser
  }
  showEditModal.value = false
}

// SEO
useSeoMeta({
  title: 'User Management',
  description: 'Manage and organize your team members with comprehensive user management tools.'
})
</script>