// types/utable.ts

import type { DropdownMenuItem } from "@nuxt/ui";

/**
 * Column configuration for UTable
 */
export interface UTableColumn {
  /** Unique key for the column data */
  accessorKey: string;
  
  /** Column header text or render function */
  header: string | ((column: any) => any);
  
  /** Type of cell rendering */
  cellType?: "text" | "badge" | "avatar" | "date" | "actions" | "custom";
  
  /** Color mapping for badge cells */
  colorMap?: Record<string, string>;
  
  /** Sub-field for avatar cell secondary text */
  subField?: string;
  
  /** Whether the column is sortable */
  sortable?: boolean;
  
  /** Column width (CSS value) */
  width?: string;
  
  /** Whether the column is pinned */
  pinned?: "left" | "right" | false;
  
  /** Custom class for the column */
  class?: string;
}

/**
 * Filter configuration for UTable
 */
export interface UTableFilter {
  /** Unique key for the filter */
  key: string;
  
  /** Type of filter input */
  type: "select" | "input" | "date" | "number";
  
  /** Placeholder text */
  placeholder: string;
  
  /** Options for select filter */
  options?: string[] | { label: string; value: any }[];
  
  /** Default value */
  defaultValue?: any;
  
  /** Custom filter function */
  filterFn?: (item: any, value: any) => boolean;
}

/**
 * Sort configuration
 */
export interface UTableSort {
  /** Field to sort by */
  key: string;
  
  /** Sort direction */
  direction: "asc" | "desc";
}

/**
 * Pagination configuration
 */
export interface UTablePagination {
  /** Current page (1-based) */
  page: number;
  
  /** Items per page */
  itemsPerPage: number;
  
  /** Total number of items */
  total: number;
  
  /** Available items per page options */
  itemsPerPageOptions?: number[];
}

/**
 * Export configuration
 */
export interface UTableExportConfig {
  /** Export format */
  format: "csv" | "json" | "xlsx";
  
  /** Export filename */
  filename?: string;
  
  /** Columns to include in export */
  columns?: string[];
  
  /** Custom export function */
  exportFn?: (data: any[], config: UTableExportConfig) => void;
}

/**
 * UTable component props
 */
export interface UTableProps {
  // Data props
  /** Table data array */
  data: any[];
  
  /** Column configurations */
  columns: UTableColumn[];
  
  /** Loading state */
  loading?: boolean;
  
  /** Error message */
  error?: string | null;

  // Display props
  /** Table title */
  title?: string;
  
  /** Table description */
  description?: string;
  
  /** Loading message */
  loadingMessage?: string;
  
  /** Error title */
  errorTitle?: string;
  
  /** Name for items (e.g., "users", "products") */
  itemName?: string;

  // Feature toggles
  /** Show header section */
  showHeader?: boolean;
  
  /** Show search input */
  showSearch?: boolean;
  
  /** Show filters */
  showFilters?: boolean;
  
  /** Show create button */
  showCreate?: boolean;
  
  /** Show refresh button */
  showRefresh?: boolean;
  
  /** Show export button */
  showExport?: boolean;
  
  /** Show pagination */
  showPagination?: boolean;
  
  /** Show items per page selector */
  showItemsPerPage?: boolean;

  // Search and filter props
  /** Search input placeholder */
  searchPlaceholder?: string;
  
  /** Fields to search in (if empty, searches all fields) */
  searchKeys?: string[];
  
  /** Filter configurations */
  filters?: UTableFilter[];

  // Pagination props
  /** Default items per page */
  itemsPerPage?: number;
  
  /** Available items per page options */
  itemsPerPageOptions?: number[];

  // Create button props
  /** Create button text */
  createButtonText?: string;
  
  /** Create button icon */
  createIcon?: string;

  // Empty state props
  /** Empty state title */
  emptyTitle?: string;
  
  /** Empty state description */
  emptyDescription?: string;
  
  /** Empty state icon */
  emptyIcon?: string;

  // Row actions
  /** Function to generate row actions */
  rowActions?: (row: any, index: number) => DropdownMenuItem[][];

