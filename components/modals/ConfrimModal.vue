<script setup lang="ts">
interface Props {
  title: string;
  message?: string;
  dismissible?: boolean;
  loading?: boolean;
  loadingText?: string;
  okText?: string;
  cancelText?: string;
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): Promise<void> | void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  okText: "Confirm",
  cancelText: "Cancel",
  loadingText: "Proccessing...",
  dismissible: true,
  loading: false,
});

const emit = defineEmits<Emits>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loading = ref(false);

const handleConfirm = async () => {
  try {
    loading.value = true;
    await emit("confirm");

    isOpen.value = false;
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  if (!loading.value) {
    emit("cancel");
    isOpen.value = false;
  }
};
</script>

<template>
  <UModal
    :title="title"
    :dismissible="true"
    v-model="isOpen"
    :prevent-close="loading"
  >
    <UCard>
      <template #header>
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="w-5 h-5 text-primary-600 dark:text-primary-400"
            />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h2>
          </div>
        </div>
      </template>

      <div class="py-4">
        <p class="text-gray-600 dark:text-gray-400">
          {{ message || "Are you sure you want to proceed with this action?" }}
        </p>

        <!-- Additional content slot -->
        <div v-if="$slots.content" class="mt-4">
          <slot name="content"></slot>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <UButton
            variant="outline"
            color="secondary"
            :disabled="loading"
            @click="handleCancel"
          >
            {{ cancelText }}
          </UButton>
          <UButton
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="handleConfirm"
          >
            <template #leading v-if="!loading">
              <UIcon name="i-heroicons-check" />
            </template>
            {{ loading ? loadingText : okText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
