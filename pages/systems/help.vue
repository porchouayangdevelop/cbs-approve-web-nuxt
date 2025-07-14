<script setup lang="ts">
import {awaitAsync} from "valibot";

definePageMeta({
  layout: false,
  path: '/help'
})


const data = await useFetch("https://jsonplaceholder.typicode.com/users",{
  lazy:true
});
useSeoMeta({
  title: 'Help'
})
</script>

<template>
  <div>
    <pre>
    </pre>
  </div>
</template>

<style scoped></style>
