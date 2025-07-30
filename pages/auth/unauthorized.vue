<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding (similar to login page) -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden"
    >
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 text-white">
        <div class="max-w-md">
          <!-- Logo -->
          <div class="flex items-center mb-8">
            <div
              class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4"
            >
              <UIcon
                name="i-heroicons-shield-exclamation"
                class="w-7 h-7 text-white"
              />
            </div>
            <h1 class="text-2xl font-bold">CBS Approve Web</h1>
          </div>

          <!-- Hero Content -->
          <h2 class="text-4xl font-bold mb-6 leading-tight">
            Access
            <span class="text-red-200">Restricted</span>
          </h2>
          <p class="text-xl text-red-100 mb-8 leading-relaxed">
            You don't have the necessary permissions to access this resource.
            Contact your administrator for assistance.
          </p>

          <!-- Security Features -->
          <div class="space-y-4">
            <div class="flex items-center">
              <UIcon
                name="i-heroicons-shield-check"
                class="w-5 h-5 text-red-200 mr-3"
              />
              <span class="text-red-100"> Role-based access control </span>
            </div>
            <div class="flex items-center">
              <UIcon
                name="i-heroicons-lock-closed"
                class="w-5 h-5 text-red-200 mr-3"
              />
              <span class="text-red-100"> Secure authentication system </span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-heroicons-eye" class="w-5 h-5 text-red-200 mr-3" />
              <span class="text-red-100">
                Activity monitoring and logging
              </span>
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

    <!-- Right Side - Error Content -->
    <div
      class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div
            class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3"
          >
            <UIcon
              name="i-heroicons-shield-exclamation"
              class="w-6 h-6 text-white"
            />
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            CBS Approve Web
          </h1>
        </div>

        <!-- Error Content -->
        <div class="text-center">
          <!-- Error Icon -->
          <div
            class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6"
          >
            <UIcon
              name="i-heroicons-shield-exclamation"
              class="h-10 w-10 text-red-600 dark:text-red-400"
            />
          </div>

          <!-- Error Title -->
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>

          <!-- Error Code -->
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Error Code: 403 - Forbidden
          </p>

          <!-- Error Description -->
          <div class="mb-8">
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {{ getErrorMessage() }}
            </p>

            <!-- Additional Context -->
            <div
              v-if="routeAttempted || reason"
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-left"
            >
              <div class="flex">
                <UIcon
                  name="i-heroicons-information-circle"
                  class="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
                />
                <div class="text-sm">
                  <p class="font-medium text-red-800 dark:text-red-200 mb-1">
                    Additional Information:
                  </p>
                  <div class="text-red-700 dark:text-red-300 space-y-1">
                    <p v-if="routeAttempted">
                      <span class="font-medium">Attempted Route:</span>
                      {{ routeAttempted }}
                    </p>
                    <p v-if="reason">
                      <span class="font-medium">Reason:</span> {{ reason }}
                    </p>
                    <p v-if="userRole">
                      <span class="font-medium">Your Role:</span> {{ userRole }}
                    </p>
                    <p v-if="requiredRoles.length > 0">
                      <span class="font-medium">Required Roles:</span>
                      {{ requiredRoles.join(", ") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <!-- Primary Actions -->
            <div class="space-y-3">
              <UButton
                @click="goToDashboard"
                color="primary"
                size="lg"
                block
                icon="i-heroicons-home"
              >
                Go to Dashboard
              </UButton>

              <UButton
                @click="goBack"
                variant="outline"
                size="lg"
                block
                icon="i-heroicons-arrow-left"
              >
                Go Back
              </UButton>
            </div>

            <!-- Secondary Actions -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UButton
                  @click="contactSupport"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-envelope"
                  block
                >
                  Contact Support
                </UButton>

                <UButton
                  @click="logout"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-arrow-right-on-rectangle"
                  block
                >
                  Switch Account
                </UButton>
              </div>
            </div>
          </div>

          <!-- User Info Card -->
          <div v-if="user" class="mt-8">
            <UCard
              class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="user.avatar"
                  :alt="user.firstName + ' ' + user.lastName"
                  size="sm"
                />
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.firstName }} {{ user.lastName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ user.email }} • {{ user.role }} Role
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <UCard
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-start space-x-3">
            <UIcon
              name="i-heroicons-light-bulb"
              class="w-5 h-5 text-blue-500 mt-0.5"
            />
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-medium mb-1">Need Help?</p>
              <p class="mb-2">
                If you believe you should have access to this resource:
              </p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li>Contact your system administrator</li>
                <li>Check if your role permissions have changed</li>
                <li>Try refreshing your browser session</li>
              </ul>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 CBS Approve Web. All rights reserved.</p>
        <div class="mt-2 space-x-4">
          <UButton variant="link" size="xs" @click="contactSupport"
            >Contact Support</UButton
          >
          <UButton variant="link" size="xs" @click="viewHelp"
            >Help Center</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [],
});

