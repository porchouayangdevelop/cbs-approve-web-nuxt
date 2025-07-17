<script setup lang="ts">
definePageMeta({
  layout: 'custom',
  middleware: ['auth-guard', 'admin-guard','checker-guard','user-guard']
})
</script>

<template>
  <div>
  </div>
</template>

<style scoped></style>
