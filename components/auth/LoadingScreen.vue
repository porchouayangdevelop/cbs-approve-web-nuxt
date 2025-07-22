<script setup lang="ts">
const { isLoading, isInitialized } = useAuth();

const loadingMessage = computed(() => {
  if (!isInitialized.value) {
    return "Initializing...";
  }
  return "Loading...";
});
</script>

<template>
  <div
    v-if="isLoading && !isInitialized"
    class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"
      ></div>
      <p class="text-gray-600 dark:text-gray-400">{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<style scoped></style>
