<script setup lang="ts">
defineProps<{
  title: string;
  content?: string;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
}>();

const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <UModal
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :on-ok="onOk"
    :on-cancel="onCancel"
  >
    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          label="Dismiss"
          @click="emit('close', false)"
        />
        <UButton label="Success" @click="emit('close', true)" />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