  // Table UI customization
  /** Custom table UI classes */
  tableUi?: Record<string, any>;
  
  // Export configuration
  /** Export configuration */
  exportConfig?: UTableExportConfig;
  
  // Selection
  /** Enable row selection */
  selectable?: boolean;
  
  /** Selected rows */
  selectedRows?: any[];
  
  /** Selection key field */
  selectionKey?: string;
}

/**
 * UTable component emits
 */
export interface UTableEmits {
  /** Create button clicked */
  create: [];
  
  /** Refresh button clicked */
  refresh: [];
  
  /** Export button clicked */
  export: [data: any[]];
  
  /** Row action triggered */
  action: [action: string, row: any, index: number];
  
  /** Items per page changed */
  "update:itemsPerPage": [value: number];
  
  /** Current page changed */
  "update:currentPage": [value: number];
  
  /** Filters changed */
  "update:filters": [filters: Record<string, any>];
  
  /** Search query changed */
  "update:search": [query: string];
  
  /** Sort configuration changed */
  "update:sort": [sort: UTableSort | null];
  
  /** Row selection changed */
  "update:selectedRows": [rows: any[]];
  
  /** Row clicked */
  "row-click": [row: any, index: number];
  
  /** Row double-clicked */
  "row-dblclick": [row: any, index: number];
}

/**
 * UTable instance methods
 */
export interface UTableInstance {
  /** Refresh table data */
  refresh: () => void;
  
  /** Clear all filters */
  clearFilters: () => void;
  
  /** Reset pagination to first page */
  resetPagination: () => void;
  
  /** Clear sort */
  clearSort: () => void;
  
  /** Export data */
  exportData: (config?: UTableExportConfig) => void;
  
  /** Select all rows */
  selectAll: () => void;
  
  /** Clear selection */
  clearSelection: () => void;
  
  /** Get selected rows */
  getSelectedRows: () => any[];
  
  /** Get filtered data */
  getFilteredData: () => any[];
  
  /** Get current page data */
  getCurrentPageData: () => any[];
}

/**
 * Predefined column types for common use cases
 */
export const UTableColumnTypes = {
  /** Index/number column */
  index: (header = "#"): UTableColumn => ({
    accessorKey: "index",
    header,
    cellType: "text",
    sortable: false,
    width: "60px",
  }),

  /** Avatar with name column */
  avatar: (
    accessorKey: string,
    header: string,
    subField?: string
  ): UTableColumn => ({
    accessorKey,
    header,
    cellType: "avatar",
    subField,
    sortable: true,
  }),

  /** Status badge column */
  status: (
    accessorKey: string,
    header: string,
    colorMap?: Record<string, string>
  ): UTableColumn => ({
    accessorKey,
    header,
    cellType: "badge",
    colorMap: colorMap || {
      active: "green",
      inactive: "red",
      pending: "yellow",
      approved: "green",
      rejected: "red",
    },
    sortable: true,
  }),

  /** Date column */
  date: (accessorKey: string, header: string): UTableColumn => ({
    accessorKey,
    header,
    cellType: "date",
    sortable: true,
  }),

  /** Actions column */
  actions: (header = "Actions"): UTableColumn => ({
    accessorKey: "actions",
    header,
    cellType: "actions",
    sortable: false,
    width: "100px",
    pinned: "right",
  }),

  /** Text column */
  text: (accessorKey: string, header: string): UTableColumn => ({
    accessorKey,
    header,
    cellType: "text",
    sortable: true,
  }),
};

/**
 * Predefined filter types for common use cases
 */
