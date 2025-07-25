<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

import {
  useSystemUserStore,
  type UserEditCredential,
} from "~/store/systemUserStore";
import { z } from "zod";

const store = useSystemUserStore();
const { user, loading } = storeToRefs(useSystemUserStore());
const { updateUser, getUser } = store;
const { isAuthenticated, isLoading, user: autUser } = useAuth();

const toast = useToast();
const route = useRoute();

//state
const checkBoxValue = ref(false);
const switchValue = ref(false);

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
        toast.add({
          title: "Success",
          description: "Update user success",
          icon: "i-heroicons-check",
          color: "success",
          duration: 100,
        });
        useGoBack().goBack();
        console.log(res);
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
});

//watcher

watch(user, (newUser) => {
  console.log(newUser);
});
</script>

<template>
  <div class="space-y-1">
    <div class="">
      <UCard>
        <template #header>
          <h3>Update User</h3>
          <!-- <u-separator orientation="horizontal" color="secondary" /> -->
        </template>
        <template #default>
          <u-form
            :state="userData"
            :schema="updateSchema"
            @submit="handleSubmit"
          >
            <u-form-field label="Username" name="Username" required>
              <u-input disabled v-model="userData.username" variant="outline" />
            </u-form-field>

            <u-form-field label="FirstName" name="firstName" required>
              <u-input v-model="userData.firstName" variant="outline" />
            </u-form-field>

            <u-form-field label="LastName" name="lastName" required>
              <u-input v-model="userData.lastName" variant="outline" />
            </u-form-field>

            <div class="flex flex-row gap-2">
              <u-form-field label="Enable" name="enable" required>
                <u-switch v-model="userData.enabled" label="Verify email" />
              </u-form-field>

              <u-form-field label="Username" name="Username" required>
                <u-checkbox
                  v-model="userData.emailVerified"
                  label="Verify email"
                />
              </u-form-field>
            </div>

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
