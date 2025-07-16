<script setup lang="ts">
definePageMeta({
  layout: 'admin-session',
  middleware: ['auth-guard','admin-guard'] // Use both guards
})

const { user } = useAuth()
const { getDashboardMetrics, getRecentActivity } = useRoleSession()

// Admin dashboard data
const metrics = getDashboardMetrics()
const recentActivity = getRecentActivity()

// Page title
useSeoMeta({
  title: 'Admin Dashboard - CBS Approve Web',
  description: 'System administration dashboard for CBS Approve Web'
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {{ user?.firstName || 'Admin' }}!
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            System Administration Dashboard
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <UBadge color="primary" variant="soft">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" />
            Administrator
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="metric in metrics" :key="metric.label" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ metric.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
          </div>
          <div :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center',
            `bg-${metric.color}-100 dark:bg-${metric.color}-900`
          ]">
            <UIcon :name="metric.icon" :class="[
              'w-6 h-6',
              `text-${metric.color}-600 dark:text-${metric.color}-400`
            ]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="activity in recentActivity" :key="activity.action" class="p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-user" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ activity.action }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ activity.subject }} • {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>