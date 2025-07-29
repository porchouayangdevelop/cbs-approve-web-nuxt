<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 flex items-center justify-center p-4"
  >
    <div class="max-w-4xl w-full">
      <div class="text-center space-y-8">
        <!-- Animated Error Code Display -->
        <div class="relative">
          <div
            class="text-8xl md:text-9xl font-black text-red-200 dark:text-red-800 select-none animate-pulse-slow"
          >
            403
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative">
              <UIcon
                name="i-heroicons-shield-exclamation"
                class="w-16 h-16 md:w-20 md:h-20 text-red-500 animate-bounce"
              />
              <div class="absolute inset-0 w-16 h-16 md:w-20 md:h-20 border-2 border-red-300 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div class="space-y-4">
          <h1
            class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Access Denied
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            You don't have permission to access this resource. This could be due to insufficient privileges, 
            expired session, or restricted access policies.
          </p>
          
          <!-- Error Details Badge -->
          <div class="flex justify-center">
            <UBadge 
              :color="getErrorTypeColor(errorType)" 
              size="lg" 
              variant="soft"
              class="px-4 py-2"
            >
              <UIcon :name="getErrorTypeIcon(errorType)" class="w-4 h-4 mr-2" />
              {{ getErrorTypeLabel(errorType) }}
            </UBadge>
          </div>
        </div>

        <!-- User Information Card -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <!-- Current User Info -->
          <UCard class="text-left">
            <template #header>
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="currentUser?.avatar"
                  :alt="currentUser?.firstName"
                  size="sm"
                />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Current User
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Account information and permissions
                  </p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Name
                  </label>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                  </p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Email
                  </label>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ currentUser?.email || "Not available" }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Role
                  </label>
                  <div class="mt-1">
                    <UBadge
                      :color="getRoleColor(currentUser?.role)"
                      variant="soft"
                      size="sm"
                    >
                      {{ currentUser?.role || "Unknown" }}
                    </UBadge>
                  </div>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Department
                  </label>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ currentUser?.department || "Not assigned" }}
                  </p>
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  User ID
                </label>
                <p class="text-sm font-mono text-gray-900 dark:text-white">
                  {{ currentUser?.id || "N/A" }}
                </p>
              </div>

              <!-- Session Info -->
              <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Session ID:</span>
                  <span class="font-mono">{{ sessionId }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Access Time:</span>
                  <span>{{ formatDate(new Date()) }}</span>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Access Details -->
          <UCard class="text-left">
            <template #header>
              <div class="flex items-center space-x-3">
                <UIcon
                  name="i-heroicons-lock-closed"
                  class="w-6 h-6 text-red-500"
                />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Access Details
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Request information and requirements
                  </p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Requested Resource
                </label>
                <div class="mt-1 bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                  <code class="text-sm text-gray-800 dark:text-gray-200 break-all">
                    {{ requestedPath }}
                  </code>
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Access Reason
                </label>
                <p class="text-sm text-red-600 dark:text-red-400 mt-1">
                  {{ getAccessReasonDescription(accessReason) }}
                </p>
              </div>

              <!-- Missing Permissions -->
              <div v-if="missingAccess.permissions.length > 0">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Missing Permissions
                </label>
                <div class="flex flex-wrap gap-1 mt-1">
                  <UBadge
                    v-for="permission in missingAccess.permissions"
                    :key="permission"
                    color="red"
                    variant="soft"
                    size="xs"
                  >
                    {{ permission }}
                  </UBadge>
                </div>
              </div>

              <!-- Required Roles -->
              <div v-if="missingAccess.roles.length > 0">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Required Roles
                </label>
                <div class="flex flex-wrap gap-1 mt-1">
                  <UBadge
                    v-for="role in missingAccess.roles"
                    :key="role"
                    color="orange"
                    variant="soft"
                    size="xs"
                  >
                    {{ role }}
                  </UBadge>
                </div>
              </div>

              <!-- Current Permissions -->
              <div v-if="currentUser?.permissions && currentUser.permissions.length > 0">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Your Current Permissions
                </label>
                <div class="max-h-20 overflow-y-auto">
                  <div class="flex flex-wrap gap-1 mt-1">
                    <UBadge
                      v-for="permission in currentUser.permissions.slice(0, 6)"
                      :key="permission"
                      color="green"
                      variant="soft"
                      size="xs"
                    >
                      {{ permission }}
                    </UBadge>
                    <UBadge
                      v-if="currentUser.permissions.length > 6"
                      color="gray"
                      variant="soft"
                      size="xs"
                    >
                      +{{ currentUser.permissions.length - 6 }} more
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-6">
          <!-- Primary Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <UButton
              @click="goToAccessiblePage"
              size="lg"
              icon="i-heroicons-home"
              class="w-full sm:w-auto min-w-[160px]"
              :loading="redirecting"
            >
              {{ redirecting ? 'Redirecting...' : 'Go to Dashboard' }}
            </UButton>

            <UButton
              @click="goBack"
              variant="outline"
              size="lg"
              icon="i-heroicons-arrow-left"
              class="w-full sm:w-auto min-w-[160px]"
            >
              Go Back
            </UButton>

            <UButton
              @click="requestAccess"
              variant="outline"
              size="lg"
              icon="i-heroicons-envelope"
              class="w-full sm:w-auto min-w-[160px]"
              color="blue"
            >
              Request Access
            </UButton>
          </div>

          <!-- Secondary Actions -->
          <div class="flex flex-wrap justify-center gap-3">
            <UButton
              @click="refreshSession"
              variant="ghost"
              size="sm"
              icon="i-heroicons-arrow-path"
              :loading="refreshingSession"
            >
              {{ refreshingSession ? 'Refreshing...' : 'Refresh Session' }}
            </UButton>

            <UButton
              @click="copyErrorDetails"
              variant="ghost"
              size="sm"
              icon="i-heroicons-clipboard"
            >
              Copy Error Details
            </UButton>

            <UButton
              @click="reportIssue"
              variant="ghost"
              size="sm"
              icon="i-heroicons-bug-ant"
            >
              Report Issue
            </UButton>
          </div>
        </div>

        <!-- Help & Contact Information -->
        <div class="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Need Help?
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              If you believe you should have access to this resource or if this error persists, 
              please contact your system administrator or IT support team.
            </p>
            
            <!-- Contact Options -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <UCard class="text-center">
                <UIcon name="i-heroicons-envelope" class="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 class="font-medium text-gray-900 dark:text-white">Email Support</h4>
                <ULink
                  href="mailto:support@company.com"
                  class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  support@company.com
                </ULink>
              </UCard>

              <UCard class="text-center">
                <UIcon name="i-heroicons-phone" class="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 class="font-medium text-gray-900 dark:text-white">Phone Support</h4>
                <ULink
                  href="tel:+1-555-0123"
                  class="text-sm text-green-600 hover:text-green-500 dark:text-green-400"
                >
                  +1 (555) 012-3456
                </ULink>
              </UCard>

              <UCard class="text-center">
                <UIcon name="i-heroicons-question-mark-circle" class="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 class="font-medium text-gray-900 dark:text-white">Help Center</h4>
                <ULink
                  to="/systems/help"
                  class="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400"
                >
                  Visit Help Center
                </ULink>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="pt-6 text-xs text-gray-400 dark:text-gray-500">
          <p>Error Code: 403 • Session: {{ sessionId?.slice(-8) }} • {{ formatDate(new Date()) }}</p>
        </div>
      </div>
    </div>

    <!-- Success Toast for copied content -->
    <div v-if="showCopySuccess" class="fixed bottom-4 right-4 z-50">
      <UCard class="shadow-lg border border-green-200 dark:border-green-800">
        <div class="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          <span class="text-sm font-medium">Error details copied to clipboard</span>
        </div>
      </UCard>
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
const { getMissingPermission, getAccessibleRoutes, redirectToAllowPage } = useGuards();
const toast = useToast();

// State
const redirecting = ref(false);
const refreshingSession = ref(false);
const showCopySuccess = ref(false);

// Get current user information
const currentUser = computed(() => user.value);

// Route and error information
const requestedPath = (route.query.route as string) || route.fullPath;
const accessReason = (route.query.reason as string) || "insufficient_permissions";

// Generate session ID for tracking
const sessionId = computed(() => {
  return currentUser.value?.sessionId || `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
});

// Determine error type based on reason
const errorType = computed(() => {
  const reason = accessReason.toLowerCase();
  if (reason.includes('permission')) return 'permission';
  if (reason.includes('role')) return 'role';
  if (reason.includes('session') || reason.includes('expired')) return 'session';
  if (reason.includes('suspended') || reason.includes('disabled')) return 'account';
  return 'unknown';
});

// Get missing access information
const missingAccess = computed(() => {
  if (!requestedPath) return { roles: [], permissions: [] };
  return getMissingPermission(requestedPath);
});

// Helper methods for error type
const getErrorTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    permission: 'red',
    role: 'orange', 
    session: 'yellow',
    account: 'red',
    unknown: 'gray'
  };
  return colors[type] || 'gray';
};

const getErrorTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    permission: 'i-heroicons-key',
    role: 'i-heroicons-user-group',
    session: 'i-heroicons-clock',
    account: 'i-heroicons-user-minus',
    unknown: 'i-heroicons-exclamation-triangle'
  };
  return icons[type] || 'i-heroicons-exclamation-triangle';
};

const getErrorTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    permission: 'Missing Permissions',
    role: 'Insufficient Role',
    session: 'Session Issue',
    account: 'Account Restricted',
    unknown: 'Access Denied'
  };
  return labels[type] || 'Access Denied';
};

const getAccessReasonDescription = (reason: string) => {
  const descriptions: Record<string, string> = {
    insufficient_permissions: 'You do not have the required permissions to access this resource',
    invalid_role: 'Your current role does not allow access to this resource',
    session_expired: 'Your session has expired, please log in again',
    account_suspended: 'Your account has been suspended, contact administrator',
    resource_not_found: 'The requested resource was not found or has been moved',
    maintenance_mode: 'System is currently under maintenance'
  };
  return descriptions[reason] || 'Access to this resource is restricted';
};

// Helper methods
const getRoleColor = (role?: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    checker: 'blue', 
    user: 'green',
    manager: 'purple'
  };
  return colors[role?.toLowerCase() || ''] || 'gray';
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  }).format(date);
};

// Action methods
const goToAccessiblePage = async () => {
  redirecting.value = true;
  try {
    await redirectToAllowPage();
  } catch (error) {
    console.error('Error redirecting:', error);
    toast.add({
      title: 'Redirect Failed',
      description: 'Unable to redirect to accessible page',
      color: 'red'
    });
  } finally {
    redirecting.value = false;
  }
};

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    goToAccessiblePage();
  }
};

const refreshSession = async () => {
  refreshingSession.value = true;
  try {
    const { refreshToken } = useAuth();
    await refreshToken();
    
    toast.add({
      title: 'Session Refreshed',
      description: 'Please try accessing the resource again',
      color: 'green'
    });
    
    // Try to navigate back to the original resource
    setTimeout(() => {
      window.location.href = requestedPath;
    }, 1000);
  } catch (error) {
    toast.add({
      title: 'Refresh Failed',
      description: 'Unable to refresh session, please log in again',
      color: 'red'
    });
  } finally {
    refreshingSession.value = false;
  }
};

const copyErrorDetails = async () => {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    userId: currentUser.value?.id,
    email: currentUser.value?.email,
    role: currentUser.value?.role,
    requestedResource: requestedPath,
    reason: accessReason,
    missingPermissions: missingAccess.value.permissions,
    requiredRoles: missingAccess.value.roles,
    sessionId: sessionId.value,
    userAgent: navigator.userAgent
  };

  try {
    await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
    showCopySuccess.value = true;
    setTimeout(() => {
      showCopySuccess.value = false;
    }, 3000);
  } catch (error) {
    toast.add({
      title: 'Copy Failed',
      description: 'Unable to copy error details to clipboard',
      color: 'red'
    });
  }
};

const reportIssue = () => {
  const subject = encodeURIComponent(`Access Issue Report - ${requestedPath}`);
  const body = encodeURIComponent(
    `Access Issue Report\n\n` +
    `Resource: ${requestedPath}\n` +
    `User: ${currentUser.value?.email}\n` +
    `Role: ${currentUser.value?.role}\n` +
    `Reason: ${accessReason}\n` +
    `Session: ${sessionId.value}\n` +
    `Time: ${formatDate(new Date())}\n\n` +
    `Please describe the issue:\n\n`
  );

  window.open(`mailto:support@company.com?subject=${subject}&body=${body}`);
};

const requestAccess = () => {
  const subject = encodeURIComponent(`Access Request for ${requestedPath}`);
  const missingPerms = missingAccess.value.permissions.join(", ");
  const missingRoles = missingAccess.value.roles.join(", ");

  const body = encodeURIComponent(
    `Access Request\n\n` +
    `Resource: ${requestedPath}\n` +
    `User ID: ${currentUser.value?.id}\n` +
    `Email: ${currentUser.value?.email}\n` +
    `Current Role: ${currentUser.value?.role}\n` +
    `Department: ${currentUser.value?.department}\n` +
    `Missing Permissions: ${missingPerms}\n` +
    `Required Roles: ${missingRoles}\n` +
    `Reason: ${accessReason}\n` +
    `Session: ${sessionId.value}\n\n` +
    `Business justification:\n\n` +
    `Please review and grant access if appropriate.\n\n`
  );

  window.open(`mailto:admin@company.com?subject=${subject}&body=${body}`);
};

// SEO
useSeoMeta({
  title: "403 - Access Denied",
  description: "You do not have permission to access this resource.",
  robots: "noindex,nofollow",
});
</script>

<style scoped>
/* Custom animations */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Enhanced hover effects */
.hover-lift {
  transition: transform 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Responsive typography improvements */
@media (max-width: 640px) {
  .text-8xl {
    font-size: 5rem;
  }
  .text-9xl {
    font-size: 6rem;
  }
}

/* Code block styling */
code {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

/* Card hover effects */
.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>