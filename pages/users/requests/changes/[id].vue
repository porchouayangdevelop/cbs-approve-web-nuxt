<script setup lang="ts">
definePageMeta({
  layout: 'user-session',
  middleware: ['auth-guard', 'user-guard']
})
</script>

<template>
  <div>
    Page: users/requests/changes/[id]
  </div>
</template>

<style scoped></style>
