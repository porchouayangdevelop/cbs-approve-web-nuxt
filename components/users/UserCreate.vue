<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <UButton
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="$router.go(-1)"
            class="cursor-pointer"
        >
          Back
        </UButton>
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New User</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Add a new user to the system with associated user details</p>
    </div>

    <!-- Create Form -->
    <UCard>
      <template #header>
        <div class="flex items-center space-x-3">
          <UIcon name="i-heroicons-user-plus" class="w-6 h-6 text-primary-600" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">User Information</h2>
        </div>
      </template>

      <UForm :schema="userCreateSchema" :state="form" @submit="handleSubmit" class="space-y-6">
        <!-- Main User Field -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>

          <UFormGroup label="User" name="user" required>
            <UInput
                v-model="form.user"
                placeholder="Enter user identifier or name"
                icon="i-heroicons-user"
                size="lg"
            />
          </UFormGroup>
        </div>

        <!-- User Details Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">User Details</h3>
            <UButton
                variant="outline"
                size="sm"
                icon="i-heroicons-plus"
                @click="addUserDetail"
                class="cursor-pointer"
            >
              Add Detail
            </UButton>
          </div>

          <div v-if="form.user_detail.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">No user details added yet</p>
            <UButton
                variant="solid"
                icon="i-heroicons-plus"
                @click="addUserDetail"
                class="cursor-pointer"
            >
              Add First Detail
            </UButton>
          </div>

          <!-- User Detail Items -->
          <div v-else class="space-y-4">
            <div
                v-for="(detail, index) in form.user_detail"
                :key="index"
                class="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div class="flex items-start justify-between mb-4">
                <h4 class="font-medium text-gray-900 dark:text-white">Detail #{{ index + 1 }}</h4>
                <UButton
                    variant="ghost"
                    color="error"
                    size="xs"
                    icon="i-heroicons-trash"
                    @click="removeUserDetail(index)"
                    class="flex-shrink-0 cursor-pointer"

                >
                  Remove
                </UButton>
              </div>

              <UFormGroup :label="`Detail ID #${index + 1}`" :name="`user_detail.${index}.id`" required>
                <UInput
                    v-model.number="detail.id"
                    type="number"
                    placeholder="Enter detail ID"
                    icon="i-heroicons-hashtag"
                />
              </UFormGroup>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <UButton
              variant="outline"
              size="lg"
              @click="resetForm"
              :disabled="loading"
              class="cursor-pointer"
          >
            Reset
          </UButton>
          <UButton
              type="submit"
              size="lg"
              :loading="loading"
              :disabled="loading || !isFormValid"
              class="cursor-pointer"
          >
            <template #leading>
              <UIcon name="i-heroicons-check" />
            </template>
            Create User
          </UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Preview Section -->
<!--    <UCard v-if="isFormValid" class="mt-6">-->
<!--      <template #header>-->
<!--        <div class="flex items-center space-x-3">-->
<!--          <UIcon name="i-heroicons-eye" class="w-5 h-5 text-blue-600" />-->
<!--          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Preview</h3>-->
<!--        </div>-->
<!--      </template>-->

<!--      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">-->
<!--        <pre class="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">{{ JSON.stringify(form, null, 2) }}</pre>-->
<!--      </div>-->
<!--    </UCard>-->
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { UserCreate } from '~/types'
const toast = useToast();

// Emit events for parent components
const emit = defineEmits<{
  created: [user: UserCreate]
  cancelled: []
}>()

// State
const loading = ref(false)

// Form data matching UserCreate interface
const form = ref<UserCreate>({
  user: '',
  user_detail: []
})

// Validation schema
const userCreateSchema = z.object({
  user: z.string().min(1, 'User field is required'),
  user_detail: z.array(z.object({
    id: z.number().min(1, 'Detail ID must be a positive number')
  })).min(1, 'At least one user detail is required')
})

// Computed
const isFormValid = computed(() => {
  try {
    userCreateSchema.parse(form.value)
    return true
  } catch {
    return false
  }
})

// Methods
const addUserDetail = () => {
  form.value.user_detail.push({
    id: form.value.user_detail.length + 1
  })
}

const removeUserDetail = (index: number) => {
  form.value.user_detail.splice(index, 1)
}

const resetForm = () => {
  form.value = {
    user: '',
    user_detail: []
  }
}

const handleSubmit = async () => {
  loading.value = true

  try {
    // Validate form
    const validatedData = userCreateSchema.parse(form.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Creating user with data:', validatedData)

    // Emit success event
    emit('created', validatedData)

    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'User created successfully!',
      duration: 3000,
      type:'foreground',
      progress: true,
    })

    // Show success notification
    console.log('User created successfully!')

    // Optionally redirect or reset form
    resetForm()

    // Navigate back to users list
    await navigateTo('/users')

  } catch (error) {
    console.error('Error creating user:', error)

    // Show error notification
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      toast.add({
        icon: 'i-heroicons-exclamation-circle',
        title: 'Failed to create user. Please check the form for errors.',
      })
    } else {
      console.error('Failed to create user. Please try again.')
    }
  } finally {
    loading.value = false
  }
}

// Auto-add first detail when component mounts
onMounted(() => {
  addUserDetail()
})

// SEO
useSeoMeta({
  title: 'Create User - User Management',
  description: 'Create a new user with associated details in the system'
})
</script>

<style scoped>
/* Custom styles for better visual hierarchy */
.detail-item {
  transition: all 0.2s ease-in-out;
}

.detail-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Animation for adding/removing items */
.detail-enter-active,
.detail-leave-active {
  transition: all 0.3s ease;
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>