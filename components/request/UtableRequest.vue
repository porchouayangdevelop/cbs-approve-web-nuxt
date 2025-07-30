<script setup lang="ts">
import { h } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";

interface ColumnConfig {
  accessorKey: string;
  header: string | ((column: any) => any);
  cellType?: "text" | "badge" | "avatar" | "date" | "actions";
  colorMap?: Record<string, string>;
  subField?: string;
  sortable?: boolean;
}

interface FilterConfig {
  key: string;
  type: "select" | "input";
  placeholder: string;
  options?: string[];
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
  showDebug?: boolean;

  // Search and filter props
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: FilterConfig[];

  // Create button props
  createButtonText?: string;
  createIcon?: string;

  // Empty state props
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;

  // Row actions
  rowActions?: (row: any, index: number) => DropdownMenuItem[][];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  title: "Data Table",
  description: "",
  loadingMessage: "Loading data...",
  errorTitle: "Failed to load data",
  itemName: "items",

  showHeader: true,
  showSearch: true,
  showFilters: true,
  showCreate: true,
  showRefresh: true,
  showExport: true,
  showPagination: true,
  showDebug: false,

  searchPlaceholder: "Search...",
  searchKey: "",
  filters: () => [],

  createButtonText: "Create New",
  createIcon: "i-heroicons-plus",

  emptyTitle: "No data found",
  emptyDescription: "Get started by creating your first item",
  emptyIcon: "i-heroicons-folder-open",

  rowActions: () => () => [],
});

const emit = defineEmits<{
  create: [];
  refresh: [];
  export: [data: any[]];
  action: [action: string, row: any, index: number];
}>();


// Refs
const table = useTemplateRef("table");
const globalFilter = ref("");
const filterValues = ref<Record<string, any>>({});
const columnPinning = ref({ left: [], right: [] });
const paginationState = ref({
  pageIndex: 0,
  pageSize: 10,
  total: 0,
});


// Computed
const tableColumns = computed(() => {
  return props.columns.map((col) => {
    const column: TableColumn<any> = {
      accessorKey: col.accessorKey,
      header:
        typeof col.header === "string"
          ? col.sortable !== false
            ? ({ column }) => createSortableHeader(column, col.header as string)
            : col.header
          : col.header,
      cell: ({ row }) => row.getValue(col.accessorKey),
    };

    // Add cellType for template selection
    if (col.cellType) {
      column.cellType = col.cellType;
      column.colorMap = col.colorMap;
      column.subField = col.subField;
    }
    return column;
  });
});

const filteredData = computed(() => {
  let filtered = [...props.data];

  // Apply global search
  if (globalFilter.value && props.searchKey) {
    const query = globalFilter.value.toLowerCase();
    filtered = filtered.filter((item) => {
      const searchValue = props
        .searchKey!.split(".")
        .reduce((obj, key) => obj?.[key], item);
      return String(searchValue || "")
        .toLowerCase()
        .includes(query);
    });
  } else if (globalFilter.value) {
    // Search across all string fields if no specific search key
    const query = globalFilter.value.toLowerCase();
    filtered = filtered.filter((item) => {
      return Object.values(item).some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }

  // Apply filters
  Object.entries(filterValues.value).forEach(([key, value]) => {
    if (value && value !== "all") {
      filtered = filtered.filter((item) => item[key] === value);
    }
  });

  return filtered;
});

const hasFilters = computed(() => {
  return (
    globalFilter.value ||
    Object.values(filterValues.value).some((v) => v && v !== "all")
  );
});

// Methods
const createSortableHeader = (column: any, label: string) => {
  const isSorted = column.getIsSorted();

  return h("div", { class: "flex items-center space-x-2" }, [
    h("span", label),
    h(
      "button",
      {
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "ml-2",
      },
      [
        h("UIcon", {
          name: isSorted
            ? isSorted === "asc"
              ? "i-heroicons-chevron-up"
              : "i-heroicons-chevron-down"
            : "i-heroicons-chevron-up-down",
          class: "w-4 h-4",
        }),
      ]
    ),
  ]);
};

const getBadgeColor = (value: any, colorMap?: Record<string, string>) => {
  if (!colorMap) return "error";
  return colorMap[value] || "error";
};

const getAvatarUrl = (row: any) => {
  // You can customize this based on your data structure
  if (row.avatar) return row.avatar;
  if (row.email)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || row.email)}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    // Handle timestamp
    const date = isNaN(Number(dateString))
      ? new Date(dateString)
      : new Date(parseInt(dateString));
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
};

const getRowActions = (row: any, index: number) => {
  return props.rowActions(row, index);
};

const handleCreate = () => {
  emit("create");
};

const handleRefresh = () => {
  emit("refresh");
};

