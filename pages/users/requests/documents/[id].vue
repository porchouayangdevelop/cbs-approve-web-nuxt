<script setup lang="ts">
definePageMeta({
  layout: 'user-session',
  middleware: ['auth-guard', 'user-guard']
})
</script>

<template>
  <div>
    Page: users/requests/documents/[id]
  </div>
</template>

<style scoped></style>
