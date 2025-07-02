<script setup lang="ts">
definePageMeta({
  layout: 'admin-session',
  middleware: ['auth-guard', 'admin-guard', 'permission-guard']
})

</script>

<template>
  <div>
    Page: admin/users/index
  </div>
</template>

<style scoped></style>