const handleExport = () => {
  const dataToExport =
    filteredData.value.length > 0 ? filteredData.value : props.data;
  emit("export", dataToExport);
};

// Initialize filter values
watch(
  () => props.filters,
  (newFilters) => {
    newFilters.forEach((filter) => {
      if (!(filter.key in filterValues.value)) {
        filterValues.value[filter.key] = "";
      }
    });
  },
  { immediate: true }
);


</script>

<template>
    <div class="space-y-6">
    <!-- Debug information (remove in production) -->
    <div
      v-if="showDebug && $nuxt.$dev"
      class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
    >
      <h3 class="font-bold mb-2">Debug Info:</h3>
      <p>Loading: {{ loading }}</p>
      <p>Error: {{ error }}</p>
      <p>Raw data count: {{ data?.length || 0 }}</p>
      <p>Filtered data count: {{ filteredData?.length || 0 }}</p>
    </div>

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
      <div class="flex items-center justify-between mb-1" v-if="showHeader">
        <div>
          <!-- <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h1> -->
          <p class="text-gray-600 dark:text-gray-400" v-if="description">
            {{ description }}
          </p>
        </div>
        <div class="flex items-center space-x-4">
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
        </div>
      </div>

      <!-- Table Container -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <!-- Search and Filters -->
        <div
          class="flex px-4 py-3 border-b border-gray-200 dark:border-gray-700"
          v-if="showSearch || showFilters"
        >
          <div class="flex-1 flex items-center space-x-4">
            <UInput
              v-if="showSearch"
              v-model="globalFilter"
              :placeholder="searchPlaceholder"
              class="max-w-sm"
              icon="i-heroicons-magnifying-glass"
            />

            <!-- Custom Filters -->
            <div
              v-if="showFilters && filters.length > 0"
              class="flex items-center space-x-2"
            >
              <template v-for="filter in filters" :key="filter.key">
                <USelectMenu
                  v-if="filter.type === 'select'"
                  v-model="filterValues[filter.key]"
                  :items="filter.options"
                  :placeholder="filter.placeholder"
                  class="w-48"
                />
              </template>
            </div>
          </div>
        </div>

        <!-- Table -->
        <UTable
          :columns="tableColumns"
          :data="filteredData"
          :loading="loading"
          v-model:column-pinning="columnPinning"
          v-model:pagination="paginationState"
          v-model:global-filter="globalFilter"
          ref="table"
          :ui="{
            th: 'py-1',
            td: 'py-[.1rem] border-b border-gray-200 dark:border-gray-700',
          }"
        >
          <!-- Dynamic cell templates -->
          <template
            v-for="column in tableColumns"
            :key="column.accessorKey"
            #[`${column.accessorKey}-cell`]="{ row }"
          >
            <slot
              :name="`${column.accessorKey}-cell`"
              :row="row"
              :value="row.getValue(column.accessorKey)"
            >
              <!-- Default cell rendering based on column type -->
              <div v-if="column.cellType === 'badge'">
                <UBadge
                  :color="
                    getBadgeColor(
                      row.getValue(column.accessorKey),
                      column.colorMap
                    )
                  "
                  variant="soft"
                >
                  {{ row.getValue(column.accessorKey) }}
                </UBadge>
              </div>
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
              <div v-else-if="column.cellType === 'date'">
                {{ formatDate(row.getValue(column.accessorKey)) }}
              </div>
              <div v-else-if="column.cellType === 'actions'">
                <UDropdownMenu :items="getRowActions(row.original, row.index)">
                  <UButton
                    icon="i-heroicons-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    aria-label="Actions"
                  />
                </UDropdownMenu>
              </div>
              <div v-else>
                {{ row.getValue(column.accessorKey) }}
              </div>
            </slot>
          </template>
        </UTable>

        <!-- Pagination -->
        <div
          class="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center space-x-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ filteredData.length }} of {{ data.length }}
              {{ itemName }}
            </p>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2" v-if="showExport">
              <UButton
                @click="handleExport"
                variant="outline"
                size="sm"
                icon="i-heroicons-arrow-down-tray"
                class="cursor-pointer"
              >
                Export
              </UButton>
            </div>

            <UPagination
              :default-page="
                (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
              "
              :items-per-page="table?.tableApi?.getState().pagination.pageSize"
              :total="table?.tableApi?.getFilteredRowModel().rows.length"
              @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
              v-if="showPagination"
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
            {{ hasFilters ? "Try adjusting your filters" : emptyDescription }}
          </p>
          <UButton
            @click="handleCreate"
            :icon="createIcon"
            class="cursor-pointer"
            v-if="showCreate && !hasFilters"
          >
            {{ createButtonText }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