const route = useRoute();
const router = useRouter();
const { user, logout: authLogout } = useAuth();
const { getCurrentRole, getDefaultRoute } = usePermissionSystem();

// Get query parameters
const routeAttempted = computed(() => (route.query.route as string) || "");
const reason = computed(() => (route.query.reason as string) || "");
const requiredRoles = computed(() => {
  const roles = route.query.requiredRoles as string;
  return roles ? roles.split(",") : [];
});

// User information
const userRole = computed(() => getCurrentRole());

// Error message based on context
const getErrorMessage = () => {
  if (reason.value) {
    return reason.value;
  }

  if (routeAttempted.value) {
    return `You don't have permission to access "${routeAttempted.value}". This area is restricted to users with specific roles.`;
  }

  return "You don't have the necessary permissions to access this resource. Please contact your administrator if you believe this is an error.";
};

// Navigation methods
const goToDashboard = async () => {
  try {
    const defaultRoute = getDefaultRoute();
    await navigateTo(defaultRoute, { replace: true });
  } catch (error) {
    console.error("Navigation error:", error);
    await navigateTo("/auth/login", { replace: true });
  }
};

const goBack = () => {
  // Check if there's a valid history to go back to
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    goToDashboard();
  }
};

const logout = async () => {
  try {
    await authLogout();
  } catch (error) {
    console.error("Logout error:", error);
    // Force navigation to login even if logout fails
    await navigateTo("/auth/login", { replace: true });
  }
};

const contactSupport = () => {
  // Create mailto link with context
  const subject = encodeURIComponent("Access Denied - Need Help");
  const body = encodeURIComponent(
    `Hello Support Team,\n\n` +
      `I encountered an access denied error with the following details:\n\n` +
      `- Route Attempted: ${routeAttempted.value || "N/A"}\n` +
      `- User Role: ${userRole.value || "N/A"}\n` +
      `- Error Time: ${new Date().toISOString()}\n` +
      `- Reason: ${reason.value || "N/A"}\n\n` +
      `Please help me resolve this access issue.\n\n` +
      `Thank you,\n${user.value?.firstName || "User"} ${user.value?.lastName || ""}`
  );

  window.location.href = `mailto:support@company.com?subject=${subject}&body=${body}`;
};

const viewHelp = () => {
  // Open help in new tab to preserve current state
  window.open("/help", "_blank");
};

// Auto-redirect after a delay if no user interaction
let redirectTimer: NodeJS.Timeout | null = null;

onMounted(() => {
  // Set a timer to auto-redirect after 5 minutes of inactivity
  redirectTimer = setTimeout(
    () => {
      goToDashboard();
    },
    5 * 60 * 1000
  ); // 5 minutes
});

onUnmounted(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
  }
});

// Clear timer on any user interaction
const clearRedirectTimer = () => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    redirectTimer = null;
  }
};

// Add event listeners for user activity
onMounted(() => {
  const events = ["click", "keydown", "mousemove", "scroll"];
  events.forEach((event) => {
    document.addEventListener(event, clearRedirectTimer, { once: true });
  });
});

// SEO
useSeoMeta({
  title: "Access Denied - Unauthorized",
  description: "You do not have permission to access this resource.",
  robots: "noindex,nofollow",
});
</script>
