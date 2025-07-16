<template>
  <div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout:'user-session',
  middleware: ['auth-guard', 'user-guard']
})
</script>

<style scoped>

</style>