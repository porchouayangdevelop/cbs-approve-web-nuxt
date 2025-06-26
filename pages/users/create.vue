<script setup lang="ts">

import UserCreate from "~/components/users/UserCreate.vue";

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Create User',
  appleMobileWebAppTitle: 'Create User',
})

</script>

<template>
  <UserCreate/>
</template>

<style scoped>

</style>