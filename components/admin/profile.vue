<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Profile Cover & Header -->
    <div class="relative">
      <!-- Cover Image -->
      <div
        class="h-48 md:h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden"
      >
        <img
          v-if="profileData.coverImage"
          :src="profileData.coverImage"
          alt="Cover"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>

        <!-- Edit Cover Button -->
        <UButton
          variant="solid"
          color="white"
          size="sm"
          icon="i-heroicons-camera"
          class="absolute top-4 right-4"
          @click="editCover"
        >
          Edit Cover
        </UButton>
      </div>

      <!-- Profile Header -->
      <div class="relative px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="relative -mt-16 md:-mt-20 pb-6">
            <div
              class="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6"
            >
              <!-- Profile Picture -->
              <div class="relative">
                <UAvatar
                  :src="profileData.avatar"
                  :alt="profileData.name"
                  size="3xl"
                  class="ring-4 ring-white dark:ring-gray-800 shadow-xl"
                />
                <!-- <UButton
                  variant="solid"
                  color="primary"
                  size="xs"
                  icon="i-heroicons-camera"
                  class="absolute bottom-2 right-2 rounded-full"
                  @click="editAvatar"
                /> -->
              </div>

              <!-- Profile Info -->
              <div class="flex-1 min-w-0">
                <div
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
                >
                  <div
                    class="flex flex-col md:flex-row md:items-center justify-between"
                  >
                    <div class="min-w-0 flex-1">
                      <h1
                        class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate"
                      >
                        {{ profileData.name }}
                      </h1>
                      <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                        {{ profileData.title }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {{ profileData.bio }}
                      </p>

                      <!-- Quick Stats -->
                      <div class="flex items-center space-x-6 mt-4">
                        <div class="text-center">
                          <div
                            class="text-xl font-semibold text-gray-900 dark:text-white"
                          >
                            {{ profileData.stats.projects }}
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            Projects
                          </div>
                        </div>
                        <div class="text-center">
                          <div
                            class="text-xl font-semibold text-gray-900 dark:text-white"
                          >
                            {{ profileData.stats.team }}
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            Team Size
                          </div>
                        </div>
                        <div class="text-center">
                          <div
                            class="text-xl font-semibold text-gray-900 dark:text-white"
                          >
                            {{ profileData.stats.experience }}
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            Years Exp.
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center space-x-3 mt-4 md:mt-0">
                      <UButton
                        variant="outline"
                        icon="i-heroicons-envelope"
                        size="sm"
                        class="cursor-pointer"
                      >
                        Message
                      </UButton>
                      <UButton
                        variant="solid"
                        icon="i-heroicons-pencil-square"
                        size="sm"
                        @click="editProfile"
                        class="cursor-pointer"
                      >
                        Edit Profile
                      </UButton>
                      <UButton
                        variant="outline"
                        icon="i-heroicons-x-circle"
                        size="sm"
                        @click="$router.back()"
                        class="cursor-pointer"
                      >
                        Close
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Vertical Tab Navigation -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6"
          >
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Profile
              </h3>
            </div>

            <nav class="p-2">
              <div class="space-y-1">
                <button
                  v-for="tab in profileTabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer',
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border-l-3 border-l-primary-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-3 border-l-transparent',
                  ]"
                >
                  <UIcon :name="tab.icon" class="w-5 h-5 mr-3" />
                  <span class="flex-1 text-left">{{ tab.label }}</span>
                  <UBadge
                    v-if="tab.badge"
                    :color="tab.badgeColor || 'primary'"
                    size="xs"
                    variant="soft"
                  >
                    {{ tab.badge }}
                  </UBadge>
                </button>
              </div>
            </nav>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-3">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="p-6">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Overview
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Personal Information -->
                <div class="space-y-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-envelope"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{
                        profileData.email
                      }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-phone"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{
                        profileData.phone
                      }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-map-pin"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{
                        profileData.location
                      }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-calendar"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Joined {{ profileData.joinDate }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Professional Details -->
                <div class="space-y-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Professional Details
                  </h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-building-office"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{
                        profileData.department
                      }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-identification"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >ID: {{ profileData.employeeId }}</span
                      >
                    </div>
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-user-group"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Reports to {{ profileData.manager }}</span
                      >
                    </div>
                    <div class="flex items-center">
                      <UIcon
                        name="i-heroicons-clock"
                        class="w-5 h-5 text-gray-400 mr-3"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{
                        profileData.workSchedule
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skills -->
              <div class="mt-8">
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Skills & Expertise
                </h3>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="skill in profileData.skills"
                    :key="skill.name"
                    :color="
                      skill.level === 'expert'
                        ? 'green'
                        : skill.level === 'advanced'
                          ? 'blue'
                          : 'gray'
                    "
                    variant="soft"
                  >
                    {{ skill.name }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Settings Tab -->
            <div v-else-if="activeTab === 'settings'" class="p-6">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Account Settings
              </h2>

              <div class="space-y-8">
                <!-- Email Preferences -->
                <div>
                  <h3
                    class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                  >
                    Email Preferences
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >Email Notifications</label
                        >
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Receive email updates about your account
                        </p>
                      </div>
                      <UToggle
                        v-model="localSettings.emailNotifications"
                        @change="updateSettings"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <label
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >Marketing Emails</label
                        >
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Receive promotional content and updates
                        </p>
                      </div>
                      <UToggle
                        v-model="localSettings.marketingEmails"
                        @change="updateSettings"
                      />
                    </div>
                  </div>
                </div>

                <!-- Privacy Settings -->
                <div>
                  <h3
                    class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                  >
                    Privacy
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >Profile Visibility</label
                        >
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Make your profile visible to team members
                        </p>
                      </div>
                      <UToggle
                        v-model="localSettings.profileVisibility"
                        @change="updateSettings"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <label
                          class="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >Activity Status</label
                        >
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Show when you're online
                        </p>
                      </div>
                      <UToggle
                        v-model="localSettings.activityStatus"
                        @change="updateSettings"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Tab -->
            <div v-else-if="activeTab === 'security'" class="p-6">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Security Settings
              </h2>

              <div class="space-y-8">
                <!-- Password -->
                <div>
                  <h3
                    class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                  >
                    Password
                  </h3>
                  <div
                    class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <p
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Last changed
                        {{
                          profileData.security?.passwordLastChanged ||
                          "3 months ago"
                        }}
                      </p>
                    </div>
                    <UButton
                      variant="outline"
                      size="sm"
                      @click="$emit('changePassword')"
                      >Change Password</UButton
                    >
                  </div>
                </div>

                <!-- Two-Factor Authentication -->
                <div>
                  <h3
                    class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                  >
                    Two-Factor Authentication
                  </h3>
                  <div
                    class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <p
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        2FA Status
                      </p>
                      <p class="text-xs text-green-600 dark:text-green-400">
                        {{
                          profileData.security?.twoFactorEnabled
                            ? "Enabled via Authenticator App"
                            : "Disabled"
                        }}
                      </p>
                    </div>
                    <UButton
                      variant="outline"
                      size="sm"
                      :color="
                        profileData.security?.twoFactorEnabled
                          ? 'error'
                          : 'primary'
                      "
                      @click="$emit('toggle2FA')"
                    >
                      {{
                        profileData.security?.twoFactorEnabled
                          ? "Disable 2FA"
                          : "Enable 2FA"
                      }}
                    </UButton>
                  </div>
                </div>

                <!-- Active Sessions -->
                <div>
                  <h3
                    class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                  >
                    Active Sessions
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="session in profileData.activeSessions"
                      :key="session.id"
                      class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div class="flex items-center space-x-3">
                        <UIcon
                          :name="
                            session.device === 'desktop'
                              ? 'i-heroicons-computer-desktop'
                              : 'i-heroicons-device-phone-mobile'
                          "
                          class="w-5 h-5 text-gray-400"
                        />
                        <div>
                          <p
                            class="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            {{ session.browser }} on {{ session.os }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ session.location }} • {{ session.lastActive }}
                          </p>
                        </div>
                      </div>
                      <UButton
                        v-if="!session.current"
                        variant="outline"
                        size="xs"
                        color="error"
                        @click="$emit('revokeSession', session.id)"
                        >Revoke</UButton
                      >
                      <UBadge v-else color="success" size="xs">Current</UBadge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Tab -->
            <div v-else-if="activeTab === 'activity'" class="p-6">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Recent Activity
              </h2>

              <div class="space-y-4">
                <div
                  v-for="activity in profileData.recentActivity"
                  :key="activity.id"
                  class="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      activity.type === 'login'
                        ? 'bg-green-100 dark:bg-green-900'
                        : activity.type === 'update'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : activity.type === 'security'
                            ? 'bg-yellow-100 dark:bg-yellow-900'
                            : 'bg-gray-100 dark:bg-gray-700',
                    ]"
                  >
                    <UIcon
                      :name="activity.icon"
                      :class="[
                        'w-5 h-5',
                        activity.type === 'login'
                          ? 'text-green-600 dark:text-green-400'
                          : activity.type === 'update'
                            ? 'text-blue-600 dark:text-blue-400'
                            : activity.type === 'security'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-gray-600 dark:text-gray-400',
                      ]"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ activity.title }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ activity.description }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ activity.timestamp }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div v-else-if="activeTab === 'notifications'" class="p-6">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Notifications
              </h2>

              <div class="space-y-4">
                <div
                  v-for="notification in profileData.notifications"
                  :key="notification.id"
                  class="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      notification.read
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-blue-100 dark:bg-blue-900',
                    ]"
                  >
                    <UIcon
                      :name="notification.icon"
                      :class="[
                        'w-5 h-5',
                        notification.read
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'text-blue-600 dark:text-blue-400',
                      ]"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      :class="[
                        'text-sm font-medium',
                        notification.read
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white',
                      ]"
                    >
                      {{ notification.title }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ notification.description }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ notification.timestamp }}
                    </p>
                  </div>
                  <UButton
                    v-if="!notification.read"
                    variant="outline"
                    size="xs"
                    @click="$emit('markAsRead', notification.id)"
                  >
                    Mark as Read
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
// Define interfaces for type safety
interface Skill {
  name: string;
  level: "expert" | "advanced" | "intermediate" | "beginner";
}

