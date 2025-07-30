<template>
  <div>
    <go-back label="go back" icon="i-lucide-arrow-left" size="sm" variant="subtle"/>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});
</script>

<style></style>
