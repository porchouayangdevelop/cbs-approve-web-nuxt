<template>
  <div class="">
    <div class="flex-1 flex flex-col justify-center px-6 lg:px-0">
      <div class="">
        <div class="">
          <div>
            <UCard class="shadow-xl">
              <template #header>
                <div class="text-center">
                  <div class="flex items-center justify-center mb-2">
                    <UIcon
                      name="i-heroicons-check-circle"
                      class="w-6 h-6 text-green-500 mr-2"
                    />
                    <span class="text-green-600 font-medium"
                      >Create a user
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Fill in new user information
                  </p>
                </div>
              </template>

              <UForm
                :schema="registerSchema"
                :state="state"
                @submit="handleRegister"
                class="space-y-4"
              >
                <!-- <UFormField label="UserType" name="userType" required>
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
                </UFormField> -->

                <!-- Personal Information -->
                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="FirstName" name="firstName" required>
                    <UInput
                      v-model="state.firstName"
                      placeholder="First name"
                      icon="i-heroicons-user"
                      class="w-full mb-[.2rem]"
                    />
                  </UFormField>

                  <UFormField label="LastName" name="lastName" required>
                    <UInput
                      v-model="state.lastName"
                      placeholder="Last name"
                      class="w-full mb-[.2rem]"
                    />
                  </UFormField>
                </div>

                <!-- Username -->
                <UFormField label="Username" name="username" required>
                  <UInput
                    v-model="state.username"
                    placeholder="Username for login"
                    icon="i-heroicons-at-symbol"
                    class="w-full mb-[.2rem] normal-case"
                  />
                </UFormField>

                <!-- Email -->
                <UFormField label="Email" name="email" required>
                  <UInput
                    v-model="state.email"
                    type="email"
                    placeholder="example@company.com"
                    icon="i-heroicons-envelope"
                    class="w-full mb-[.2rem]"
                  />
                </UFormField>

                <!-- Password -->
                <UFormField label="Password" name="password" required>
                  <UInput
                    v-model="state.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password"
                    icon="i-heroicons-lock-closed"
                    class="w-full mb-[.2rem]"
                  >
                    <template #trailing>
                      <UButton
                        variant="ghost"
                        size="xs"
                        :icon="
                          showPassword
                            ? 'i-heroicons-eye-slash'
                            : 'i-heroicons-eye'
                        "
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </UInput>
                </UFormField>

                <!-- Password Strength Indicator -->
                <div v-if="state.password" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-600 dark:text-gray-400"
                      >Password strength</span
                    >
                    <span
                      :class="[
                        'text-xs font-medium',
                        passwordStrength.score >= 3
                          ? 'text-green-600'
                          : passwordStrength.score >= 2
                            ? 'text-yellow-600'
                            : 'text-red-600',
                      ]"
                    >
                      {{ passwordStrength.label }}
                    </span>
                  </div>
                  <div
                    class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                  >
                    <div
                      :class="[
                        'h-2 rounded-full transition-all duration-300',
                        passwordStrength.score >= 3
                          ? 'bg-green-500'
                          : passwordStrength.score >= 2
                            ? 'bg-yellow-500'
                            : 'bg-red-500',
                      ]"
                      :style="{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                      }"
                    ></div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex flex-row gap-1">
                  <UButton
                    type="submit"
                    :loading="loading"
                    :disabled="loading || !isFormValid"
                    color="primary"
                    class="cursor-pointer"
                    variant="outline"
                  >
                    <template #leading>
                      <UIcon v-if="!loading" name="i-heroicons-user-plus" />
                    </template>
                    <span v-if="!loading">Create User Account</span>
                    <span v-else>Creating account...</span>
                  </UButton>
                  <UButton
                    class="cursor-pointer"
                    icon="i-lucide-list-restart"
                    variant="outline"
                    color="error"
                    @click="resetForm"
                  >
                    Reset
                  </UButton>
                  <UButton
                    class="cursor-pointer"
                    icon="i-lucide-arrow-left"
                    variant="subtle"
                    color="secondary"
                    @click="router.back()"
                  >
                    Back
                  </UButton>
                </div>
              </UForm>
            </UCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Open modal -->
    <!-- <ConfrimModal
      v-model="showConfirmModal"
      title="Confirm User Creation"
      :message="confirmMessage"
      ok-text="Create User"
      cancel-text="Cancel"
      loading-text="Creating user..."
      @confirm="handleRegister"
      @cancel="handleModalCancel"
    >
      <template #content>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h4 class="font-medium text-gray-900 dark:text-white">
            User Details:
          </h4>
          <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              <span class="font-medium">Name:</span> {{ state.firstName }}
              {{ state.lastName }}
            </p>
            <p>
              <span class="font-medium">Username:</span> {{ state.username }}
            </p>
            <p><span class="font-medium">Email:</span> {{ state.email }}</p>
          </div>
        </div>
      </template>
    </ConfrimModal> -->
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { useDepartmentWithSignUp } from "~/composables/useDepartmentWithSignUp";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useSystemUserStore } from "~/store/systemUserStore";
import type { AssignRole, UserCreateCredential } from "~/store/systemUserStore";

