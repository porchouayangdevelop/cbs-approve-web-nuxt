<template>
  <div class="space-y-4">
    <!-- Table Header with Search and Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex-1">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ description }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2">
        <slot name="actions" :selected="selectedItems">
          <UButton
              v-if="showRefresh"
              variant="ghost"
              size="sm"
              icon="i-heroicons-arrow-path"
              @click="handleRefresh"
              :loading="refreshing"
          >
            Refresh
          </UButton>
          <UButton
              v-if="showExport"
              variant="outline"
              size="sm"
              icon="i-heroicons-arrow-down-tray"
              @click="handleExport"
          >
            Export
          </UButton>
          <UButton
              v-if="createButton"
              icon="i-heroicons-plus"
              size="sm"
              @click="$emit('create')"
              class="cursor-pointer"
          >
            {{ createButton }}
          </UButton>
        </slot>
      </div>
    </div>

    <!-- Search and Filters -->
    <UCard v-if="showSearch || showFilters || $slots.filters">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Search -->
        <div v-if="showSearch" :class="searchColSpan">
          <UInput
              v-model="localSearch"
              :placeholder="searchPlaceholder"
              icon="i-heroicons-magnifying-glass"
              size="md"
              @input="handleSearch"
          />
        </div>

        <!-- Filters Slot -->
        <div v-if="$slots.filters" :class="filtersColSpan">
          <slot name="filters" :filters="localFilters" :updateFilter="updateFilter" />
        </div>

        <!-- Default Filters -->
        <template v-if="showFilters && filters.length > 0">
          <div
              v-for="filter in filters"
              :key="filter.key"
              class="md:col-span-3"
          >
            <USelectMenu
                v-if="filter.type === 'select'"
                v-model="localFilters[filter.key]"
                :options="filter.options"
                :placeholder="filter.placeholder"
                size="md"
                @change="handleFilterChange"
            />
            <UInput
                v-else-if="filter.type === 'input'"
                v-model="localFilters[filter.key]"
                :placeholder="filter.placeholder"
                size="md"
                @input="handleFilterChange"
            />
            <UInput
                v-else-if="filter.type === 'date'"
                v-model="localFilters[filter.key]"
                type="date"
                :placeholder="filter.placeholder"
                size="md"
                @change="handleFilterChange"
            />
          </div>
        </template>
      </div>
    </UCard>

    <!-- Table Card -->
    <UCard>
      <!-- Table Header with Bulk Actions -->
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalText }}
            </span>

            <!-- Bulk Actions -->
            <div v-if="selectedItems.length > 0 && bulkActions.length > 0" class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedItems.length }} selected
              </span>
              <UDropdownMenu :items="bulkActionItems">
                <UButton variant="outline" size="xs" icon="i-heroicons-ellipsis-horizontal">
                  Actions
                </UButton>
              </UDropdownMenu>
            </div>
          </div>

          <!-- Table Controls -->
          <div class="flex items-center space-x-2">
            <UButton
                v-if="showColumnToggle"
                variant="ghost"
                size="sm"
                icon="i-heroicons-view-columns"
                @click="showColumnModal = true"
            >
              Columns
            </UButton>
            <USelectMenu
                v-if="showPageSize"
                v-model="pageSize"
                :options="pageSizeOptions"
                size="sm"
            />
          </div>
        </div>
      </template>

