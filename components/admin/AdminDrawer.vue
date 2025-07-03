<template>
  <aside
      :class="[
      'fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div
        class="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none">
      <!-- Logo -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', currentConfig.logoColor]">
            <UIcon :name="currentConfig.icon" class="w-5 h-5 text-white"/>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            {{ currentConfig.shortTitle }}
          </span>
        </div>

        <!-- Close button (mobile only) -->
        <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark"
            class="lg:hidden"
            @click="$emit('close')"
        />
      </div>

      <!-- Navigation Menu - Vertical Orientation -->
      <nav class="flex-1 overflow-y-auto p-4">
        <div class="space-y-6">
          <template v-for="(section, sectionIndex) in currentConfig.navigationSections" :key="sectionIndex">
            <!-- Section Header -->
            <div v-if="section.title" class="space-y-3">
              <div v-if="sectionIndex > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6"></div>
              <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ section.title }}
              </h3>
            </div>

            <!-- Navigation Items -->
            <div class="space-y-1">
              <template v-for="item in section.items" :key="item.label">
                <!-- Check if user can access this route -->
                <div v-if="!item.children && canAccess(item.to)">
                  <NuxtLink
                      :to="item.to"
                      class="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg border-l-3 transition-all duration-200"
                      :class="[
                      isActiveRoute(item.to)
                        ? 'border-l-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                        : 'border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                      @click="$emit('navigate'); handleDirectNavigation()"
                  >
                    <UIcon
                        :name="item.icon"
                        :class="[
                        'flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200',
                        isActiveRoute(item.to)
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                      ]"
                    />
                    <span class="flex-1 truncate">{{ item.label }}</span>
                    <UBadge
                        v-if="item.badge"
                        :color="item.badgeColor || 'primary'"
                        size="xs"
                        variant="solid"
                    >
                      {{ item.badge }}
                    </UBadge>
                  </NuxtLink>
                </div>

                <!-- Navigation Item with Children (Dropdown) -->
                <div v-else-if="item.children && hasAccessibleChildren(item)" class="space-y-1">
                  <UButton
                      variant="ghost"
                      :class="[
                      'w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg border-l-3 transition-all duration-200',
                      isActiveParent(item)
                        ? 'border-l-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                        : 'border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                      @click="toggleSubmenu(item, currentConfig.navigationSections)"
                  >
                    <template #leading>
                      <UIcon
                          :name="item.icon"
                          :class="[
                          'w-5 h-5 transition-colors duration-200',
                          isActiveParent(item)
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-400 dark:text-gray-500'
                        ]"
                      />
                    </template>

                    <span class="flex-1 text-left truncate">{{ item.label }}</span>

                    <template #trailing>
                      <div class="flex items-center space-x-2">
                        <UBadge
                            v-if="item.badge"
                            :color="item.badgeColor || 'primary'"
                            size="xs"
                            variant="solid"
                        >
                          {{ item.badge }}
                        </UBadge>
                        <UIcon
                            name="i-heroicons-chevron-down"
                            :class="[
                            'w-4 h-4 transition-transform duration-200',
                            item.expanded ? 'rotate-180' : ''
                          ]"
                        />
                      </div>
                    </template>
                  </UButton>

                  <!-- Submenu Items -->
                  <Transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 max-h-0"
                      enter-to-class="opacity-100 max-h-96"
                      leave-active-class="transition-all duration-300 ease-in"
                      leave-from-class="opacity-100 max-h-96"
                      leave-to-class="opacity-0 max-h-0"
                  >
                    <div v-show="item.expanded" class="overflow-hidden">
                      <div class="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                        <template v-for="child in item.children" :key="child.label">
                          <NuxtLink
                              v-if="canAccess(child.to)"
                              :to="child.to"
                              class="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                              :class="[
                            isActiveRoute(child.to)
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                          ]"
                              @click="$emit('navigate'); handleDirectNavigation()"
                          >
                            <UIcon
                                :name="child.icon"
                                :class="[
                              'flex-shrink-0 w-4 h-4 mr-3 transition-colors duration-200',
                              isActiveRoute(child.to)
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                            ]"
                            />
                            <span class="flex-1 truncate">{{ child.label }}</span>
                            <UBadge
                                v-if="child.badge"
                                :color="child.badgeColor || 'primary'"
                                size="xs"
                                variant="soft"
                            >
                              {{ child.badge }}
                            </UBadge>
                          </NuxtLink>
                        </template>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>
          </template>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <UDropdownMenu
            :items="currentConfig.userMenuItems"
            :popper="{ placement: 'top-start' }"
            class="w-full"
        >
          <div
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
            <UAvatar
                :src="userProfile.avatar"
                :alt="userProfile.name"
                size="sm"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ userProfile.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ userProfile.email }}
              </p>
            </div>
            <UIcon name="i-heroicons-chevron-up" class="w-4 h-4 text-gray-400"/>
          </div>
        </UDropdownMenu>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {useRoleSession} from '~/composables/useRoleSession'
import {useGuards} from '~/composables/useGuards'

interface NavigationItem {
  label: string
  to?: string
  icon: string
  badge?: string
  badgeColor?: string
  children?: NavigationItem[]
  expanded?: boolean
}

interface NavigationSection {
  title?: string
  items: NavigationItem[]
}

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  navigate: []
}>()

const route = useRoute()

// Use role session composable
const {
  currentConfig,
  userProfile,
  isActiveRoute,
  isActiveParent,
  toggleSubmenu,
  autoExpandActiveMenus
} = useRoleSession()

// Use guards for access control
const {canAccess} = useGuards()

// Check if navigation item has accessible children
const hasAccessibleChildren = (item: NavigationItem): boolean => {
  if (!item.children) return false
  return item.children.some(child => canAccess(child.to))
}

// Auto-expand active parent menus and close others
watch(() => route.path, () => {
  autoExpandActiveMenus(currentConfig.value.navigationSections)
}, {immediate: true})

// Close expanded menus when navigating to a direct route
const handleDirectNavigation = () => {
  currentConfig.value.navigationSections.forEach(section => {
    section.items.forEach(item => {
      if (item.children && !isActiveParent(item)) {
        item.expanded = false
      }
    })
  })
}

// Watch for role changes and update navigation
watch(() => currentConfig.value, () => {
  autoExpandActiveMenus(currentConfig.value.navigationSections)
}, {deep: true})
</script>