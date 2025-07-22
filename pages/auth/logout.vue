<script setup lang="ts">
import Login from "~/pages/auth/login.vue";
useSeoMeta({
  title: 'Logout',

})
definePageMeta({
  layout: false,
  middleware: []
})
</script>

<template>
  <div>
    <login/>
  </div>
</template>

<style scoped></style>
