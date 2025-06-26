<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit User</h3>
      </template>

      <UForm v-if="user" :schema="editUserSchema" :state="form" @submit="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="First Name" name="firstName" required>
            <UInput v-model="form.firstName" />
          </UFormGroup>

          <UFormGroup label="Last Name" name="lastName" required>
            <UInput v-model="form.lastName" />
          </UFormGroup>
        </div>

        <UFormGroup label="Email" name="email" required>
          <UInput v-model="form.email" type="email" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Role" name="role" required>
            <USelectMenu v-model="form.role" :options="['Admin', 'Manager', 'User']" />
          </UFormGroup>

          <UFormGroup label="Department" name="department" required>
            <USelectMenu v-model="form.department" :options="['Engineering', 'Product', 'Sales', 'Marketing']" />
          </UFormGroup>
        </div>

        <UFormGroup label="Phone" name="phone">
          <UInput v-model="form.phone" />
        </UFormGroup>

        <UFormGroup label="Location" name="location">
          <UInput v-model="form.location" />
        </UFormGroup>

        <UFormGroup label="Status" name="status" required>
          <USelectMenu v-model="form.status" :options="['active', 'inactive', 'pending']" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <UButton variant="outline" @click="isOpen = false">Cancel</UButton>
          <UButton @click="handleSubmit" :loading="loading">Update User</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  updated: [user: User]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const loading = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  department: '',
  phone: '',
  location: '',
  status: 'active'
})

const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.string().min(1, 'Status is required'),
  phone: z.string().optional(),
  location: z.string().optional()
})

// Watch for user changes to populate form
watch(() => props.user, (user) => {
  if (user) {
    const [firstName, ...lastNameParts] = user.name.split(' ')
    form.value = {
      firstName,
      lastName: lastNameParts.join(' '),
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || '',
      location: user.location || '',
      status: user.status
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!props.user) return

  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const updatedUser: User = {
      ...props.user,
      name: `${form.value.firstName} ${form.value.lastName}`,
      email: form.value.email,
      role: form.value.role,
      department: form.value.department,
      phone: form.value.phone,
      location: form.value.location,
      status: form.value.status as 'active' | 'inactive' | 'pending'
    }

    emit('updated', updatedUser)

  } catch (error) {
    console.error('Update user error:', error)
  } finally {
    loading.value = false
  }
}
</script>