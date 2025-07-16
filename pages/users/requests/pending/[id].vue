<script setup lang="ts">
definePageMeta({
  layout: 'user-session',
  middleware: ['auth-guard', 'user-guard']
});
const routes = useRoute();
const router = useRouter();
</script>

<template>
  <div>
    Page: users/requests/pending/[id]

    <pre>{{routes}}</pre>

  </div>
</template>

<style scoped></style>
