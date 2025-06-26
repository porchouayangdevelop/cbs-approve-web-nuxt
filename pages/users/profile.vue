<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Profile Cover & Header -->
    <div class="relative">
      <!-- Cover Image -->
      <div class="h-48 md:h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <img
            v-if="profile.coverImage"
            :src="profile.coverImage"
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
            <div class="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <!-- Profile Picture -->
              <div class="relative">
                <UAvatar
                    :src="profile.avatar"
                    :alt="profile.name"
                    size="2xl"
                    class="ring-4 ring-white dark:ring-gray-800 shadow-xl"
                />
                <UButton
                    variant="solid"
                    color="primary"
                    size="xs"
                    icon="i-heroicons-camera"
                    class="absolute bottom-2 right-2 rounded-full"
                    @click="editAvatar"
                />
              </div>

              <!-- Profile Info -->
              <div class="flex-1 min-w-0">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                  <div class="flex flex-col md:flex-row md:items-center justify-between">
                    <div class="min-w-0 flex-1">
                      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                        {{ profile.name }}
                      </h1>
                      <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                        {{ profile.title }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {{ profile.bio }}
                      </p>

                      <!-- Quick Stats -->
                      <div class="flex items-center space-x-6 mt-4">
                        <div class="text-center">
                          <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ profile.stats.projects }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                        </div>
                        <div class="text-center">
                          <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ profile.stats.team }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">Team Size</div>
                        </div>
                        <div class="text-center">
                          <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ profile.stats.experience }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">Years Exp.</div>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center space-x-3 mt-4 md:mt-0">
                      <UButton
                          variant="outline"
                          icon="i-heroicons-envelope"
                          size="sm"
                      >
                        Message
                      </UButton>
                      <UButton
                          variant="solid"
                          icon="i-heroicons-pencil-square"
                          size="sm"
                          @click="editProfile"
                      >
                        Edit Profile
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
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
            </div>

            <nav class="p-2">
              <div class="space-y-1">
                <button
                    v-for="tab in profileTabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                    'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border-l-3 border-l-primary-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-3 border-l-transparent'
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
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Overview</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Personal Information -->
                <div class="space-y-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ profile.email }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-phone" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ profile.phone }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ profile.location }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">Joined {{ profile.joinDate }}</span>
                    </div>
                  </div>
                </div>

                <!-- Professional Details -->
                <div class="space-y-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Professional Details</h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ profile.department }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-identification" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">ID: {{ profile.employeeId }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">Reports to {{ profile.manager }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-clock" class="w-5 h-5 text-gray-400 mr-3" />
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ profile.workSchedule }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skills -->
              <div class="mt-8">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills & Expertise</h3>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                      v-for="skill in profile.skills"
                      :key="skill.name"
                      :color="skill.level === 'expert' ? 'green' : skill.level === 'advanced' ? 'blue' : 'gray'"
                      variant="soft"
                  >
                    {{ skill.name }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Settings Tab -->
            <div v-else-if="activeTab === 'settings'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h2>

              <div class="space-y-8">
                <!-- Email Preferences -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Preferences</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
                      </div>
                      <UToggle v-model="settings.emailNotifications" />
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Marketing Emails</label>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Receive promotional content and updates</p>
                      </div>
                      <UToggle v-model="settings.marketingEmails" />
                    </div>
                  </div>
                </div>

                <!-- Privacy Settings -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Privacy</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Visibility</label>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Make your profile visible to team members</p>
                      </div>
                      <UToggle v-model="settings.profileVisibility" />
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Status</label>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Show when you're online</p>
                      </div>
                      <UToggle v-model="settings.activityStatus" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Tab -->
            <div v-else-if="activeTab === 'security'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>

              <div class="space-y-8">
                <!-- Password -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Password</h3>
                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Password</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                    </div>
                    <UButton variant="outline" size="sm">Change Password</UButton>
                  </div>
                </div>

                <!-- Two-Factor Authentication -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">2FA Status</p>
                      <p class="text-xs text-green-600 dark:text-green-400">Enabled via Authenticator App</p>
                    </div>
                    <UButton variant="outline" size="sm" color="error">Disable 2FA</UButton>
                  </div>
                </div>

                <!-- Active Sessions -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Active Sessions</h3>
                  <div class="space-y-3">
                    <div v-for="session in activeSessions" :key="session.id" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div class="flex items-center space-x-3">
                        <UIcon :name="session.device === 'desktop' ? 'i-heroicons-computer-desktop' : 'i-heroicons-device-phone-mobile'" class="w-5 h-5 text-gray-400" />
                        <div>
                          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ session.browser }} on {{ session.os }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ session.location }} • {{ session.lastActive }}</p>
                        </div>
                      </div>
                      <UButton v-if="!session.current" variant="outline" size="xs" color="error">Revoke</UButton>
                      <UBadge v-else color="success" size="xs">Current</UBadge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Tab -->
            <div v-else-if="activeTab === 'activity'" class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>

              <div class="space-y-4">
                <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    activity.type === 'login' ? 'bg-green-100 dark:bg-green-900' :
                    activity.type === 'update' ? 'bg-blue-100 dark:bg-blue-900' :
                    activity.type === 'security' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-gray-100 dark:bg-gray-700'
                  ]">
                    <UIcon :name="activity.icon" :class="[
                      'w-5 h-5',
                      activity.type === 'login' ? 'text-green-600 dark:text-green-400' :
                      activity.type === 'update' ? 'text-blue-600 dark:text-blue-400' :
                      activity.type === 'security' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-gray-600 dark:text-gray-400'
                    ]" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.timestamp }}</p>
                  </div>
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
definePageMeta({
  layout: 'default'
})