export const UTableFilterTypes = {
  /** Text search filter */
  search: (key: string, placeholder = "Search..."): UTableFilter => ({
    key,
    type: "input",
    placeholder,
  }),

  /** Status select filter */
  status: (
    key: string,
    options = ["active", "inactive", "pending"]
  ): UTableFilter => ({
    key,
    type: "select",
    placeholder: "Filter by status",
    options: [
      { label: "All", value: "" },
      ...options.map((option) => ({
        label: option.charAt(0).toUpperCase() + option.slice(1),
        value: option,
      })),
    ],
  }),

  /** Role select filter */
  role: (key: string, roles: string[]): UTableFilter => ({
    key,
    type: "select",
    placeholder: "Filter by role",
    options: [
      { label: "All Roles", value: "" },
      ...roles.map((role) => ({
        label: role,
        value: role,
      })),
    ],
  }),

  /** Date range filter */
  dateRange: (key: string): UTableFilter => ({
    key,
    type: "date",
    placeholder: "Select date range",
  }),
};

/**
 * Utility functions for UTable
 */
export const UTableUtils = {
  /** Generate default row actions */
  defaultRowActions: (
    onView?: (row: any) => void,
    onEdit?: (row: any) => void,
    onDelete?: (row: any) => void
  ) => (row: any, index: number): DropdownMenuItem[][] => {
    const actions: DropdownMenuItem[][] = [];

    if (onView) {
      actions.push([
        {
          label: "View",
          icon: "i-heroicons-eye",
          click: () => onView(row),
        },
      ]);
    }

    if (onEdit) {
      actions.push([
        {
          label: "Edit",
          icon: "i-heroicons-pencil-square",
          click: () => onEdit(row),
        },
      ]);
    }

    if (onDelete) {
      actions.push([
        {
          label: "Delete",
          icon: "i-heroicons-trash",
          click: () => onDelete(row),
        },
      ]);
    }

    return actions;
  },

  /** Export data as CSV */
  exportAsCSV: (data: any[], filename = "export.csv", columns?: string[]) => {
    if (!data || data.length === 0) return;

    const headers = columns || Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            const stringValue = String(value || "");
            // Escape quotes and wrap in quotes if contains comma or quote
            return stringValue.includes(",") || stringValue.includes('"')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /** Export data as JSON */
  exportAsJSON: (data: any[], filename = "export.json") => {
    if (!data || data.length === 0) return;

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /** Format file size */
  formatFileSize: (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },

  /** Format date */
  formatDate: (
    date: string | number | Date,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    if (!date) return "N/A";
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString(undefined, options);
    } catch {
      return String(date);
    }
  },

  /** Format time ago */
  formatTimeAgo: (date: string | number | Date): string => {
    if (!date) return "Never";
    const dateObj = new Date(date);
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  },

  /** Generate avatar URL */
  generateAvatarUrl: (
    name: string,
    size = 40,
    background?: string
  ): string => {
    const encodedName = encodeURIComponent(name);
    const params = new URLSearchParams({
      name: encodedName,
      size: size.toString(),
      ...(background && { background }),
    });
    return `https://ui-avatars.com/api/?${params.toString()}`;
  },

  /** Debounce function */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  /** Deep clone object */
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map((item) => UTableUtils.deepClone(item)) as any;
    if (typeof obj === "object") {
      const clonedObj = {} as any;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = UTableUtils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },
};

/**
 * Default configurations
 */
export const UTableDefaults = {
  /** Default items per page options */
  itemsPerPageOptions: [5, 10, 20, 50, 100],

  /** Default table UI configuration */
  tableUi: {
    th: "py-2 px-3 font-medium text-left",
    td: "py-2 px-3 border-b border-gray-200 dark:border-gray-700",
    thead: "bg-gray-50 dark:bg-gray-800",
    tbody: "bg-white dark:bg-gray-900",
  },

  /** Default empty state configuration */
  emptyState: {
    title: "No data found",
    description: "There are no items to display",
    icon: "i-heroicons-folder-open",
  },

  /** Default color maps */
  colorMaps: {
    status: {
      active: "green",
      inactive: "red",
      pending: "yellow",
      approved: "green",
      rejected: "red",
      draft: "gray",
      published: "blue",
    },
    priority: {
      low: "green",
      medium: "yellow",
      high: "orange",
      critical: "red",
    },
    role: {
      admin: "red",
      manager: "blue",
      user: "green",
      guest: "gray",
    },
  },
} as const;