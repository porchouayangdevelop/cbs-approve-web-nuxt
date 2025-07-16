<script setup lang="ts">
definePageMeta({
  layout: 'admin-session',
  middleware: ['auth-guard', 'admin-guard']
})
</script>

<template>
  <div>
    Page: admin/requests/categories
  </div>
</template>

<style scoped></style>
