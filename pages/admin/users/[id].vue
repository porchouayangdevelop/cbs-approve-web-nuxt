<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

import profile from "~/components/admin/profile.vue";
import { useSystemUserStore, type User } from "~/store/systemUserStore";

const store = useSystemUserStore();
const {
  user: storeUser,
  loading: storeLoading,
  isInitialized: storeInitialized,
  roles,
} = storeToRefs(useSystemUserStore());
const { getUsers, getRole, getUser } = store;

const {
  isAuthenticated,
  isLoading: authLoading,
  user,
  isInitialized: authInitialized,
} = useAuth();

const route = useRoute();

const userData = computed(() => {
  if (!user.value || !storeUser.value) return {};
  return {
    id: storeUser.value.id,
    firstName: storeUser.value.firstName,
    lastName: storeUser.value.lastName,
    email: storeUser.value.email ? storeUser.value.email : "N/A",
    emailVerified: storeUser.value.emailVerified,
    createdTimestamp: formatDate(storeUser.value.createdTimestamp),
    enabled: storeUser.value.enabled,
    totp: storeUser.value.totp,
    disabledCredentialTypes: storeUser.value.disabledCredentialTypes,
    requiredActions: storeUser.value.requiredActions,
    notBefore: storeUser.value.notBefore,
    access: storeUser.value.access,
    avatar: `https://ui-avatars.com/api/?name=${storeUser.value.username}${storeUser.value.lastName}`,
  };
});

const profileData = computed(() => {
  return {
    name: `${userData.value.firstName} ${userData.value.lastName?.toUpperCase()}`,
    title: "IT Core banking",
    bio: "Passionate about creating exceptional user experiences and leading cross-functional teams to deliver innovative products.",
    email: userData.value.email,
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    department: "IT Core banking",
    employeeId: `${userData.value.id}`,
    manager: "Sarah Wilson",
    workSchedule: "Full-time, Remote",
    joinDate: `${userData.value.createdTimestamp}`,
    avatar: userData.value.avatar,
    coverImage: "",
    stats: {
      projects: 24,
      team: 12,
      experience: 8,
    },
    skills: [
      { name: "Product Strategy", level: "expert" },
      { name: "User Research", level: "advanced" },
      { name: "Agile/Scrum", level: "expert" },
      { name: "Data Analysis", level: "advanced" },
      { name: "Leadership", level: "expert" },
      { name: "UI/UX Design", level: "intermediate" },
    ],
    activeSessions: [
      {
        id: 1,
        device: "desktop",
        browser: "Chrome",
        os: "macOS",
        location: "San Francisco, CA",
        lastActive: "2 minutes ago",
        current: true,
      },
      {
        id: 2,
        device: "mobile",
        browser: "Safari",
        os: "iOS",
        location: "San Francisco, CA",
        lastActive: "1 hour ago",
        current: false,
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: "login",
        icon: "i-heroicons-arrow-right-on-rectangle",
        title: "Logged in",
        description: "Successful login from Chrome on macOS",
        timestamp: "2 minutes ago",
      },
      {
        id: 2,
        type: "update",
        icon: "i-heroicons-pencil-square",
        title: "Profile updated",
        description: "Updated bio and contact information",
        timestamp: "2 hours ago",
      },
      {
        id: 3,
        type: "security",
        icon: "i-heroicons-shield-check",
        title: "Password changed",
        description: "Successfully updated account password",
        timestamp: "1 day ago",
      },
    ],
    notifications: [
      {
        id: 1,
        icon: "i-heroicons-envelope",
        title: "New message from Sarah Wilson",
        description: "Regarding the Q4 product roadmap meeting",
        timestamp: "5 minutes ago",
        read: false,
      },
      {
        id: 2,
        icon: "i-heroicons-calendar",
        title: "Meeting reminder",
        description: "Weekly team standup in 30 minutes",
        timestamp: "25 minutes ago",
        read: false,
      },
      {
        id: 3,
        icon: "i-heroicons-document-text",
        title: "Document shared",
        description: "Marketing team shared the campaign brief",
        timestamp: "2 hours ago",
        read: true,
      },
    ],
    security: {
      passwordLastChanged: "3 months ago",
      twoFactorEnabled: true,
    },
    settings: {
      emailNotifications: true,
      marketingEmails: false,
      profileVisibility: true,
      activityStatus: true,
    },
  };
});

const activeTab = ref("overview");

const generateAvartar = (user: User) => {
  const { firstName, lastName } = user;
  const initials = `${firstName[0]}${lastName[0]}`;
  const avartar = `https://ui-avatars.com/api/?name=${initials}`;
  return avartar;
};

const formatDate = (date: string) => {
  if (!date) return "N/A";
  return new Date(parseInt(date)).toLocaleDateString();
};

// Event handlers
const handleEditProfile = () => {
  console.log("Edit profile clicked");
  // Navigate to edit page or open modal
  // Example: navigateTo('/profile/edit')
};

const handleEditAvatar = () => {
  console.log("Edit avatar clicked");
  // Open file picker or avatar editor
  // Example: openAvatarEditor()
};

const handleEditCover = () => {
  console.log("Edit cover clicked");
  // Open file picker for cover image
  // Example: openCoverImagePicker()
};

const handleChangePassword = () => {
  console.log("Change password clicked");
  // Navigate to password change page or open modal
  // Example: navigateTo('/profile/change-password')
};

const handleToggle2FA = () => {
  console.log("Toggle 2FA clicked");
  // Handle 2FA toggle logic
  profileData.value.security.twoFactorEnabled =
    !profileData.value.security.twoFactorEnabled;
  // Example: call API to update 2FA setting
};

const handleRevokeSession = (sessionId: number) => {
  console.log("Revoke session:", sessionId);
  // Remove session from the list
  const index = profileData.value.activeSessions.findIndex(
    (s) => s.id === sessionId
  );
  if (index > -1) {
    profileData.value.activeSessions.splice(index, 1);
  }
  // Example: call API to revoke session
};

const handleMarkAsRead = (notificationId: number) => {
  console.log("Mark notification as read:", notificationId);
  // Mark notification as read
  const notification = profileData.value.notifications.find(
    (n) => n.id === notificationId
  );
  if (notification) {
    notification.read = true;
  }
  // Example: call API to mark notification as read
};

const handleUpdateSettings = (settings: any) => {
  console.log("Update settings:", settings);
  // Update settings in the profile data
  profileData.value.settings = { ...settings };
  // Example: call API to save settings
};

const initializedUser = async (id: string) => {
  try {
    await getUser(id);
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  const id = route.params.id as string;
  await initializedUser(id);
});

// watch(
//   [isAuthenticated, authLoading],
//   ([authenticated, loading]) => {
//     if (!authLoading.value && authenticated && !storeInitialized.value) {
//       initializedUser(route.params.id as string);
//     }
//   },
//   { immediate: true }
// );

// watch(user, (newUser, oldUser) => {}, { immediate: true });
// watch(
//   userData,
//   (newData) => {
//     if (process.server) {
//       console.log(`received change data ${newData}`);
//     }
//   },
//   { immediate: true }
// );
</script>

<template>
  <div>
    <profile
      :profile-data="profileData"
      :initial-tab="activeTab"
      @change-password="handleChangePassword"
      @edit-avatar="handleEditAvatar"
      @edit-profile="handleEditProfile"
      @edit-cover="handleEditCover"
      @toggle2-f-a="handleToggle2FA"
      @revoke-session="handleRevokeSession"
      @mark-as-read="handleMarkAsRead"
      @update-settings="handleUpdateSettings"
    />
  </div>
</template>

<style scoped></style>