<!--      {{paginatedData}}-->

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">{{ loadingText }}</p>
        </div>
      </div>


      <!-- Empty State -->
      <div v-else-if="paginatedData.length === 0" class="text-center py-12">
        <slot name="empty">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ emptyTitle }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ emptyDescription }}
          </p>
          <UButton
              v-if="createButton && !loading"
              @click="$emit('create')"
              class="cursor-pointer"
          >
            {{ createButton }}
          </UButton>
        </slot>
      </div>


      <!-- Table -->
      <UTable
          v-else
          :rows="paginatedData"
          :columns="visibleColumns"
          :loading="loading"
          loadingColor="info"
          v-model="selectedItems"
          @selected="handleSelect"
          class="w-full"
      >
        <!-- Dynamic Slots -->
        <template v-for="column in visibleColumns" :key="column.key" #[`${column.key}-data`]="{ row, index }">
          <slot
              :name="`${column.key}-data`"
              :row="row"
              :index="index"
              :value="getNestedValue(row, column.key)"
          >
            <!-- Default rendering based on column type -->
            <div v-if="column.type === 'avatar'" class="flex items-center space-x-3">
              <UAvatar
                  :src="getNestedValue(row, column.key)"
                  :alt="getNestedValue(row, column.nameKey || 'name')"
                  size="sm"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ getNestedValue(row, column.nameKey || 'name') }}
                </p>
                <p v-if="column.subKey" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getNestedValue(row, column.subKey) }}
                </p>
              </div>
            </div>

            <UBadge
                v-else-if="column.type === 'badge'"
                :color="getBadgeColor(getNestedValue(row, column.key), column.colorMap)"
                :variant="column.variant || 'soft'"
            >
              {{ formatValue(getNestedValue(row, column.key), column) }}
            </UBadge>

            <div v-else-if="column.type === 'date'" class="text-sm">
              <p class="text-gray-900 dark:text-white">
                {{ formatDate(getNestedValue(row, column.key), column.dateFormat) }}
              </p>
              <p v-if="column.showRelative" class="text-gray-500 dark:text-gray-400">
                {{ getTimeAgo(getNestedValue(row, column.key)) }}
              </p>
            </div>

            <UDropdownMenu
                v-else-if="column.type === 'actions'"
                :items="getRowActions(row, index)"
            >
              <UButton
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-ellipsis-horizontal"
              />
            </UDropdownMenu>

            <!-- Default text rendering -->
            <span v-else>
              {{ formatValue(getNestedValue(row, column.key), column) }}
            </span>
          </slot>
        </template>
      </UTable>

      <!-- Pagination -->
      <template #footer v-if="showPagination && totalItems > pageSize">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ ((currentPage - 1) * pageSize) + 1 }} to
            {{ Math.min(currentPage * pageSize, totalItems) }} of {{ totalItems }} results
          </div>
          <UPagination
              v-model="currentPage"
              :page-count="pageSize"
              :total="totalItems"
              :max="maxPaginationButtons"
          />
        </div>
      </template>
    </UCard>

    <!-- Column Toggle Modal -->
  </div>
</template>

<script setup lang="ts">
interface TableColumn {
  key: string
  label: string
  type?: 'text' | 'badge' | 'date' | 'avatar' | 'actions'
  sortable?: boolean
  required?: boolean
  width?: string
  // Badge specific
  colorMap?: Record<string, string>
  variant?: string
  // Date specific
  dateFormat?: string
  showRelative?: boolean
  // Avatar specific
  nameKey?: string
  subKey?: string
  // Formatting
  formatter?: (value: any) => string
  prefix?: string
  suffix?: string
}

interface TableFilter {
  key: string
  type: 'select' | 'input' | 'date'
  placeholder: string
  options?: any[]
}

interface BulkAction {
  label: string
  icon: string
  action: (selectedItems: any[]) => void
  color?: string
  disabled?: boolean
}

interface Props {
  // Data
  data: any[]
  columns: TableColumn[]
  loading?: boolean

  // Table configuration
  title?: string
  description?: string
  selectable?: boolean

  // Search and filters
  showSearch?: boolean
  searchPlaceholder?: string
  searchKey?: string
  showFilters?: boolean
  filters?: TableFilter[]

  // Pagination
  showPagination?: boolean
  pageSize?: number
  maxPaginationButtons?: number

  // Actions
  createButton?: string
  showRefresh?: boolean
  showExport?: boolean
  showColumnToggle?: boolean
  showPageSize?: boolean
  bulkActions?: BulkAction[]
  rowActions?: (row: any, index: number) => any[]

  // Empty state
  emptyTitle?: string
  emptyDescription?: string
  loadingText?: string

  // Layout
  searchColSpan?: string
  filtersColSpan?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectable: true,
  showSearch: true,
  searchPlaceholder: 'Search...',
  searchKey: 'name',
  showFilters: false,
  showPagination: true,
  pageSize: 10,
  maxPaginationButtons: 7,
  showRefresh: true,
  showExport: true,
  showColumnToggle: true,
  showPageSize: true,
  emptyTitle: 'No data found',
  emptyDescription: 'Try adjusting your search or filter criteria',
  loadingText: 'Loading...',
  searchColSpan: 'md:col-span-6',
  filtersColSpan: 'md:col-span-6',
  bulkActions: () => [],
  filters: () => [],
  rowActions: () => () => []
})

