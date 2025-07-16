<!-- layouts/default.vue - Add loading state -->
<template>
  <div v-if="isAuthLoading" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>

  <div v-else class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Your existing layout content -->
    <component
        :is="sidebarComponent"
        :is-open="isSidebarOpen"
        @close="toggleSidebar"
        @navigate="handleNavigation"
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <AppBar
          @toggle-sidebar="toggleSidebar"
          @toggle-theme="toggleTheme"
          @logout="handleLogout"
      />

      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div class="max-w-9xl mx-auto">
          <Breadcrumbs class="mb-2" />
          <div class="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-200px)]">
            <slot />
          </div>
        </div>
      </main>
    </div>

    <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        @click="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoleSession } from '~/composables/useRoleSession'
import AppBar from "~/components/system/aside/AppBar.vue";
import Breadcrumbs from "~/components/system/aside/Breadcrumbs.vue";

const { isLoading: isAuthLoading, isInitialized } = useAuth()
const { currentRole } = useRoleSession()

// Wait for auth to be initialized
watch(isInitialized, (initialized) => {
  if (initialized) {
    console.log('Auth initialized, current role:', currentRole.value)
  }
})

// Your existing layout logic...
</script>