<script setup lang="ts">
import { z } from "zod";
import type {
  FormSubmitEvent,
  RadioGroupItem,
  RadioGroupValue,
} from "@nuxt/ui";
import { useSystemUserStore } from "~/store/systemUserStore";
import type { AssignRole, UserCreateCredential } from "~/store/systemUserStore";

const props = defineProps<{
  title: string;
  content?: string;
  loading?: boolean;
  data?: any;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
}>();

// const emit = defineEmits<{ close: [boolean] }>();

const emit = defineEmits<{ close: [boolean] }>();

interface RoleMapping {
  id: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

const role = ref<RoleMapping>({
  id: "",
  name: "",
  description: "",
  composite: false,
  clientRole: false,
  containerId: "",
});

const items = ref<RadioGroupItem[]>(["AssignOne", "AssignMulti"]);
const value = ref<RadioGroupValue>("");
const checkBoxvalue = ref<boolean>(false);

const selectedUserType = ref<RoleMapping[]>([]);
const selectedUserTypeMulti = ref<RoleMapping[]>([]);
const selectedRoleIds = ref<string[]>([]);

const toast = useToast();

const {
  //state
  roles,
  assignCredential,

  //action
  getRoles,
  userCreateCredential,
  assignRoleCredential,
} = useSystemUserStore();

const userTypeOptions = computed(() => {
  return roles.map((role) => {
    return {
      label: role.name,
      value: role.id,
    };
  });
});

const assignSchema = z.object({
  userType: z.string().nonempty(),
});

type Schema = z.output<typeof assignSchema>;

const state = reactive<Partial<Schema>>({
  userType: "",
});

const handleSelectedUserType = (userType: string) => {
  role.value = roles.find((role) => role.id === userType) || role.value;

  selectedUserType.value = [];
  selectedUserType.value.push(role.value);
};

const handleSelectedUserTypeMulti = (selectedIds: string[]) => {
  selectedUserTypeMulti.value = selectedIds
    .map((id) => roles.find((role) => role.id === id))
    .filter(Boolean) as RoleMapping[];

  // const roleToggle = (role.value =
  //   roles.find((role) => role.id === userType) || role.value);

  // console.log(roleToggle);

  // if (!roleToggle) return;

  // const existingIndex = selectedUserTypeMulti.value.findIndex(
  //   (selected) => selected.id === roleToggle.id
  // );

  // if (existingIndex !== -1) {
  //   selectedUserTypeMulti.value.slice(existingIndex, 1);
  // } else {
  //   selectedUserTypeMulti.value.push(roleToggle);
  // }
};

const handleSubmit = async () => {
  if (value.value === "AssignOne") {
    await assignRoleCredential(props.data.user.id, selectedUserType.value)
      .then(() => {
        emit("close", true);
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (value.value === "AssignMulti") {
    if (selectedRoleIds.value.length === 0) {
      toast.add({
        title: "Error",
        description: "Please select user type",
        color: "error",
      });
      return;
    }

    await assignRoleCredential(props.data.user.id, selectedUserTypeMulti.value)
      .then(() => {
        emit("close", true);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log(value.value);

    toast.add({
      title: "Error",
      description: "Please select user type",
      color: "error",
    });
  }
};

onMounted(async () => {
  // const { user } = useAuth();
  await getRoles();
});

watch(
  [role],
  (newVal, oldVal) => {
    console.log(newVal, oldVal);
  },
  {
    immediate: true,
  }
);

watch(
  selectedUserTypeMulti,
  (newValue, oldValue) => {
    console.log(newValue, oldValue);
  },
  { deep: true }
);

watch(
  selectedRoleIds,
  (newValue) => {
    selectedUserTypeMulti.value = newValue
      .map((id) => roles.find((role) => role.id === id))
      .filter(Boolean) as RoleMapping[];
  },
  { deep: true }
);
</script>

<template>
  <UModal
    :dismissible="false"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :on-ok="onOk"
    :on-cancel="onCancel"
  >
    <template #body>
      <URadioGroup
        v-model="value"
        :items="items"
        orientation="horizontal"
        class="flex flex-col text-sm text-gray-500"
      />
      <div class="flex flex-col text-sm text-gray-500">
        <!-- <p class="border-white">id:{{ data.user.id }}</p> -->

        <UForm
          :state="state"
          :schema="assignSchema"
          class="space-y-4 mt-2"
          @submit.prevent="handleSubmit"
        >
          <div v-if="value === ''">
            <UAlert
              title="Heads up!"
              description="Please select assign role"
              icon="i-lucide-rocket"
              variant="outline"
              :ui="{
                icon: 'size-11',
              }"
            />
          </div>
          <div v-else-if="value === 'AssignOne'" class="mt-5">
            <UFormField :name="state.userType" label="UserType" required>
              <USelectMenu
                v-model="state.userType"
                value-key="value"
                :items="userTypeOptions"
                placeholder="Select user type"
                icon="i-heroicons-shield-check"
                size="md"
                class="w-full mb-[.2rem]"
                @change.prevent="handleSelectedUserType(state.userType)"
              >
              </USelectMenu>
            </UFormField>
          </div>

          <div v-else-if="value === 'AssignMulti'" class="flex flex-col">
            <UCheckboxGroup
              v-model="selectedRoleIds"
              :items="userTypeOptions"
              variant="card"
              D
              size="xs"
              icon="i-heroicons-shield-check"
              @change="handleSelectedUserTypeMulti(selectedRoleIds)"
            >
            </UCheckboxGroup>
          </div>

          <div class="flex gap-2 justify-end">
            <UButton
              icon="i-heroicons-x-mark"
              variant="outline"
              color="error"
              label="Cancel"
              class="cursor-pointer"
              @click="emit('close', false)"
            />
            <UButton
              class="cursor-pointer"
              icon="i-heroicons-document-check"
              color="primary"
              label="Success"
              type="submit"
            />
          </div>
        </UForm>
      </div>
    </template>
    <template #footer> </template>
  </UModal>
</template>

<style scoped></style>