interface Stats {
  projects: number;
  team: number;
  experience: number;
}

interface Session {
  id: number;
  device: "desktop" | "mobile";
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface Activity {
  id: number;
  type: "login" | "update" | "security";
  icon: string;
  title: string;
  description: string;
  timestamp: string;
}

interface Notification {
  id: number;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface Security {
  passwordLastChanged?: string;
  twoFactorEnabled?: boolean;
}

interface Settings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  profileVisibility: boolean;
  activityStatus: boolean;
}

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  employeeId: string;
  manager: string;
  workSchedule: string;
  joinDate: string;
  avatar: string;
  coverImage?: string;
  stats: Stats;
  skills: Skill[];
  activeSessions?: Session[];
  recentActivity?: Activity[];
  notifications?: Notification[];
  security?: Security;
  settings?: Settings;
}

// Define props
const props = defineProps<{
  profileData: ProfileData;
  initialTab?: string;
}>();

// Define emits
const emit = defineEmits<{
  editProfile: [];
  editAvatar: [];
  editCover: [];
  changePassword: [];
  toggle2FA: [];
  revokeSession: [sessionId: number];
  markAsRead: [notificationId: number];
  updateSettings: [settings: Settings];
}>();

// Reactive data
const profileData = computed(() => props.profileData);
const activeTab = ref(props.initialTab || "overview");

