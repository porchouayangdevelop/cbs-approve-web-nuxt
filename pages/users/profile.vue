<script setup lang="ts">
definePageMeta({
  layout :'user-session',
  middleware: ['auth-guard', 'user-guard']
})

</script>

<template>
  <div>
    <Profile/>
  </div>
</template>



<style scoped>

</style>