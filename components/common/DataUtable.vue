<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div
      v-if="loading && (!data || data.length === 0)"
      class="flex items-center justify-center py-12"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ loadingMessage || "Loading data..." }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !loading" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 text-red-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ errorTitle || "Failed to load data" }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <UButton @click="handleRefresh" :loading="loading" v-if="showRefresh">
        Try Again
      </UButton>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-4" v-if="showHeader">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white" v-if="title">
            {{ title }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400" v-if="description">
            {{ description }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <UButton
            @click="handleRefresh"
            :loading="loading"
            size="sm"
            variant="outline"
            icon="i-heroicons-arrow-path"
            v-if="showRefresh"
            class="cursor-pointer"
          >
            Refresh
          </UButton>
          <UButton
            @click="handleCreate"
            :icon="createIcon"
            size="sm"
            class="cursor-pointer"
            v-if="showCreate"
          >
            {{ createButtonText }}
          </UButton>
        </div>
      </div>

      <!-- Table Container -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <!-- Search and Filters -->
        <div
          class="flex flex-col sm:flex-row gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700"
          v-if="showSearch || showFilters || filters.length > 0"
        >
          <!-- Search Input -->
          <div class="flex-1" v-if="showSearch">
            <UInput
              v-model="globalFilter"
              :placeholder="searchPlaceholder"
              class="max-w-sm"
              icon="i-heroicons-magnifying-glass"
              @input="handleSearch"
            />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-2" v-if="showFilters && filters.length > 0">
            <template v-for="filter in filters" :key="filter.key">
              <USelectMenu
                v-if="filter.type === 'select'"
                v-model="filterValues[filter.key]"
                :items="filter.options"
                :placeholder="filter.placeholder"
                class="w-48"
                @update:model-value="handleFilterChange"
              />
              <UInput
                v-else-if="filter.type === 'input'"
                v-model="filterValues[filter.key]"
                :placeholder="filter.placeholder"
                class="w-48"
                @input="handleFilterChange"
              />
            </template>
            
            <!-- Clear Filters Button -->
            <UButton
              v-if="hasActiveFilters"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark"
              @click="clearFilters"
            >
              Clear
            </UButton>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <UTable
            :columns="processedColumns"
            :data="displayedData"
            :loading="loading"
            v-model:column-pinning="columnPinning"
            ref="tableRef"
            :ui="tableUi"
          >
            <!-- Dynamic cell templates -->
            <template
              v-for="column in processedColumns"
              :key="column.accessorKey"
              #[`${column.accessorKey}-cell`]="{ row }"
            >
              <slot
                :name="`${column.accessorKey}-cell`"
                :row="row"
                :value="row.getValue(column.accessorKey)"
              >
                <!-- Badge Cell -->
                <div v-if="column.cellType === 'badge'">
                  <UBadge
                    :color="getBadgeColor(row.getValue(column.accessorKey), column.colorMap)"
                    variant="soft"
                  >
                    {{ row.getValue(column.accessorKey) }}
                  </UBadge>
                </div>

                <!-- Avatar Cell -->
                <div v-else-if="column.cellType === 'avatar'">
                  <div class="flex items-center space-x-3">
                    <UAvatar
                      :alt="row.getValue(column.accessorKey)"
                      size="sm"
                      :src="getAvatarUrl(row.original)"
                    />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ row.getValue(column.accessorKey) }}
                      </p>
                      <p
                        class="text-sm text-gray-500 dark:text-gray-400"
                        v-if="column.subField"
                      >
                        {{ row.getValue(column.subField) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Date Cell -->
                <div v-else-if="column.cellType === 'date'">
                  {{ formatDate(row.getValue(column.accessorKey)) }}
                </div>

                <!-- Actions Cell -->
                <div v-else-if="column.cellType === 'actions'">
                  <UDropdownMenu :items="getRowActions(row.original, row.index)">
                    <UButton
                      icon="i-heroicons-ellipsis-vertical"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      aria-label="Actions"
                    />
                  </UDropdownMenu>
                </div>

                <!-- Default Cell -->
                <div v-else>
                  {{ row.getValue(column.accessorKey) }}
                </div>
              </slot>
            </template>

            <!-- Custom header templates -->
            <template
              v-for="column in processedColumns"
              :key="`${column.accessorKey}-header`"
              #[`${column.accessorKey}-header`]="{ column: headerColumn }"
            >
              <slot
                :name="`${column.accessorKey}-header`"
                :column="headerColumn"
              >
                <UButton
                  v-if="column.sortable !== false"
                  variant="ghost"
                  size="sm"
                  :icon="getSortIcon(headerColumn)"
                  @click="handleSort(headerColumn)"
                  class="font-medium"
                >
                  {{ column.header }}
                </UButton>
                <span v-else class="font-medium">{{ column.header }}</span>
              </slot>
            </template>
          </UTable>
        </div>

        <!-- Table Footer with Pagination -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700"
          v-if="showPagination || showItemsPerPage || showExport"
        >
          <!-- Left side - Items per page and info -->
          <div class="flex items-center gap-4">
            <!-- Items per page selector -->
            <div class="flex items-center gap-2" v-if="showItemsPerPage">
              <span class="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <USelectMenu
                v-model="currentItemsPerPage"
                :items="itemsPerPageOptions"
                size="sm"
                class="w-20"
                @update:model-value="handleItemsPerPageChange"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">per page</span>
            </div>

            <!-- Results info -->
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} {{ itemName }}
            </p>
          </div>

          <!-- Right side - Export and Pagination -->
          <div class="flex items-center gap-4">
            <!-- Export button -->
            <UButton
              v-if="showExport"
              @click="handleExport"
              variant="outline"
              size="sm"
              icon="i-heroicons-arrow-down-tray"
              class="cursor-pointer"
            >
              Export
            </UButton>

            <!-- Pagination -->
            <UPagination
              v-if="showPagination && totalPages > 1"
              v-model="currentPage"
              :page-count="totalPages"
              :total="totalItems"
              size="sm"
              :max="7"
              :show-last="true"
              :show-first="true"
              @update:model-value="handlePageChange"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="!loading && filteredData.length === 0"
          class="text-center py-12"
        >
          <UIcon
            :name="emptyIcon"
            class="w-12 h-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ emptyTitle }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ hasActiveFilters ? "Try adjusting your filters" : emptyDescription }}
          </p>
          <UButton
            @click="handleCreate"
            :icon="createIcon"
            class="cursor-pointer"
            v-if="showCreate && !hasActiveFilters"
          >
            {{ createButtonText }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";

// Define interfaces
interface ColumnConfig {
  accessorKey: string;
  header: string | ((column: any) => any);
  cellType?: "text" | "badge" | "avatar" | "date" | "actions" | "custom";
  colorMap?: Record<string, string>;
  subField?: string;
  sortable?: boolean;
}

interface FilterConfig {
  key: string;
  type: "select" | "input";
  placeholder: string;
  options?: string[] | { label: string; value: any }[];
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface Props {
  // Data props
  data: any[];
  columns: ColumnConfig[];
  loading?: boolean;
  error?: string | null;

  // Display props
  title?: string;
  description?: string;
  loadingMessage?: string;
  errorTitle?: string;
  itemName?: string;

  // Feature toggles
  showHeader?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  showCreate?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  showPagination?: boolean;
  showItemsPerPage?: boolean;

  // Search and filter props
  searchPlaceholder?: string;
  searchKeys?: string[]; // Multiple fields to search in
  filters?: FilterConfig[];

  // Pagination props
  itemsPerPage?: number;
  itemsPerPageOptions?: number[];

  // Create button props
  createButtonText?: string;
  createIcon?: string;

  // Empty state props
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;

  // Row actions
  rowActions?: (row: any, index: number) => DropdownMenuItem[][];

  // Table UI customization
  tableUi?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  title: "",
  description: "",
  loadingMessage: "Loading data...",
  errorTitle: "Failed to load data",
  itemName: "items",

  showHeader: true,
  showSearch: true,
  showFilters: true,
  showCreate: false,
  showRefresh: true,
  showExport: true,
  showPagination: true,
  showItemsPerPage: true,

  searchPlaceholder: "Search...",
  searchKeys: () => [],
  filters: () => [],

  itemsPerPage: 10,
  itemsPerPageOptions: () => [5, 10, 20, 50, 100],

  createButtonText: "Create New",
  createIcon: "i-heroicons-plus",

  emptyTitle: "No data found",
  emptyDescription: "Get started by creating your first item",
  emptyIcon: "i-heroicons-folder-open",

  rowActions: () => () => [],

  tableUi: () => ({
    th: "py-2 px-3",
    td: "py-[.1rem] px-3 border-b border-gray-200 dark:border-gray-700",
  }),
});

// Emits
const emit = defineEmits<{
  create: [];
  refresh: [];
  export: [data: any[]];
  action: [action: string, row: any, index: number];
  "update:itemsPerPage": [value: number];
  "update:currentPage": [value: number];
  "update:filters": [filters: Record<string, any>];
  "update:search": [query: string];
  "update:sort": [sort: SortConfig | null];
}>();

// Refs
const tableRef = useTemplateRef("tableRef");
const globalFilter = ref("");
const filterValues = ref<Record<string, any>>({});
const currentPage = ref(1);
const currentItemsPerPage = ref(props.itemsPerPage);
const sortConfig = ref<SortConfig | null>(null);
const columnPinning = ref({ left: [], right: [] });

// Initialize filter values
onMounted(() => {
  props.filters.forEach((filter) => {
    if (!(filter.key in filterValues.value)) {
      filterValues.value[filter.key] = "";
    }
  });
});

// Computed properties
const processedColumns = computed(() => {
  return props.columns.map((col) => {
    const column: TableColumn<any> = {
      accessorKey: col.accessorKey,
      header: typeof col.header === "string" ? col.header : col.header,
      cell: ({ row }) => row.getValue(col.accessorKey),
    };

    // Add cellType for template selection
    if (col.cellType) {
      column.cellType = col.cellType;
      column.colorMap = col.colorMap;
      column.subField = col.subField;
    }

    // Add sortable property
    column.sortable = col.sortable !== false;

    return column;
  });
});

const filteredData = computed(() => {
  let filtered = [...props.data];

  // Apply global search
  if (globalFilter.value) {
    const query = globalFilter.value.toLowerCase();
    filtered = filtered.filter((item) => {
      if (props.searchKeys.length > 0) {
        // Search in specific keys
        return props.searchKeys.some((key) => {
          const value = key.split(".").reduce((obj, k) => obj?.[k], item);
          return String(value || "").toLowerCase().includes(query);
        });
      } else {
        // Search across all string fields
        return Object.values(item).some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      }
    });
  }

  // Apply filters
  Object.entries(filterValues.value).forEach(([key, value]) => {
    if (value && value !== "all" && value !== "") {
      filtered = filtered.filter((item) => {
        const itemValue = item[key];
        return itemValue === value || String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    }
  });

  // Apply sorting
  if (sortConfig.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.value!.key];
      const bValue = b[sortConfig.value!.key];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.value!.direction === "asc" ? 1 : -1;
      if (bValue == null) return sortConfig.value!.direction === "asc" ? -1 : 1;
      
      // Handle dates
      if (sortConfig.value!.key.includes('date') || sortConfig.value!.key.includes('time') || sortConfig.value!.key.includes('At')) {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return sortConfig.value!.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
      }
      
      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.value!.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      // Handle strings
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (aStr < bStr) return sortConfig.value!.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.value!.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return filtered;
});

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / currentItemsPerPage.value));

const startItem = computed(() => {
  if (totalItems.value === 0) return 0;
  return (currentPage.value - 1) * currentItemsPerPage.value + 1;
});

const endItem = computed(() => {
  const end = currentPage.value * currentItemsPerPage.value;
  return Math.min(end, totalItems.value);
});

// This is the key fix - make sure we're using this for the table data
const displayedData = computed(() => {
  const startIndex = (currentPage.value - 1) * currentItemsPerPage.value;
  const endIndex = startIndex + currentItemsPerPage.value;
  console.log('Pagination Debug:', {
    currentPage: currentPage.value,
    itemsPerPage: currentItemsPerPage.value,
    startIndex,
    endIndex,
    totalFiltered: filteredData.value.length,
    displayedCount: filteredData.value.slice(startIndex, endIndex).length
  });
  return filteredData.value.slice(startIndex, endIndex);
});

const hasActiveFilters = computed(() => {
  return (
    globalFilter.value ||
    Object.values(filterValues.value).some((v) => v && v !== "all" && v !== "")
  );
});

// Methods
const getBadgeColor = (value: any, colorMap?: Record<string, string>) => {
  if (!colorMap) return "primary";
  return colorMap[value] || "primary";
};

const getAvatarUrl = (row: any) => {
  if (row.avatar) return row.avatar;
  if (row.email) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || row.email)}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || "User")}`;
};

const formatDate = (dateString: string | number) => {
  if (!dateString) return "N/A";
  try {
    const date = typeof dateString === "number" 
      ? new Date(dateString) 
      : new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return String(dateString);
  }
};

const getSortIcon = (column: any) => {
  if (!sortConfig.value || sortConfig.value.key !== column.id) {
    return "i-heroicons-chevron-up-down";
  }
  return sortConfig.value.direction === "asc" 
    ? "i-heroicons-chevron-up" 
    : "i-heroicons-chevron-down";
};

const getRowActions = (row: any, index: number) => {
  return props.rowActions(row, index);
};

// Event handlers
const handleSearch = () => {
  currentPage.value = 1;
  emit("update:search", globalFilter.value);
};

const handleFilterChange = () => {
  currentPage.value = 1;
  emit("update:filters", { ...filterValues.value });
};

const handleSort = (column: any) => {
  const key = column.id;
  
  if (sortConfig.value?.key === key) {
    // Toggle direction or clear sort
    if (sortConfig.value.direction === "asc") {
      sortConfig.value.direction = "desc";
    } else {
      sortConfig.value = null;
    }
  } else {
    // Set new sort
    sortConfig.value = { key, direction: "asc" };
  }
  
  emit("update:sort", sortConfig.value);
};

const handlePageChange = (page: number) => {
  console.log('Page change requested:', page);
  currentPage.value = page;
  emit("update:currentPage", page);
};

const handleItemsPerPageChange = (value: number) => {
  console.log('Items per page change:', value);
  currentItemsPerPage.value = value;
  currentPage.value = 1; // Reset to first page
  emit("update:itemsPerPage", value);
};

const clearFilters = () => {
  globalFilter.value = "";
  Object.keys(filterValues.value).forEach((key) => {
    filterValues.value[key] = "";
  });
  currentPage.value = 1;
  emit("update:filters", {});
  emit("update:search", "");
};

const handleCreate = () => {
  emit("create");
};

const handleRefresh = () => {
  emit("refresh");
};

const handleExport = () => {
  const dataToExport = hasActiveFilters.value ? filteredData.value : props.data;
  emit("export", dataToExport);
};

// Watch for changes to reset pagination when filters change
watch([globalFilter, filterValues], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
}, { deep: true });

// Watch for external itemsPerPage changes
watch(() => props.itemsPerPage, (newValue) => {
  currentItemsPerPage.value = newValue;
});

// Debug watchers
watch(currentPage, (newPage) => {
  console.log('Current page changed to:', newPage);
});

watch(displayedData, (newData) => {
  console.log('Displayed data changed, count:', newData.length);
});
</script>