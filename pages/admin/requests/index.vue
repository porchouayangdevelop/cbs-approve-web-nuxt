<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

interface TabItem {
  label: string;
  description: string;
  icon: string;
  slot: any;
  bage: string;
}

interface RequestItem {
  id: string;
  createdAt: string | number;
  createdBy: string;
  approvalBranch: string;
  hrDepartment: string;
  itDeparment: string;
  createdUnit: string;
}

import type { TabsItem } from "@nuxt/ui";

const Items = computed(() => {
  return [
    {
      label: "ລາຍການຂໍເປີດແທວເລີ",
      description: "",
      icon: "i-lucide-user-plus",
      slot: "Open" as const,
    },
    {
      label: "ລາຍການຂໍປົດລ໋ອກແທວເລີ",
      description: "",
      icon: "i-lucide-user-cog",
      slot: "Unlock" as const,
    },
    {
      label: "ລາຍການຂໍປັບປຸງແທວເລີ",
      description: "",
      icon: "i-lucide-user-pen",
      slot: "Update" as const,
    },
  ] satisfies TabsItem;
});

const requestData = computed((): RequestItem[] => {
  return [
    {
      id: "1",
      createdAt: 20250729,
      createdBy: "ທ່ານ ສັງຄົມ ສົມສຸກ",
      approvalBranch: "ທ່ານ ວິໄລກອນ ອິນສຸວົງ",
      hrDepartment: "ທ່ານ ນາງ ສຸລິລຳມອນ ວິໄລວຽງ",
      itDeparment: "ທ່ານ ນາງ ລັດຕະນາ ສຸພາພັນ",
      createdUnit: "ໜ່ວຍບໍລິການ ຊຽງຮ່ອນ",
    },
    {
      id: "2",
      createdAt: 20250729,
      createdBy: "ທ່ານ ນາງ ມີນາ ວິໄລສັກ",
      approvalBranch: "ທ່ານ ວິໄລກອນ ອິນສຸວົງ",
      hrDepartment: "ທ່ານ ນາງ ສຸລິລຳມອນ ວິໄລວຽງ",
      itDeparment: "ທ່ານ ນາງ ລັດຕະນາ ສຸພາພັນ",
      createdUnit: "ໜ່ວຍບໍລິການ ຊຽງຮ່ອນ",
    },
    {
      id: "3",
      createdAt: 20250729,
      createdBy: "ທ່ານ ນ ປະລິນຍາ ແກ້ວບຸນມີ",
      approvalBranch: "ທ່ານ ວິໄລກອນ ອິນສຸວົງ",
      hrDepartment: "ທ່ານ ນາງ ສຸລິລຳມອນ ວິໄລວຽງ",
      itDeparment: "ທ່ານ ນາງ ລັດຕະນາ ສຸພາພັນ",
      createdUnit: "ໜ່ວຍບໍລິການ ຊຽງຮ່ອນ",
    },

    {
      id: "4",
      createdAt: 20250729,
      createdBy: "ທ່ານ ພຸດສະດາ ແກ້ວວິໄລ",
      approvalBranch: "ທ ຂັນແກ້ວ ໄຊຍະສິດ",
      hrDepartment: "ທ່ານ ນາງ ສຸລິລຳມອນ ວິໄລວຽງ",
      itDeparment: "ທ່ານ ນາງ ລັດຕະນາ ສຸພາພັນ",
      createdUnit: "ໜ່ວຍບໍລິການເມືອງຊຽງເງິນ",
    },
    {
      id: "5",
      createdAt: 20250729,
      createdBy: "ທ່ານ ນ ມະ​ນີ​ລັດ ວິ​ລະ​ພັນ",
      approvalBranch: "ທ ພອນໄຊ ທຳມະວົງ",
      hrDepartment: "ທ່ານ ນາງ ສຸລິລຳມອນ ວິໄລວຽງ",
      itDeparment: "ທ່ານ ນາງ ລັດຕະນາ ສຸພາພັນ",
      createdUnit: "ສາຂາບໍ່ແກ້ວ",
    },
  ];
});

const requestColumns = computed((): TableColumn<RequestItem>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => getHeader(column, "id", "left"),
    cell: ({ row }) => `${row.getValue("id")}`,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => getHeader(column, "createdAt", "left"),
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "approvalBranch",
    header: ({ column }) => getHeader(column, "createdBy", "left"),
    cell: ({ row }) => `${row.getValue("approvalBranch")}`,
  },
  {
    accessorKey: "hrDepartment",
    header: ({ column }) => getHeader(column, "createdBy", "left"),
    cell: ({ row }) => `${row.getValue("hrDepartment")}`,
  },
  {
    accessorKey: "itDeparment",
    header: ({ column }) => getHeader(column, "createdBy", "left"),
    cell: ({ row }) => `${row.getValue("itDeparment")}`,
  },
  {
    accessorKey: "createdUnit",
    header: ({ column }) => getHeader(column, "createdBy", "left"),
    cell: ({ row }) => `${row.getValue("createdUnit")}`,
  },
  {
    accessorKey: "action",
    id: "Action",
    header: ({ column }) =>
      h("div", { class: "text-right" }, getHeader(column, "Action", "right")),
    // cell: ({ row }) => `${row.getValue("createdBy")}`,
  },
]);

const getHeader = (
  columns: Column<RequestItem>,
  label: string,
  position: "left" | "right"
) => {
  const isPinned = columns.getIsPinned();

  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,
    icon: isPinned ? "i-lucide-pin-off" : "i-lucide-pin",
    class: "-mx-2.5",
    onClick() {
      columns.pin(isPinned === position ? false : position);
    },
  });
};

const columnPinning = ref({
  left: [],
  right: ["amount"],
});

const state = reactive({
  name: "",
  username: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const viewRequest = (id: string) => {
  const router = useRouter();
  router.push({
    name: "admin-requests-id",
    params: {
      id: id,
    },
  });
};
</script>

<template>
  <div class="">
    <UCard variant="subtle">
      <template #header>
        <h3 class="text-h3 font-bold">
          ເອກກະສານຂໍເປີດເທວເລີ ແລະ ຂໍປົດລ໋ອກເທວເລີ ສາຂາ
        </h3>
      </template>
      <template #default>
        <UTabs
          :items="Items"
          variant="link"
          :ui="{ trigger: '' }"
          class="gap-4"
        >
          <template #Open="{ item }">
            <RequestUtableRequest :data="requestData" :columns="requestColumns">
              <template #id-header="{ header }">
                <div class="w-1">{{ header.id }}</div>
              </template>
              <template #id-cell="{ row }">
                <div class="w-1">{{ row.getValue("id") }}</div>
              </template>
              <template #action-header="{ header }">
                <div class="text-right"></div>
              </template>
              <template #action-cell="{ row }">
                <div class="flex justify-end">
                  <UButton
                    icon="i-lucide-eye"
                    variant="ghost"
                    size="sm"
                    class="cursor-pointer"
                    @click="viewRequest(row.getValue('id'))"
                  />
                </div>
              </template>
            </RequestUtableRequest>
          </template>
          <template #Unlock="{ item }">
            request Unlock teller
            {{ item }}
          </template>
          <template #Update="{ item }">
            request Update teller
            {{ item }}
          </template>
        </UTabs>
      </template>
    </UCard>
  </div>
</template>

<style scoped></style>
