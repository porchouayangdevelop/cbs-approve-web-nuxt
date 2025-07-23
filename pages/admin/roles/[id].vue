<script setup lang="ts">
import { useSystemUserStore } from "~/store/systemUserStore";

definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

const route = useRoute();

const store = useSystemUserStore();
const { roles } = storeToRefs(useSystemUserStore());
const { getRole } = store;

const role = computed(() => {
  return roles.value.find((role: any) => role.id === route.params.id);
});

onMounted(async () => {
  await getRole(route.params.id as string);
});

watch(role, (newRole) => {
  if (newRole) {
    console.log(newRole);
  }
});
</script>

<template>
  <div>Page: admin/roles/[id] - View</div>
  <div>
    <h1>{{ role }}</h1>
  </div>
</template>

<style scoped></style>
