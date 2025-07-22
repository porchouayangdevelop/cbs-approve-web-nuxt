<template>
  <div>
    <NuxtRouteAnnouncer />
    <nuxt-loading-indicator />
    <UApp>
      <nuxt-layout>
        <nuxt-page />
      </nuxt-layout>
    </UApp>
  </div>
</template>
<script setup lang="ts"></script>