// Local settings that can be modified
const localSettings = ref<Settings>({
  emailNotifications: true,
  marketingEmails: false,
  profileVisibility: true,
  activityStatus: true,
});

// Initialize local settings from props
onMounted(() => {
  if (props.profileData.settings) {
    localSettings.value = {
      emailNotifications: props.profileData.settings.emailNotifications ?? true,
      marketingEmails: props.profileData.settings.marketingEmails ?? false,
      profileVisibility: props.profileData.settings.profileVisibility ?? true,
      activityStatus: props.profileData.settings.activityStatus ?? true,
    };
  }
});

// Tab navigation
const profileTabs = [
  {
    id: "overview",
    label: "Overview",
    icon: "i-heroicons-user",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "i-heroicons-cog-6-tooth",
  },
  {
    id: "security",
    label: "Security",
    icon: "i-heroicons-shield-check",
    badge: profileData.value.security?.twoFactorEnabled ? undefined : "!",
    badgeColor: "yellow",
  },
  {
    id: "activity",
    label: "Activity",
    icon: "i-heroicons-clock",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "i-heroicons-bell",
    badge:
      profileData.value.notifications
        ?.filter((n) => !n.read)
        .length?.toString() || undefined,
    badgeColor: "red",
  },
];

// Methods
const editProfile = () => {
  emit("editProfile");
};

const editAvatar = () => {
  emit("editAvatar");
};

const editCover = () => {
  emit("editCover");
};

const updateSettings = () => {
  emit("updateSettings", localSettings.value);
};

// Watch for settings changes from parent
watch(
  () => props.profileData.settings,
  (newSettings) => {
    if (newSettings) {
      localSettings.value = { ...newSettings };
    }
  },
  { deep: true }
);
</script>
