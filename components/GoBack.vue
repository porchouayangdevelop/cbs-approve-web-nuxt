<script setup lang="ts">
interface Props {
  icon?: string;
  label?: string;
  variant?: "ghost" | "outline" | "solid" | "soft" | "subtle" | "link";
  size?: "md" | "xs" | "sm" | "lg" | "xl";
  color?:
    | "success"
    | "primary"
    | "secondary"
    | "tertiary"
    | "info"
    | "warning"
    | "error"
    | "neutral"
    | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "",
  label: "",
  variant: "outline",
  size: "md",
  color: "success",
});
</script>

<template>
  <u-button
    :size="size"
    :variant="variant"
    :icon="icon"
    :color="color"
    @click="useGoBack().goBack()"
    class="cursor-pointer"
    >{{ label }}</u-button
  >
</template>

<style scoped></style>
