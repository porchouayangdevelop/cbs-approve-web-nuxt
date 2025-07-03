<script setup lang="ts">
import {useGuards} from "~/composables/useGuards";

const config = useRuntimeConfig();
const toast = useToast();

definePageMeta({
  layout: 'custom',
  // middleware: ['auth-guard','role-base-redirect']
})

const {canAccess,hasRole,hasPermission} = useGuards();
const {currentRole} = useRoleSession();

onMounted(() => {
  console.log('Current role:', currentRole.value)
  console.log('Can access admin:', canAccess('/admin'))
  console.log('Has admin role:', hasRole('admin'))
  console.log('Has admin permission:', hasPermission('admin:access'))
})


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


    <UButton variant="outline" color="neutral" @click="showToast">show toast</UButton>
  </div>
</template>

<style scoped>
</style>
