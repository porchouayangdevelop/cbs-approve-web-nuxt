<script setup lang="ts">
import {useSystemUserStore} from "~/store/systemUserStore";

definePageMeta({
  layout: 'admin-session',
  middleware: ['auth-guard', 'admin-guard']
})

const router = useRouter()

import type {User} from '~/store/systemUserStore'

const {getUsers, users} = useSystemUserStore();

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


const userData = computed(() => {
  return users.map(user => ({
    // id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    enabled: user.enabled ? 'Active' : 'Inactive',
    // emailVerified: user.emailVerified ? 'Yes' : 'No',
    // role: user.role || 'User',
    // lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A',
    createdAt: user.createTimestamp
  }))
})


// Table columns
const columns = [
  {key: 'name', label: 'User'},
  {key: 'lastName', label: 'Lastname'},
  {key: 'email', label: 'Email'},
  {key: 'enabled', label: 'Status'},
  {key: 'actions', label: 'Actions'}
]

// Filter options
const roleOptions = ['All Roles', 'Admin', 'Manager', 'User']
const statusOptions = ['All Status', 'active', 'inactive', 'pending']
const departmentOptions = ['All Departments', 'Engineering', 'Product', 'Sales', 'Marketing']
const sortOptions = [
  {label: 'FirstName', value: 'firstName'},
  {label: 'Email', value: 'email'},
  {label: 'Status', value: 'enabled'},
]

// Computed
const filteredUsers = computed(() => {
  let filtered = userData.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }

  // Role filter
  if (selectedRole.value && selectedRole.value !== 'All Roles') {
    filtered = filtered.filter(user => user.firstName === selectedRole.value)
  }

  // // Status filter
  // if (selectedStatus.value && selectedStatus.value !== 'All Status') {
  //   filtered = filtered.filter(user => user.status === selectedStatus.value)
  // }
  //
  // // Department filter
  // if (selectedDepartment.value && selectedDepartment.value !== 'All Departments') {
  //   filtered = filtered.filter(user => user.department === selectedDepartment.value)
  // }

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


const getActiveColor = (active: any) => {
  const colors: Record<string, string> = {
    true: 'green',
    false: 'red'
  }
  return colors[active]
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

const createUser = () => {
  router.push({path: '/admin/users/create'});
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

onMounted(() => {
  // Fetch initial users
  getUsers()
})

</script>

<template>
  <div class="p-6 space-y-6">
    {{ userData }}
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
            :items="roleOptions"
            placeholder="Filter by role"
            size="lg"
        />

        <!-- Status Filter -->
        <USelectMenu
            v-model="selectedStatus"
            :items="statusOptions"
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
              :items="departmentOptions"
              placeholder="Department"
          />
          <UInput
              v-model="emailFilter"
              placeholder="Filter by email domain"
              icon="i-heroicons-envelope"
          />
          <USelectMenu
              v-model="sortBy"
              :items="sortOptions"
              placeholder="Sort by"
          />
        </div>
      </div>

      <UTable
          :rows="paginatedUsers"
          :head="columns"
          :loading="loading"
          :data="userData"
          class="w-full"
      >
        <!-- User Avatar & Info -->
        <!--        <template #name-data="{ row }">-->
        <!--          <div class="flex items-center space-x-3">-->
        <!--            <UAvatar-->
        <!--                :src="row.avatar"-->
        <!--                :alt="row.name"-->
        <!--                size="sm"-->
        <!--            />-->
        <!--            <div>-->
        <!--              <p class="font-medium text-gray-900 dark:text-white">{{ row.name }}</p>-->
        <!--              <p class="text-sm text-gray-500 dark:text-gray-400">{{ row.email }}</p>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </template>-->

        <!-- Role Badge -->
<!--                <template #role-data="{ row }">-->
<!--                  <UBadge-->
<!--                      :color="getActiveColor(row.enabled)"-->
<!--                      variant="soft"-->
<!--                  >-->
<!--                  </UBadge>-->
<!--                </template>-->

        <!-- Status Badge -->
        <!--        <template #status-data="{ row }">-->
        <!--          <UBadge-->
        <!--              :color="row.status === 'active' ? 'green' : row.status === 'inactive' ? 'red' : 'yellow'"-->
        <!--              variant="soft"-->
        <!--          >-->
        <!--            {{ row.status }}-->
        <!--          </UBadge>-->
        <!--        </template>-->

        <!-- Last Login -->
        <template #lastLogin-data="{ row }">
          <div class="text-sm">
            {{ row }}
            <!--            <p class="text-gray-900 dark:text-white">{{ formatDate(row.lastLogin) }}</p>-->
            <!--            <p class="text-gray-500 dark:text-gray-400">{{ getTimeAgo(row.lastLogin) }}</p>-->
          </div>
        </template>

        <!-- Actions -->
        <template #actions-data="{ row }">
          <!--          <UDropdownMenu :items="getActionItems(row)">-->
          <!--            <UButton variant="ghost" size="sm" icon="i-heroicons-ellipsis-horizontal"/>-->
          <!--          </UDropdownMenu>-->
        </template>
      </UTable>

      <!-- Pagination -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ ((currentPage - 1) * pageSize) + 1 }} to
            {{ Math.min(currentPage * pageSize, filteredUsers.length) }} of {{ filteredUsers.length }} users
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
          <UButton size="sm" variant="outline" color="error" @click="bulkDelete">
            Delete
          </UButton>
          <UButton size="sm" variant="ghost" @click="clearSelection">
            Clear
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped></style>
