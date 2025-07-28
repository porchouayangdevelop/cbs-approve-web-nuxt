<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

import {
  useSystemUserStore,
  type UserEditCredential,
  type RoleMapping,
} from "~/store/systemUserStore";
import { z } from "zod";
import type { RadioGroupItem, RadioGroupValue } from "@nuxt/ui";

const store = useSystemUserStore();
const { user, loading, roles } = storeToRefs(useSystemUserStore());
const { updateUser, getUser, getRoles } = store;
const { isAuthenticated, isLoading, user: autUser } = useAuth();

const toast = useToast();
const route = useRoute();

//state
const checkBoxValue = ref(false);
const switchValue = ref(false);
const userRoleType = ref("");

const role = ref<RoleMapping>({
  id: "",
  name: "",
  description: "",
  composite: false,
  clientRole: false,
  containerId: "",
});

const selectedRoleIds = ref<string[]>([]);
const selectedUserRoleType = ref<RoleMapping[]>([]);
const selectedUserRoleTypes = ref<RoleMapping[]>([]);

const radioItem = ref<RadioGroupItem[]>(["One", "Multi"]);
const radioValue = ref("");

// getters
const userData = computed(() => {
  if (!autUser.value && !user.value) return {};
  return {
    username: user.value.username,
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    enabled: user.value.enabled,
    emailVerified: user.value.emailVerified,
  };
});

const updateSchema = z.object({
  username: z.string(),
  firstName: z
    .string()
    .min(3, "Firstname must contain a least 3 characters or invalid"),
  lastName: z
    .string()
    .min(2, "LastName must contain a least 3 characters or invalid"),
  enabled: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

type Schema = z.output<typeof updateSchema>;

const state = reactive<Partial<Schema>>({
  username: undefined,
  firstName: undefined,
  lastName: undefined,
  enabled: undefined,
  emailVerified: undefined,
});

const isFormValid = computed(() => {
  try {
    updateSchema.parse(state);
    return true;
  } catch {
    return false;
  }
});

const userRoleTypeOptions = computed(() => {
  return roles.value.map((role) => {
    return {
      label: role.name,
      value: role.id,
    };
  });
});

//method

const initialData = async (id: string) => {
  try {
    await getUser(id);
  } catch (error) {}
};

const handleChangeEnable = (): boolean => {
  if (userData.value.enabled === true) {
    return true;
  } else {
    return false;
  }
};

const handleChangeEmailVerify = (): boolean => {
  if (userData.value.emailVerified === true) {
    return true;
  } else {
    return false;
  }
};

const handleSelectedUserRoleType = (userType: string) => {
  role.value = roles.value.find((role) => role.id === userType) || role.value;
  selectedUserRoleType.value = [];
  selectedUserRoleType.value.push(role.value);
};

const handleSelectedUserRoleTypes = (selectedIds: string[]) => {
  selectedUserRoleTypes.value = selectedIds
    .map((id) => roles.value.find((role) => role.id === id))
    .filter(Boolean) as RoleMapping[];
};

const handleSubmit = () => {
  try {
    loading.value = true;
    const credential: UserEditCredential = {
      username: userData.value.username as string,
      firstName: userData.value.firstName,
      lastName: userData.value.lastName,
      enabled: handleChangeEnable(),
      emailVerified: handleChangeEmailVerify(),
    };

    updateUser(route.params.id as string, credential)
      .then((res) => {
        const { invalidateCache } = useSystemUserStore();
        invalidateCache();
        toast.add({
          title: "Success",
          description: "Update user success",
          icon: "i-heroicons-check",
          color: "success",
          duration: 100,
        });
        if (process.client) {
          window.history.replaceState(
            { ...window.history.state, refreshUsers: true },
            "",
            window.location.href
          );
        }

        useGoBack().goBack();
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "Update user error",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
      duration: 100,
    });
  } finally {
    loading.value = false;
  }
};

// hook
onMounted(() => {
  const id = route.params.id as string;
  initialData(id);
  getRoles();
});

//watcher

watch(user, (newUser) => {
  console.log(newUser);
});
</script>

<template>
  <div class="space-y-1">
    <div class="">
      <UCard shadow="xl">
        <template #header>
          <div class="text-center">
            <div class="flex items-center justify-center mb-2">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-6 h-6 text-green-500 mr-2"
              />
              <span class="text-green-600 font-medium">Update a user </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Fill in user information
            </p>
          </div>
        </template>
        <template #default>
          <u-form
            :state="userData"
            :schema="updateSchema"
            @submit="handleSubmit"
          >
            <u-form-field label="Username" name="Username" required>
              <u-input
                class=""
                disabled
                v-model="userData.username"
                variant="outline"
                icon="i-heroicons-user"
              />
            </u-form-field>

            <div class="grid grid-cols-2 gap-4 my-2">
              <u-form-field label="FirstName" name="firstName" required>
                <u-input
                  class="w-full"
                  v-model="userData.firstName"
                  variant="outline"
                  icon="i-heroicons-user"
                />
              </u-form-field>

              <u-form-field label="LastName" name="lastName" required>
                <u-input
                  class="w-full"
                  v-model="userData.lastName"
                  variant="outline"
                />
              </u-form-field>
            </div>

            <div class="flex flex-row gap-2">
              <u-form-field name="emailVerified" required>
                <u-checkbox
                  v-model="userData.emailVerified"
                  label="Verify email?"
                />
              </u-form-field>

              <u-form-field name="enable" required>
                <u-switch v-model="userData.enabled" label="Enable?" />
              </u-form-field>
            </div>

            <!-- <div class="mt-2">
              <UFormField label="Roles">
                <URadioGroup
                  orientation="horizontal"
                  v-model="radioValue"
                  :items="radioItem"
                >
                </URadioGroup>
              </UFormField>

              <div v-if="radioValue === 'One'">
                <USelectMenu
                  v-model="userRoleType"
                  :items="userRoleTypeOptions"
                  value-key="value"
                  placeholder="select a role"
                  icon="i-heroicons-shield-check"
                  size="md"
                  class="w-full mb-[.2rem]"
                  @change="handleSelectedUserRoleType(userRoleType)"
                />
              </div>
              <div v-else-if="radioValue === 'Multi'">
                <UCheckboxGroup
                  class="grid-cols-4"
                  v-model="selectedRoleIds"
                  :items="userRoleTypeOptions"
                  variant="card"
                  size="sm"
                  icon="i-heroicons-shield-check"
                  @change="handleSelectedUserRoleTypes(selectedRoleIds)"
                />
              </div>
            </div> -->

            <div class="flex gap-1 mt-3">
              <u-button
                class="cursor-pointer"
                variant="outline"
                icon="i-heroicons-pencil-square"
                type="submit"
                >Update</u-button
              >
              <go-back
                icon="i-heroicons-arrow-left"
                label="Back"
                size="sm"
                variant="outline"
                color="neutral"
              />
            </div>
          </u-form>
        </template>
      </UCard>
    </div>
  </div>
</template>

<style scoped></style>
