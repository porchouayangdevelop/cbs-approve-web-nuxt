<script setup lang="ts">
import type {TokenPayload} from '~/composables/useJWTDecoder'

definePageMeta({
  layout: 'checker-session',
  middleware: ['auth-guard', 'checker-guard']
})

const {checkRole} = useCheckAuth();

</script>

<template>
  <div>
    Page: checkers/index
    <pre>
      {{checkRole}}
    </pre>
  </div>
</template>

<style scoped></style>
