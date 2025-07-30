<script setup lang="ts">
import { z } from "zod";

interface Props {
  title?: string;
  subtitle?: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
  submitText?: string;
  loadingText?: string;
  showRegisterLink?: boolean;
  showHelpLinks?: boolean;
  showLoginLink?: boolean;
}

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  department?: string;
  position?: string;
  password: string;
}

const props = withDefaults(defineProps<Props>(), {
  showLoginLink: true,
  showHelpLinks: true,
});

const emit = defineEmits<{
  register: [credentials: RegisterCredentials];
  help: [];
  contact: [];
  login: [];
}>();

const registerForm = ref<RegisterCredentials>({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  password: "",
});

const loading = ref<boolean>(false);
const showPassword = ref(false);
const errorMessage = ref("");

const registerSchema = z.object({
  firstName: z.string().min(1, "please enter firstName"),
  lastName: z.string().min(1, "please enter lastname"),
  username: z
    .string()
    .min(5, "username must be least 5 characters.")
    .max(8, "username must less then 8 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

const isFormValid = computed(() => {
  try {
    registerSchema.parse(registerForm.value);
  } catch {
    return false;
  }
});

const hanleRegister = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  errorMessage.value = "";
  try {
    const validate = registerSchema.parse(registerForm);

    emit("register", validate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errorMessage.value = "Incorrect ";
    } else {
      errorMessage.value = "There was an error in register.";
    }
    console.error("Register form error:", error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  registerForm.value = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    password: "",
  };
};

const setLoading = (state: boolean) => (loading.value = state);
const setError = (message: string) => (errorMessage.value = message);

defineExpose({
  resetForm,
  setLoading,
  setError,
});
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <u-card class="shadow-xl">
      <template #header>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:white">
            {{ title || "Sign Up" }}
          </h3>
        </div>
      </template>
    </u-card>
  </div>
</template>

<style scoped></style>
