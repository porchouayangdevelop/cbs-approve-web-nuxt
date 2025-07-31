<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding (Blue Theme) -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden"
    >
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 text-white">
        <div class="max-w-md">
          <!-- Logo -->
          <div class="flex items-center mb-8">
            <div
              class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4"
            >
              <UIcon name="i-heroicons-user-plus" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-2xl font-bold">CBS Approve Web</h1>
          </div>

          <!-- Hero Content -->
          <h2 class="text-4xl font-bold mb-6 leading-tight">
            Join our
            <span class="text-blue-200">Community</span>
          </h2>
          <p class="text-xl text-blue-100 mb-8 leading-relaxed">
            Create your account and become part of our efficient approval
            management system.
          </p>

          <!-- Features -->
          <div class="space-y-4">
            <div class="flex items-center">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-blue-200 mr-3"
              />
              <span class="text-blue-100">
                Streamlined approval processes
              </span>
            </div>
            <div class="flex items-center">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-blue-200 mr-3"
              />
              <span class="text-blue-100"> Real-time status tracking </span>
            </div>
            <div class="flex items-center">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-blue-200 mr-3"
              />
              <span class="text-blue-100"> Secure and reliable platform </span>
            </div>
            <div class="flex items-center">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-blue-200 mr-3"
              />
              <span class="text-blue-100"> 24/7 customer support </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-5 rounded-full -translate-y-48 translate-x-48"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"
      ></div>
    </div>

    <!-- Right Side - Register Form -->
    <div
      class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div
            class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3"
          >
            <UIcon name="i-heroicons-user-plus" class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            CBS Approve Web
          </h1>
        </div>
      </div>

      <!-- Register Form Component -->
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm
          ref="registerFormRef"
          title="Create Your Account"
          subtitle="Join CBS Approve Web today"
          @register="handleRegister"
          @login="handleLogin"
          @help="handleHelp"
          @contact="handleContact"
          @view-terms="handleViewTerms"
          @view-privacy="handleViewPrivacy"
        />
      </div>

      <!-- Loading indicator for registration operations -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3 min-w-[300px]"
        >
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
          ></div>
          <span class="text-gray-900 dark:text-white">{{
            loadingMessage
          }}</span>
        </div>
      </div>

      <!-- Registration Information -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <UCard
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-start space-x-3">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-blue-500 mt-0.5"
            />
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-medium mb-1">Account Approval Process:</p>
              <p>
                After registration, your account will be reviewed by our
                administrators. You'll receive an email notification once your
                account is approved and ready to use.
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Footer Links -->
      <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 CBS Approve Web. All rights reserved.</p>
        <div class="mt-2 space-x-4">
          <UButton
            variant="link"
            size="xs"
            @click="handleHelp"
            class="text-blue-600 hover:text-blue-500"
            >Help</UButton
          >
          <UButton
            variant="link"
            size="xs"
            @click="handleContact"
            class="text-blue-600 hover:text-blue-500"
            >Contact</UButton
          >
          <UButton
            variant="link"
            size="xs"
            @click="handleViewTerms"
            class="text-blue-600 hover:text-blue-500"
            >Terms</UButton
          >
          <UButton
            variant="link"
            size="xs"
            @click="handleViewPrivacy"
            class="text-blue-600 hover:text-blue-500"
            >Privacy</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from "~/components/auth/RegisterForm.vue";

definePageMeta({
  layout: false,
  middleware: [],
});

// Types
interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  password: string;
  acceptTerms: boolean;
}

// State
const registerFormRef = ref();
const isLoading = ref(false);
const loadingMessage = ref("Creating account...");

// Event handlers
const handleRegister = async (credentials: RegisterCredentials) => {
  try {
    registerFormRef.value?.setLoading(true);
    isLoading.value = true;
    loadingMessage.value = "Creating your account...";

    // Simulate registration API call
    // Replace this with your actual registration service
    await new Promise((resolve) => setTimeout(resolve, 2000));

    loadingMessage.value = "Setting up your profile...";

    // Here you would typically call your registration API
    // const { register } = useAuth()
    // await register(credentials)

    // Simulate success response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    const toast = useToast();
    toast.add({
      icon: "i-heroicons-check-circle",
      title: "Registration successful!",
      description: "Your account has been created and is pending approval.",
      color: "success",
    });

    // Redirect to login page with success message
    await navigateTo("/auth/login?registered=true");
  } catch (error: any) {
    console.error("Registration error:", error);

    // Show error message
    let errorMessage = "There was an error creating your account.";

    if (error?.response?.status === 409) {
      errorMessage = "Username or email already exists";
    } else if (error?.response?.status === 400) {
      errorMessage = "Invalid registration data";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    registerFormRef.value?.setError(errorMessage);

    const toast = useToast();
    toast.add({
      icon: "i-heroicons-exclamation-circle",
      title: "Registration failed",
      description: errorMessage,
      color: "error",
    });
  } finally {
    registerFormRef.value?.setLoading(false);
    isLoading.value = false;
  }
};

const handleLogin = () => {
  navigateTo("/auth/login");
};

const handleHelp = () => {
  navigateTo("/help");
};

const handleContact = () => {
  navigateTo("/contact");
};

const handleViewTerms = () => {
  // You can open in new tab or navigate to terms page
  window.open("/terms-of-service", "_blank");
};

const handleViewPrivacy = () => {
  // You can open in new tab or navigate to privacy page
  window.open("/privacy-policy", "_blank");
};

// SEO
useSeoMeta({
  title: "Register - CBS Approve Web",
  description:
    "Create your account to access the CBS Approve Web approval management system",
});
</script>
