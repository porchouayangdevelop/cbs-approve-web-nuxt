<script setup lang="ts">
definePageMeta({
  layout: 'auth-session',
  middleware: ['auth-guard']
})
</script>

<template>
  <div>
    Page: auth/reset-password
  </div>
</template>

<style scoped></style>
