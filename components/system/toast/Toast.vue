<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      <TransitionGroup
          name="toast"
          tag="div"
          class="space-y-2"
      >
        <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'pointer-events-auto max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300',
              getToastClasses(toast.type)
            ]"
            @mouseenter="pauseTimer(toast.id)"
            @mouseleave="resumeTimer(toast.id)"
        >
          <div class="p-4">
            <div class="flex items-start">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  getIconBgClasses(toast.type)
                ]">
                  <UIcon
                      :name="getIcon(toast.type)"
                      :class="[
                        'w-4 h-4',
                        getIconClasses(toast.type)
                      ]"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="ml-3 w-0 flex-1">
                <p v-if="toast.title" class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ toast.title }}
                </p>
                <p :class="[
                  'text-sm',
                  toast.title ? 'mt-1 text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                ]">
                  {{ toast.message }}
                </p>

                <!-- Action Button -->
                <div v-if="toast.action" class="mt-3">
                  <UButton
                      size="xs"
                      variant="outline"
                      @click="handleAction(toast)"
                  >
                    {{ toast.action.label }}
                  </UButton>
                </div>
              </div>

              <!-- Close Button -->
              <div class="ml-4 flex-shrink-0 flex">
                <UButton
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    @click="removeToast(toast.id)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                />
              </div>
            </div>

            <!-- Progress Bar -->
            <div
                v-if="toast.duration && toast.duration > 0"
                class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden"
            >
              <div
                  :class="[
                    'h-1 rounded-full transition-all duration-100 ease-linear',
                    getProgressClasses(toast.type)
                  ]"
                  :style="{ width: `${getProgress(toast)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// Toast interface
interface ToastAction {
  label: string
  handler: () => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number // in milliseconds, 0 = persistent
  action?: ToastAction
  createdAt: number
  pausedAt?: number
  pausedDuration?: number
}

// Toast store
const toasts = ref<Toast[]>([])
const timers = new Map<string, NodeJS.Timeout>()

// Methods
const addToast = (options: Omit<Toast, 'id' | 'createdAt'>) => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const toast: Toast = {
    id,
    createdAt: Date.now(),
    duration: options.duration ?? getDefaultDuration(options.type),
    ...options
  }

  toasts.value.unshift(toast)

  // Auto remove after duration
  if (toast.duration && toast.duration > 0) {
    startTimer(toast)
  }

  return id
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
    clearTimer(id)
  }
}

const clearAllToasts = () => {
  toasts.value.forEach(toast => clearTimer(toast.id))
  toasts.value = []
}

const startTimer = (toast: Toast) => {
  if (!toast.duration || toast.duration <= 0) return

  const remainingTime = toast.duration - (toast.pausedDuration || 0)

  const timer = setTimeout(() => {
    removeToast(toast.id)
  }, remainingTime)

  timers.set(toast.id, timer)
}

const clearTimer = (id: string) => {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

const pauseTimer = (id: string) => {
  const toast = toasts.value.find(t => t.id === id)
  if (!toast || !toast.duration) return

  clearTimer(id)
  toast.pausedAt = Date.now()
}

const resumeTimer = (id: string) => {
  const toast = toasts.value.find(t => t.id === id)
  if (!toast || !toast.duration || !toast.pausedAt) return

  const pausedTime = Date.now() - toast.pausedAt
  toast.pausedDuration = (toast.pausedDuration || 0) + pausedTime
  toast.pausedAt = undefined

  startTimer(toast)
}

const getProgress = (toast: Toast): number => {
  if (!toast.duration || toast.duration <= 0) return 0

  const elapsed = toast.pausedAt
      ? toast.pausedAt - toast.createdAt
      : Date.now() - toast.createdAt

  const totalPausedDuration = toast.pausedDuration || 0
  const effectiveElapsed = elapsed - totalPausedDuration

  return Math.max(0, 100 - (effectiveElapsed / toast.duration) * 100)
}

const handleAction = (toast: Toast) => {
  if (toast.action?.handler) {
    toast.action.handler()
    removeToast(toast.id)
  }
}

const getDefaultDuration = (type: Toast['type']): number => {
  const durations = {
    success: 4000,
    info: 5000,
    warning: 6000,
    error: 7000
  }
  return durations[type]
}

const getToastClasses = (type: Toast['type']): string => {
  const classes = {
    success: 'border-l-4 border-l-green-500',
    error: 'border-l-4 border-l-red-500',
    warning: 'border-l-4 border-l-yellow-500',
    info: 'border-l-4 border-l-blue-500'
  }
  return classes[type]
}

const getIcon = (type: Toast['type']): string => {
  const icons = {
    success: 'i-heroicons-check-circle',
    error: 'i-heroicons-x-circle',
    warning: 'i-heroicons-exclamation-triangle',
    info: 'i-heroicons-information-circle'
  }
  return icons[type]
}

const getIconBgClasses = (type: Toast['type']): string => {
  const classes = {
    success: 'bg-green-100 dark:bg-green-900',
    error: 'bg-red-100 dark:bg-red-900',
    warning: 'bg-yellow-100 dark:bg-yellow-900',
    info: 'bg-blue-100 dark:bg-blue-900'
  }
  return classes[type]
}

const getIconClasses = (type: Toast['type']): string => {
  const classes = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
  }
  return classes[type]
}

const getProgressClasses = (type: Toast['type']): string => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[type]
}

// Provide toast functions globally
provide('addToast', addToast)
provide('removeToast', removeToast)
provide('clearAllToasts', clearAllToasts)

// Cleanup on unmount
onUnmounted(() => {
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
})
</script>

<style scoped>
/* Toast animations */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for long messages */
.toast-content {
  max-height: 200px;
  overflow-y: auto;
}

.toast-content::-webkit-scrollbar {
  width: 4px;
}

.toast-content::-webkit-scrollbar-track {
  background: transparent;
}

.toast-content::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.toast-content::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>