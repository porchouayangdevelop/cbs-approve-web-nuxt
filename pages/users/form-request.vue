<script setup lang="ts">
import RequestForm from "~/components/users/RequestForm.vue";

definePageMeta({
  layout: 'usersession',
  // middleware: ['auth'],
})

useSeoMeta({
  title: 'Create Request',
  appleMobileWebAppTitle: 'Create Request',
})

const handleRequestSubmitted = (requestData:any) => {
  console.log('Request submitted:', requestData)
  // Send to API, show success message, navigate, etc.
}

const handleDraftSaved = (draftData:any) => {
  console.log('Draft saved:', draftData)
  // Save to localStorage or API
}
</script>

<template>
  <div>
    <RequestForm
    @submit="handleRequestSubmitted"
    @cancel="$router.back()"
    @saved="handleDraftSaved"
    ></RequestForm>
  </div>
</template>

<style scoped></style>
