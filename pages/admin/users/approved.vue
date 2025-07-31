<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});
</script>

<template>
  <div>Page: admin/users/approved</div>
</template>

<style scoped></style>