definePageMeta({
  layout: "admin-session", // Use admin session layout
  middleware: ["auth-guard", "admin-guard"], // Require authentication to access
});

import { LazyModalsConfrimModal } from "#components";
import ConfrimModal from "~/components/modals/ConfrimModal.vue";

interface RoleMapping {
  id: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

// State
const isAdminVerified = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showConfirmModal = ref(false);
const selectedUserType = ref<RoleMapping[]>([]);
const role = ref<RoleMapping>({
  id: "",
  name: "",
  description: "",
  composite: false,
  clientRole: false,
  containerId: "",
});

const overlay = useOverlay();
const modal = overlay.create(LazyModalsConfrimModal);
const toast = useToast();
const router = useRouter();

const {
  //state
  roles,
  assignCredential,

  //action
  getRoles,
  userCreateCredential,
  assignRoleCredential,
} = useSystemUserStore();

// Options
const userTypeOptions = computed(() => {
  return roles.map((role) => {
    return {
      label: role.name,
      value: role.id,
    };
  });
});

// Validation schema
const registerSchema = z.object({
  // userType: z.string().min(1, "User type is required."),
  firstName: z
    .string()
    .min(2, "First name must contain at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters long."),
  username: z.string().min(8, "Username must contain at least 8 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});
//     .refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"]
// })

type Schema = z.output<typeof registerSchema>;

const state = reactive<Partial<Schema>>({
  // userType: "",
  firstName: undefined,
  lastName: undefined,
  username: undefined,
  email: undefined,
  password: undefined,
});

// Computed
const isFormValid = computed(() => {
  try {
    registerSchema.parse(state);
    return true;
  } catch {
    return false;
  }
});

const passwordStrength = computed(() => {
  const password = state.password;
  if (!password)
    return {
      score: 0,
      label: "Very soft",
    };
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  const labels = ["Very soft", "Weak", "Medium", "Strong", "Very strong"];
  return {
    score,
    label: labels[score] || "Very soft",
  };
});

const confirmMessage = computed(() => {
  return `Are you sure you want to create a new user account for ${state.firstName} ${state.lastName}?`;
});

const handleSelectedUserType = (userType: string) => {
  role.value = roles.find((role) => role.id === userType) || role.value;

  selectedUserType.value = [];
  selectedUserType.value.push(role.value);

  console.log(selectedUserType.value);
};

const resetForm = () => {
  state.firstName = "";
  state.lastName = "";
  state.email = "";
  state.username = "";
  state.password = "";
};

const openModal = async () => {
  try {
    registerSchema.parse(state);
    const instance = modal.open({
      modelValue: showConfirmModal.value,
      title: "Confirm User Creation",
      cancelText: "Cancel",
      message: confirmMessage.value,
      loadingText: "Create User...",
      okText: "Confirm",
      dismissible: true,
    });

    const shouldConfirm = await instance.result;

    if (shouldConfirm) {
      handleRegister();
    }

    handleModalCancel();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      toast.add({
        icon: "i-heroicons-exclamation-circle",
        title: "Validation Error",
        description: firstError.message,
        color: "error",
      });
    }
  }
};

const handleModalCancel = () => {
  toast.add({
    title: "User creation cancelled",
    description: "No user account was created",
    icon: "i-heroicons-x-circle",
    color: "error",
  });
};

const generateEmail = () => {
  return state.username + "@gmail.com";
};

const handleRegister = async () => {
  loading.value = true;
  try {
    // Validate form data
    const validatedData = registerSchema.parse(state);

    const register: UserCreateCredential = {
      username: validatedData.username,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: "password",
          value: validatedData.password,
          temporary: false,
        },
      ],
    };

    await userCreateCredential(register).then(async (response) => {
      // await assignRoleCredential(response.id, selectedUserType.value);
      loading.value = false;
      // Show success message
      toast.add({
        icon: "i-heroicons-check-circle",
        title: "Account created successfully",
        description: `Created user for ${validatedData.firstName} ${validatedData.lastName}`,
        color: "success",
      });

      // navigateTo("/admin/users", { replace: true });
      // router.back();
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    const toast = useToast();
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      toast.add({
        icon: "i-heroicons-exclamation-circle",
        title: "Validation Error",
        description: firstError.message,
        color: "error",
      });
    } else {
      toast.add({
        icon: "i-heroicons-exclamation-circle",
        title: "Unable to create account",
        description:
          error.message ||
          "An error occurred while creating your account. Please try again.",
        color: "error",
      });
    }
  } finally {
    loading.value = false;
  }
};

// Check if user is admin on mount
onMounted(async () => {
  const { user } = useAuth();
  await getRoles();

  // If user is already logged in and is admin, skip verification
  if (user.value && user.value.role === "admin") {
    isAdminVerified.value = true;
  }
});

// SEO
useSeoMeta({
  title: "Create a user account",
  description:
    "Create a new user account for the CBS Approve Web system (administrators only)",
  robots: "noindex,nofollow",
});
</script>
<style scoped></style>