const emit = defineEmits<{
  create: []
  refresh: []
  export: [selectedItems: any[]]
  search: [query: string]
  filter: [filters: Record<string, any>]
  select: [selectedItems: any[]]
  action: [action: string, row: any, index: number]
}>()

// State
const currentPage = ref(1)
const pageSize = ref(props.pageSize)
const localSearch = ref('')
const localFilters = ref<Record<string, any>>({})
const selectedItems = ref<any[]>([])
const refreshing = ref(false)
const showColumnModal = ref(false)

// Column visibility
const columnVisibility = ref<Record<string, boolean>>({})

// Initialize column visibility
const initializeColumnVisibility = () => {
  props.columns.forEach(column => {
    columnVisibility.value[column.key] = true
  })
}

onMounted(() => {
  initializeColumnVisibility()
})

// Computed
const filteredData = computed(() => {
  let result = [...props.data]

  // Apply search
  if (localSearch.value) {
    const query = localSearch.value.toLowerCase()
    result = result.filter(item => {
      if (props.searchKey) {
        return getNestedValue(item, props.searchKey)?.toString().toLowerCase().includes(query)
      }
      // Search all string fields
      return Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(query)
      )
    })
  }

  // Apply filters
  Object.entries(localFilters.value).forEach(([key, value]) => {
    if (value && value !== '') {
      result = result.filter(item => {
        const itemValue = getNestedValue(item, key)
        return itemValue?.toString().toLowerCase().includes(value.toString().toLowerCase())
      })
    }
  })

  return result
})

const paginatedData = computed(() => {
  if (!props.showPagination) return filteredData.value

  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const totalItems = computed(() => filteredData.value.length)

const totalText = computed(() => {
  const total = totalItems.value
  const showing = paginatedData.value.length

  if (total === 0) return 'No results'
  if (total === showing) return `${total} result${total !== 1 ? 's' : ''}`
  return `Showing ${showing} of ${total} results`
})

const visibleColumns = computed(() => {
  return props.columns.filter(column => columnVisibility.value[column.key])
})

const pageSizeOptions = computed(() => [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
])

const bulkActionItems = computed(() => {
  return props.bulkActions.map(action => ({
    label: action.label,
    icon: action.icon,
    click: () => action.action(selectedItems.value),
    disabled: action.disabled
  }))
})

// Methods
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const formatValue = (value: any, column: TableColumn) => {
  if (value == null) return '-'

  if (column.formatter) return column.formatter(value)

  let formatted = value.toString()
  if (column.prefix) formatted = column.prefix + formatted
  if (column.suffix) formatted = formatted + column.suffix

  return formatted
}

const getBadgeColor = (value: any, colorMap?: Record<string, string>) => {
  if (!colorMap) return 'gray'
  return colorMap[value] || 'gray'
}

const formatDate = (date: string | Date, format?: string) => {
  if (!date) return '-'
  const d = new Date(date)
  if (format === 'relative') return getTimeAgo(date)
  return d.toLocaleDateString()
}

const getTimeAgo = (date: string | Date) => {
  if (!date) return '-'
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

const getRowActions = (row: any, index: number) => {
  return props.rowActions(row, index)
}

const handleSearch = () => {
  currentPage.value = 1
  emit('search', localSearch.value)
}

const handleFilterChange = () => {
  currentPage.value = 1
  emit('filter', localFilters.value)
}

const updateFilter = (key: string, value: any) => {
  localFilters.value[key] = value
  handleFilterChange()
}

const handleSelect = (selected: any[]) => {
  selectedItems.value = selected
  emit('select', selected)
}

const handleRefresh = async () => {
  refreshing.value = true
  try {
    emit('refresh')
    await nextTick()
  } finally {
    refreshing.value = false
  }
}

const handleExport = () => {
  emit('export', selectedItems.value.length > 0 ? selectedItems.value : filteredData.value)
}

const resetColumns = () => {
  initializeColumnVisibility()
}

// Watch page size changes
watch(() => pageSize.value, () => {
  currentPage.value = 1
})
</script>