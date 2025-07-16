<script setup lang="ts">
definePageMeta({
  layout:'user-session',
  middleware: ['auth-guard', 'user-guard']
})
</script>

<template>
  <div>
    Page: users/requests/templates/index
  </div>
</template>

<style scoped></style>
