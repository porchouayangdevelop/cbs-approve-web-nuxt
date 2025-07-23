<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  loadingMessage: string;
  loading: boolean;
  shouldShowLoading: boolean;
}>();
</script>

<template>
  <div
    v-if="shouldShowLoading"
  
    class="flex justify-center items-center py-12"
  >
    <div class="text-center">
      <div
        class="flex items-center justify-center animate-spin rounded-full h-30 w-30 border-b-2 border-primary-600 mx-auto mb-4"
      ></div>
      <span class="text-gray-600 dark:text-gray-400">{{ loadingMessage }}</span>
    </div>
  </div>
</template>

<style scoped></style>
