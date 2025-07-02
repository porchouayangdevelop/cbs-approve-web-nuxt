<script setup lang="ts">
definePageMeta({
  layout:"checker-session",
  middleware: ['auth-guard', 'checker-guard']
})
</script>

<template>
  <div>
    Page: checkers/stats/index
  </div>
</template>

<style scoped></style>