// Profile data
const profile = ref({
  name: 'John Doe',
  title: 'Senior Product Manager',
  bio: 'Passionate about creating exceptional user experiences and leading cross-functional teams to deliver innovative products.',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  department: 'Product Management',
  employeeId: 'EMP001234',
  manager: 'Sarah Wilson',
  workSchedule: 'Full-time, Remote',
  joinDate: 'January 2020',
  avatar: 'https://avatars.githubusercontent.com/u/739984?v=4',
  coverImage: '',
  stats: {
    projects: 24,
    team: 12,
    experience: 8
  },
  skills: [
    { name: 'Product Strategy', level: 'expert' },
    { name: 'User Research', level: 'advanced' },
    { name: 'Agile/Scrum', level: 'expert' },
    { name: 'Data Analysis', level: 'advanced' },
    { name: 'Leadership', level: 'expert' },
    { name: 'UI/UX Design', level: 'intermediate' }
  ]
})

// Tab navigation
const activeTab = ref('overview')

const profileTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'i-heroicons-user'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth'
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'i-heroicons-shield-check',
    badge: '2',
    badgeColor: 'yellow'
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: 'i-heroicons-clock'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'i-heroicons-bell',
    badge: '5',
    badgeColor: 'red'
  }
]

// Settings
const settings = ref({
  emailNotifications: true,
  marketingEmails: false,
  profileVisibility: true,
  activityStatus: true
})

// Active sessions
const activeSessions = ref([
  {
    id: 1,
    device: 'desktop',
    browser: 'Chrome',
    os: 'macOS',
    location: 'San Francisco, CA',
    lastActive: '2 minutes ago',
    current: true
  },
  {
    id: 2,
    device: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    location: 'San Francisco, CA',
    lastActive: '1 hour ago',
    current: false
  }
])

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    type: 'login',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    title: 'Logged in',
    description: 'Successful login from Chrome on macOS',
    timestamp: '2 minutes ago'
  },
  {
    id: 2,
    type: 'update',
    icon: 'i-heroicons-pencil-square',
    title: 'Profile updated',
    description: 'Updated bio and contact information',
    timestamp: '2 hours ago'
  },
  {
    id: 3,
    type: 'security',
    icon: 'i-heroicons-shield-check',
    title: 'Password changed',
    description: 'Successfully updated account password',
    timestamp: '1 day ago'
  }
])

// Methods
const editProfile = () => {
  console.log('Edit profile')
  // Navigate to edit mode or open modal
}

const editAvatar = () => {
  console.log('Edit avatar')
  // Open file picker or avatar editor
}

const editCover = () => {
  console.log('Edit cover')
  // Open file picker for cover image
}

// SEO
useSeoMeta({
  title: `${profile.value.name} - Profile`,
  description: `View and manage ${profile.value.name}'s profile information and settings.`
})
</script>