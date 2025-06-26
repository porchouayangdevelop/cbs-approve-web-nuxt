<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New User</h3>
      </template>

      <UForm :schema="createUserSchema" :state="form" @submit="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="First Name" name="firstName" required>
            <UInput v-model="form.firstName" placeholder="John" />
          </UFormGroup>

          <UFormGroup label="Last Name" name="lastName" required>
            <UInput v-model="form.lastName" placeholder="Doe" />
          </UFormGroup>
        </div>

        <UFormGroup label="Email" name="email" required>
          <UInput v-model="form.email" type="email" placeholder="john.doe@company.com" />
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
          <UInput v-model="form.phone" placeholder="+1 (555) 123-4567" />
        </UFormGroup>

        <UFormGroup label="Location" name="location">
          <UInput v-model="form.location" placeholder="San Francisco, CA" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <UButton variant="outline" @click="isOpen = false">Cancel</UButton>
          <UButton @click="handleSubmit" :loading="loading">Create User</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  created: [user: User]
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
  role: 'User',
  department: 'Engineering',
  phone: '',
  location: ''
})

const createUserSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().optional(),
  location: z.string().optional()
})

const handleSubmit = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      name: `${form.value.firstName} ${form.value.lastName}`,
      email: form.value.email,
      role: form.value.role,
      status: 'active',
      department: form.value.department,
      avatar: `https://ui-avatars.com/api/?name=${form.value.firstName}+${form.value.lastName}`,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      phone: form.value.phone,
      location: form.value.location
    }

    emit('created', newUser)

    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      role: 'User',
      department: 'Engineering',
      phone: '',
      location: ''
    }

  } catch (error) {
    console.error('Create user error:', error)
  } finally {
    loading.value = false
  }
}
</script>