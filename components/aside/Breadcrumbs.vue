<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2 text-sm">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.to" class="flex items-center">
        <UIcon
            v-if="index > 0"
            name="i-heroicons-chevron-right"
            class="w-4 h-4 text-gray-400 mx-2"
        />
        <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.to"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
            v-else
            class="text-gray-900 dark:text-white font-medium"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface Breadcrumb {
  label: string
  to: string
}

const route = useRoute()

const breadcrumbs = computed((): Breadcrumb[] => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const crumbs: Breadcrumb[] = []

  let currentPath = ''

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Generate label from segment
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)

    // Custom labels for specific routes
    const customLabels: Record<string, string> = {
      '/': 'Dashboard',
      '/users': 'Users',
      '/products': 'Products',
      '/products/categories': 'Categories',
      '/products/inventory': 'Inventory',
      '/orders': 'Orders',
      '/reports': 'Reports',
      '/analytics': 'Analytics',
      '/settings': 'Settings'
    }

    if (customLabels[currentPath]) {
      label = customLabels[currentPath]
    }

    crumbs.push({
      label,
      to: currentPath
    })
  })

  return crumbs
})
</script>