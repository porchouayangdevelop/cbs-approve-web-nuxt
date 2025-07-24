<!-- components/modals/SessionExpiredModal.vue -->
<template>
  <UModal v-model="isOpen" :prevent-close="true" :ui="{ width: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-5 h-5 text-red-600 dark:text-red-400"
            />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Session Expired
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Your session has expired
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Warning Message -->
        <UAlert
          color="error"
          variant="soft"
          icon="i-heroicons-shield-exclamation"
          title="Authentication Required"
          description="For security reasons, your session has expired. Please refresh your session or log in again to continue."
        />

        <!-- User Information -->
        <UCard v-if="user" class="bg-gray-50 dark:bg-gray-800">
          <template #header>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Current User
            </h3>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Name:</span
              >
              <span class="text-sm text-gray-900 dark:text-white font-medium">
                {{ user.firstName }} {{ user.lastName }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Email:</span
              >
              <span class="text-sm text-gray-900 dark:text-white">{{
                user.email
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Username:</span
              >
              <span class="text-sm text-gray-900 dark:text-white font-mono">{{
                user.username
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Role:</span
              >
              <UBadge
                :color="getRoleColor(user.role)"
                variant="soft"
                size="xs"
                class="capitalize"
              >
                {{ user.role }}
              </UBadge>
            </div>
          </div>
        </UCard>

        <!-- Session Details -->
        <UCard class="bg-gray-50 dark:bg-gray-800">
          <template #header>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Session Details
            </h3>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Session Duration:</span
              >
              <span class="text-sm text-gray-900 dark:text-white">{{
                sessionDuration
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Last Activity:</span
              >
              <span class="text-sm text-gray-900 dark:text-white">{{
                lastActivity
              }}</span>
            </div>
            <div
              v-if="tokenInfo?.expiration"
              class="flex justify-between items-center"
            >
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Token Expired:</span
              >
              <span class="text-sm text-red-600 dark:text-red-400 font-medium">
                {{ formatTime(tokenInfo.expiration) }}
              </span>
            </div>
            <div
              v-if="tokenInfo?.issuedAt"
              class="flex justify-between items-center"
            >
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Token Issued:</span
              >
              <span class="text-sm text-gray-900 dark:text-white">
                {{ formatTime(tokenInfo.issuedAt) }}
              </span>
            </div>
            <div
              v-if="tokenInfo?.audience"
              class="flex justify-between items-center"
            >
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Audience:</span
              >
              <span
                class="text-sm text-gray-900 dark:text-white font-mono text-xs"
              >
                {{ tokenInfo.audience }}
              </span>
            </div>
          </div>
        </UCard>

        <!-- Auto logout countdown -->
        <UAlert color="amber" variant="soft" icon="i-heroicons-clock">
          <template #title>
            <div class="flex items-center justify-between w-full">
              <span class="text-sm">
                Automatic logout in
                <span class="font-bold text-amber-900 dark:text-amber-100">{{
                  countdown
                }}</span>
                seconds
              </span>
              <div
                class="w-16 h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-1000 ease-linear"
                  :style="{ width: `${(countdown / 30) * 100}%` }"
                ></div>
              </div>
            </div>
          </template>
        </UAlert>
      </div>

      <template #footer>
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton
            @click="handleRefreshToken"
            :loading="isRefreshing"
            :disabled="isRefreshing"
            color="primary"
            variant="solid"
            size="md"
            block
            icon="i-heroicons-arrow-path"
          >
            {{ isRefreshing ? "Refreshing..." : "Refresh Session" }}
          </UButton>

          <UButton
            @click="handleLogout"
            color="secondary"
            variant="outline"
            size="md"
            block
            icon="i-heroicons-arrow-right-on-rectangle"
          >
            Sign Out
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  username?: string;
}

interface TokenInfo {
  token?: string;
  expiration?: Date;
  issuedAt?: Date;
  audience?: string;
  subject?: string;
  issuer?: string;
}

interface Props {
  modelValue: boolean;
  user?: User;
  tokenInfo?: TokenInfo;
  sessionDuration?: string;
  lastActivity?: string;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh-token"): Promise<boolean>;
  (e: "logout"): void;
}

const props = withDefaults(defineProps<Props>(), {
  sessionDuration: "30 minutes",
  lastActivity: "Unknown",
});

const emit = defineEmits<Emits>();

// Local state
const isRefreshing = ref(false);
const countdown = ref(30);
const countdownInterval = ref<NodeJS.Timeout | null>(null);

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Methods
const getRoleColor = (role?: string) => {
  const colors: Record<string, string> = {
    admin: "red",
    checker: "blue",
    user: "green",
  };
  return colors[role?.toLowerCase() || ""] || "gray";
};

const formatTime = (date?: Date) => {
  if (!date) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const handleRefreshToken = async () => {
  isRefreshing.value = true;
  try {
    const success = await emit("refresh-token");
    if (!success) {
      handleLogout();
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    handleLogout();
  } finally {
    isRefreshing.value = false;
  }
};

const handleLogout = () => {
  stopCountdown();
  emit("logout");
};

const startCountdown = () => {
  countdown.value = 30;
  countdownInterval.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      handleLogout();
    }
  }, 1000);
};

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    countdownInterval.value = null;
  }
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      startCountdown();
    } else {
      stopCountdown();
    }
  }
);

// Cleanup
onUnmounted(() => {
  stopCountdown();
});
</script>
