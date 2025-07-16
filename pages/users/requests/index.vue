<script setup lang="ts">
import RequestForm from "~/components/users/RequestForm.vue";

definePageMeta({
  layout:'user-session',
  middleware: ['auth-guard', 'user-guard']
})
</script>

<template>
  <div>

  </div>
</template>

<style scoped></style>
