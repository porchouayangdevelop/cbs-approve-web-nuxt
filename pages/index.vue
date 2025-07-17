<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['auth-redirect.global']
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Redirecting...</p>
    </div>
  </div>
</template>

<style scoped></style>
