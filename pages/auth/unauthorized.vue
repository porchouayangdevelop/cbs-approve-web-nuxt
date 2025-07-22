<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 flex items-center justify-center p-4"
  >
    <div class="max-w-2xl w-full">
      <div class="text-center space-y-8">
        <!-- Error Code Display -->
        <div class="relative">
          <div
            class="text-8xl md:text-9xl font-black text-red-200 dark:text-red-800 select-none"
          >
            403
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <UIcon
              name="i-heroicons-shield-exclamation"
              class="w-16 h-16 md:w-20 md:h-20 text-red-500 animate-pulse"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div class="space-y-4">
          <h1
            class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Access Denied
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            You don't have permission to access this resource. Please contact
            your administrator if you believe this is an error.
          </p>
        </div>

        <!-- User Info Card -->
        <UCard class="max-w-md mx-auto text-left">
          <template #header>
            <div class="flex items-center space-x-3">
              <UIcon
                name="i-heroicons-user-circle"
                class="w-6 h-6 text-blue-500"
              />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Current User Info
              </h3>
            </div>
          </template>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Email:</span
              >
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                currentUser?.email || "Not available"
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Role:</span
              >
              <UBadge
                :color="getRoleColor(currentUser?.role)"
                variant="soft"
                size="sm"
              >
                {{ currentUser?.role || "Unknown" }}
              </UBadge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Department:</span
              >
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                currentUser?.department || "Not assigned"
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >User:</span
              >
              <span class="text-sm font-mono text-gray-900 dark:text-white">{{
                currentUser?.firstName || "N/A"
              }}</span>
            </div>
          </div>
        </UCard>

        <!-- Access Details -->
        <UCard class="max-w-md mx-auto text-left">
          <template #header>
            <div class="flex items-center space-x-3">
              <UIcon
                name="i-heroicons-lock-closed"
                class="w-6 h-6 text-red-500"
              />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Access Details
              </h3>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Requested Resource:</span
                >
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                <code class="text-sm text-gray-800 dark:text-gray-200">{{
                  requestedPath
                }}</code>
              </div>
            </div>

            <div v-if="missingAccess.permissions.length > 0">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Missing Permissions:</span
                >
              </div>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="permission in missingAccess.permissions"
                  :key="permission"
                  color="error"
                  variant="soft"
                  size="xs"
                >
                  {{ permission }}
                </UBadge>
              </div>
            </div>

            <div v-if="missingAccess.roles.length > 0">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Required Roles:</span
                >
              </div>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="role in missingAccess.roles"
                  :key="role"
                  color="error"
                  variant="soft"
                  size="xs"
                >
                  {{ role }}
                </UBadge>
              </div>
            </div>

            <!--            <div v-if="currentUser?.permissions && currentUser.permissions.length > 0">-->
            <!--              <div class="flex items-center justify-between mb-2">-->
            <!--                <span class="text-sm text-gray-600 dark:text-gray-400">Your Permissions:</span>-->
            <!--              </div>-->
            <!--              <div class="flex flex-wrap gap-1">-->
            <!--                <UBadge-->
            <!--                    v-for="permission in currentUser.permissions"-->
            <!--                    :key="permission"-->
            <!--                    color="neutral"-->
            <!--                    variant="soft"-->
            <!--                    size="xs"-->
            <!--                >-->
            <!--                  {{ permission }}-->
            <!--                </UBadge>-->
            <!--              </div>-->
            <!--            </div>-->

            <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Access Attempt:</span
                >
                <span class="text-sm text-gray-900 dark:text-white">{{
                  formatDate(new Date())
                }}</span>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Reason:</span
                >
                <span class="text-sm text-red-600 dark:text-red-400">{{
                  accessReason
                }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
        >
          <UButton
            @click="goToAccessiblePage"
            size="lg"
            icon="i-heroicons-home"
            class="w-full sm:w-auto"
          >
            Go to Dashboard
          </UButton>

          <UButton
            @click="goBack"
            variant="outline"
            size="lg"
            icon="i-heroicons-arrow-left"
            class="w-full sm:w-auto"
          >
            Go Back
          </UButton>

          <UButton
            @click="requestAccess"
            variant="outline"
            size="lg"
            icon="i-heroicons-envelope"
            class="w-full sm:w-auto"
          >
            Request Access
          </UButton>
        </div>

        <!-- Additional Help -->
        <div class="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help? Contact your system administrator:
          </p>
          <div class="flex flex-wrap justify-center gap-6 text-sm">
            <ULink
              href="mailto:admin@company.com"
              class="flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
              admin@company.com
            </ULink>
            <ULink
              href="tel:+1-555-0123"
              class="flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <UIcon name="i-heroicons-phone" class="w-4 h-4" />
              +1 (555) 012-3456
            </ULink>
            <ULink
              to="/systems/help"
              class="flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4" />
              Help Center
            </ULink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGuards } from "~/composables/useGuards";

definePageMeta({
  layout: false,
  middleware: [],
});

const route = useRoute();
const { user } = useAuth();
const { getMissingPermission, getAccessibleRoutes, redirectToAllowPage } =
  useGuards();

// Check if we're in development mode
const isDevelopment = process.dev;

// Get current user information
const currentUser = computed(() => user.value);

// Current route information
const requestedPath = (route.query.route as string) || route.fullPath;
const accessReason =
  (route.query.reason as string) || "insufficient_permissions";

const routeInfo = {
  path: route.path,
  name: route.name,
  query: route.query,
  params: route.params,
  requestedResource: requestedPath,
};

// Get missing access information
const missingAccess = computed(() => {
  if (!requestedPath) return { roles: [], permissions: [] };
  return getMissingPermission(requestedPath);
});

// Get accessible routes for debug
const accessibleRoutes = computed(() => {
  return getAccessibleRoutes();
});

// Helper methods
const getRoleColor = (role?: string) => {
  const colors: Record<string, string> = {
    Admin: "red",
    Checker: "green",
    User: "gray",
  };
  return colors[role || ""] || "gray";
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

// Action methods
const goToAccessiblePage = async () => {
  await redirectToAllowPage();
};

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    goToAccessiblePage();
  }
};

const requestAccess = () => {
  const subject = encodeURIComponent(`Access Request for ${requestedPath}`);
  const missingPerms = missingAccess.value.permissions.join(", ");
  const missingRoles = missingAccess.value.roles.join(", ");

  const body = encodeURIComponent(
    `Hello,\n\nI am requesting access to the following resource:\n\n` +
      `Resource: ${requestedPath}\n` +
      `User ID: ${currentUser.value?.id}\n` +
      `Email: ${currentUser.value?.email}\n` +
      `Current Role: ${currentUser.value?.role}\n` +
      `Department: ${currentUser.value?.department}\n` +
      `Missing Permissions: ${missingPerms}\n` +
      `Required Roles: ${missingRoles}\n` +
      `Access Reason: ${accessReason}\n\n` +
      `Please review and grant access if appropriate.\n\n` +
      `Thank you.`
  );

  window.open(`mailto:admin@company.com?subject=${subject}&body=${body}`);
};

// Set pages meta
useSeoMeta({
  title: "403 - Access Denied",
  description: "You do not have permission to access this resource.",
  robots: "noindex,nofollow",
});
</script>

<style scoped>
/* Custom animations */
@keyframes pulse-glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive typography */
@media (max-width: 640px) {
  .text-8xl {
    font-size: 6rem;
  }
}

/* Code block styling */
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Link hover effects */
a:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease-in-out;
}
</style>
