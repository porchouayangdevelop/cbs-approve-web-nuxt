<script setup lang="ts">
import {useGuards} from "~/composables/useGuards";

const config = useRuntimeConfig();
const toast = useToast();

definePageMeta({
  layout: 'default',e
  // middleware: ['auth-guard']
})

const {canAccess,hasRole,hasPermission} = useGuards();

if(canAccess('/admin')){}
if(hasRole('admin')){}
if(hasPermission('admin:access')){}

const showToast = () => {
  toast.add({
    icon: 'i-heroicons-check-circle',
    title: 'User created successfully!',
    duration: 3000,
    type: 'foreground',
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
    {{ config.public.webDescription }}
    {{ config.delete_user }}

    <UButton variant="outline" color="neutral" @click="showToast">show toast</UButton>
  </div>
</template>

<style scoped>
</style>
