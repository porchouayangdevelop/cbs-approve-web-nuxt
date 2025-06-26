<script setup lang="ts">
const config = useRuntimeConfig();
const toast = useToast();

const showToast = ()=>{
  toast.add({
    icon: 'i-heroicons-check-circle',
    title: 'User created successfully!',
    duration: 3000,
    type:'foreground',
    progress: true,
  })
}
</script>

<template>
  <div>
    <h1>
      Welcome to CBS Approve Web Nuxt
    </h1>

    <p> {{ config.public.webTitle }} </p>
    {{config.public.webDescription}}
    {{config.delete_user}}

    <UButton variant="outline" color="neutral" @click="showToast">show toast</UButton>
  </div>
</template>

<style scoped>
</style>
