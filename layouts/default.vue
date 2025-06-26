<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Sidebar Drawer -->
    <Drawer
        :is-open="isSidebarOpen"
        @close="toggleSidebar"
        @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- App Bar -->
      <AppBar
          @toggle-sidebar="toggleSidebar"
          @toggle-theme="toggleTheme"
          @logout="handleLogout"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div class="max-w-9xl mx-auto">
          <!-- Breadcrumbs -->
          <Breadcrumbs class="mb-6" />

          <!-- Page Content -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-200px)]">
            <slot />
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        @click="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
// Composables
import Drawer from "~/components/system/aside/Drawer.vue";
import AppBar from "~/components/system/aside/AppBar.vue";
import Breadcrumbs from "~/components/system/aside/Breadcrumbs.vue";

const colorMode = useColorMode()

// State
const isSidebarOpen = ref(false)

// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleNavigation = () => {
  // Close sidebar on mobile after navigation
  if (process.client && window.innerWidth < 1024) {
    closeSidebar()
  }
}

const handleLogout = async () => {
  // Add your logout logic here
  console.log('Logout clicked')
  // Example: await $fetch('/api/auth/logout', { method: 'POST' })
  // await navigateTo('/login')
}

// Close sidebar on route change (mobile)
const route = useRoute()
watch(() => route.path, () => {
  if (process.client && window.innerWidth < 1024) {
    closeSidebar()
  }
})

// Handle window resize
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      isSidebarOpen.value = false
    }
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>
