<script setup lang="ts">
import UserCreate from "~/components/users/UserCreate.vue";

definePageMeta({
  layout: 'admin-session',
  middleware: ['auth-guard', 'admin-guard']
})
</script>

<template>
  <div>
    <UserCreate>

    </UserCreate>
  </div>
</template>

<style scoped></style>
