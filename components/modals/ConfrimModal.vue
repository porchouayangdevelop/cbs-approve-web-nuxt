<script setup lang="ts">
const props = defineProps<{
  title: string;
  dismissible?: boolean;
  // content?: string;
  // body: string;
  // data?: string;
  loading?: boolean;
  okText: string;
  cancelText: string;
}>();

const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <u-modal
    :title="title"
    :dismissible="dismissible"
    :ok-text="okText"
    :cancel-text="cancelText"
    :close="{ onClick: () => emit('close', false) }"
  >
    <template #footer>
      <u-button
        class="cursor-pointer"
        icon="i-heroicons-document-check"
        color="primary"
        label="Confirm"
        @click="emit('close', true)"
      />

      <u-button
        icon="i-heroicons-x-mark"
        variant="outline"
        color="error"
        label="Close"
        class="cursor-pointer"
        @click="emit('close', false)"
      />
    </template>
  </u-modal>
</template>

<style scoped></style>
