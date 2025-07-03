<template>
  <div>
    Users
  </div>
</template>

<script setup lang="ts">
import UserCreateModal from "~/components/modals/UserCreateModal.vue";
import UserEditModal from "~/components/modals/UserEditModal.vue";

definePageMeta({
  layout: 'user-session',
  // middleware: ['auth-guard', 'user-guard']
})


// SEO
useSeoMeta({
  title: 'User Management',
  description: 'Manage and organize your team members with comprehensive user management tools.'
})
</script>