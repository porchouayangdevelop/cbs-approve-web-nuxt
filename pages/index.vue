<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <div>
    <h1>
      Welcome to CBS Approve Web Nuxt
    </h1>

    <p> {{ config.public.webTitle }} </p>
    {{config.public.webDescription}}
  </div>
</template>

<style scoped>
</style>
