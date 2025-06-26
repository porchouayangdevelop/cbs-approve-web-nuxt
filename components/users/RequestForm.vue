<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <UButton
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="$router.go(-1)"
        >
          Back
        </UButton>
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Request</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Submit a new request with all required information and attachments</p>
    </div>

    <!-- Form Container -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center space-x-3">
              <UIcon name="i-heroicons-document-plus" class="w-6 h-6 text-primary-600" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Request Information</h2>
            </div>
          </template>

          <UForm :schema="requestFormSchema" :state="form" @submit="handleSubmit" class="space-y-6">
            <!-- Request Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Request ID" name="requests.id" required>
                <UInput
                    v-model.number="form.requests.id"
                    type="number"
                    placeholder="Enter request ID"
                    icon="i-heroicons-hashtag"
                />
              </UFormGroup>

              <UFormGroup label="Form Type" name="requests.form_type" required>
                <USelectMenu
                    v-model="form.requests.form_type"
                    :options="formTypeOptions"
                    placeholder="Select form type"
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Form Name" name="requests.form_name" required>
              <UInput
                  v-model="form.requests.form_name"
                  placeholder="Enter form name"
                  icon="i-heroicons-document-text"
              />
            </UFormGroup>

            <!-- Personnel Information -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Personnel Information</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Role ID" name="requests.roleId" required>
                  <USelectMenu
                      v-model="form.requests.roleId"
                      :options="roleOptions"
                      placeholder="Select role"
                  />
                </UFormGroup>

                <UFormGroup label="Branch" name="requests.branch" required>
                  <USelectMenu
                      v-model="form.requests.branch"
                      :options="branchOptions"
                      placeholder="Select branch"
                  />
                </UFormGroup>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UFormGroup label="Teller" name="requests.teller" required>
                  <UInput
                      v-model="form.requests.teller"
                      placeholder="Teller name"
                      icon="i-heroicons-user"
                  />
                </UFormGroup>

                <UFormGroup label="Position" name="requests.position" required>
                  <USelectMenu
                      v-model="form.requests.position"
                      :options="positionOptions"
                      placeholder="Select position"
                  />
                </UFormGroup>

                <UFormGroup label="Level" name="requests.level" required>
                  <USelectMenu
                      v-model="form.requests.level"
                      :options="levelOptions"
                      placeholder="Select level"
                  />
                </UFormGroup>
              </div>
            </div>

            <!-- Status and Data -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Status" name="requests.status" required>
                <USelectMenu
                    v-model="form.requests.status"
                    :options="statusOptions"
                    placeholder="Select status"
                />
              </UFormGroup>

              <UFormGroup label="Attached Image" name="requests.attachedImage">
                <UInput
                    v-model="form.requests.attachedImage"
                    placeholder="Image URL or path"
                    icon="i-heroicons-photo"
                />
              </UFormGroup>
            </div>

            <!-- Request Data -->
            <UFormGroup label="Request Data" name="requests.data" required>
              <UTextarea
                  v-model="form.requests.data"
                  placeholder="Enter detailed request information..."
                  :rows="6"
                  resize
              />
            </UFormGroup>

            <!-- Image Upload Section -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Supporting Image</h3>

              <!-- Image URL Input -->
              <UFormGroup label="Image URL" name="image">
                <UInput
                    v-model="form.image"
                    placeholder="Enter image URL or upload image"
                    icon="i-heroicons-link"
                />
              </UFormGroup>

              <!-- File Upload Area -->
              <div class="mt-4">
                <div
                    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                    @click="triggerFileUpload"
                    @dragover.prevent
                    @drop.prevent="handleFileDrop"
                >
                  <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleFileUpload"
                  >

                  <UIcon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p class="text-gray-600 dark:text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              <!-- Image Preview -->
              <div v-if="imagePreview" class="mt-4">
                <div class="relative inline-block">
                  <img
                      :src="imagePreview"
                      alt="Preview"
                      class="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                  <UButton
                      variant="solid"
                      color="red"
                      size="xs"
                      icon="i-heroicons-x-mark"
                      class="absolute -top-2 -right-2 rounded-full"
                      @click="removeImage"
                  />
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <UButton
                  class="cursor-pointer"
                  variant="outline"
                  size="lg"
                  @click="resetForm"
                  :disabled="loading"
              >
                Reset
              </UButton>
              <UButton
                  class="cursor-pointer"
                  variant="outline"
                  size="lg"
                  @click="saveDraft"
                  :disabled="loading"
              >
                Save Draft
              </UButton>
              <UButton
                  class="cursor-pointer"
                  type="submit"
                  size="lg"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
              >
                <template #leading>
                  <UIcon name="i-heroicons-paper-airplane" />
                </template>
                Submit Request
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Form Status -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Form Status</h3>
          </template>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Completion</span>
              <span class="text-sm font-medium">{{ completionPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                  class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>

            <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div class="flex items-center">
                <UIcon
                    :name="form.requests.id ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                    :class="form.requests.id ? 'text-green-500' : 'text-gray-400'"
                    class="w-4 h-4 mr-2"
                />
                Request ID
              </div>
              <div class="flex items-center">
                <UIcon
                    :name="form.requests.form_type ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                    :class="form.requests.form_type ? 'text-green-500' : 'text-gray-400'"
                    class="w-4 h-4 mr-2"
                />
                Form Type
              </div>
              <div class="flex items-center">
                <UIcon
                    :name="form.requests.data ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                    :class="form.requests.data ? 'text-green-500' : 'text-gray-400'"
                    class="w-4 h-4 mr-2"
                />
                Request Data
              </div>
            </div>
          </div>
        </UCard>

        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </template>

          <div class="space-y-3">
            <UButton class="cursor-pointer" variant="outline" block size="sm" @click="loadTemplate">
              <template #leading>
                <UIcon name="i-heroicons-document-duplicate" />
              </template>
              Load Template
            </UButton>

            <UButton class="cursor-pointer" variant="outline" block size="sm" @click="previewRequest">
              <template #leading>
                <UIcon name="i-heroicons-eye" />
              </template>
              Preview Request
            </UButton>

            <UButton class="cursor-pointer" variant="outline" block size="sm" @click="exportData">
              <template #leading>
                <UIcon name="i-heroicons-arrow-down-tray" />
              </template>
              Export Data
            </UButton>
          </div>
        </UCard>

        <!-- Preview Card -->
        <UCard v-if="isFormValid">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Preview</h3>
          </template>

          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <pre class="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">{{ JSON.stringify(form, null, 2) }}</pre>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { RequestForm } from '~/types'

definePageMeta({
  layout: 'default'
})

// Emit events
const emit = defineEmits<{
  submitted: [request: RequestForm]
  saved: [request: RequestForm]
  cancelled: []
}>()

// State
const loading = ref(false)
const fileInput = ref<HTMLInputElement>()
const imagePreview = ref<string>('')
const toast = useToast()

// Form data matching RequestForm interface
const form = ref<RequestForm>({
  requests: {
    id: 0,
    form_type: '',
    form_name: '',
    attachedImage: '',
    roleId: '',
    branch: '',
    teller: '',
    position: '',
    level: '',
    status: '',
    data: ''
  },
  image: ''
})

// Validation schema
const requestFormSchema = z.object({
  requests: z.object({
    id: z.number().min(1, 'Request ID is required'),
    form_type: z.string().min(1, 'Form type is required'),
    form_name: z.string().min(1, 'Form name is required'),
    attachedImage: z.string().optional(),
    roleId: z.string().min(1, 'Role ID is required'),
    branch: z.string().min(1, 'Branch is required'),
    teller: z.string().min(1, 'Teller is required'),
    position: z.string().min(1, 'Position is required'),
    level: z.string().min(1, 'Level is required'),
    status: z.string().min(1, 'Status is required'),
    data: z.string().min(10, 'Request data must be at least 10 characters')
  }),
  image: z.string().optional()
})

// Options for select menus
const formTypeOptions = [
  'Leave Request',
  'Expense Report',
  'Equipment Request',
  'Access Request',
  'Training Request',
  'Transfer Request',
  'Other'
]

const roleOptions = [
  'ADMIN',
  'MANAGER',
  'SUPERVISOR',
  'TELLER',
  'OFFICER',
  'CLERK'
]

const branchOptions = [
  'Main Branch',
  'Downtown Branch',
  'North Branch',
  'South Branch',
  'East Branch',
  'West Branch',
  'Online Banking'
]

const positionOptions = [
  'Branch Manager',
  'Assistant Manager',
  'Senior Teller',
  'Teller',
  'Customer Service',
  'Loan Officer',
  'Accountant'
]

const levelOptions = [
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
  'Level 5'
]

const statusOptions = [
  'Draft',
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Completed'
]

// Computed
const isFormValid = computed(() => {
  try {
    requestFormSchema.parse(form.value)
    return true
  } catch {
    return false
  }
})

const completionPercentage = computed(() => {
  const requiredFields = [
    form.value.requests.id,
    form.value.requests.form_type,
    form.value.requests.form_name,
    form.value.requests.roleId,
    form.value.requests.branch,
    form.value.requests.teller,
    form.value.requests.position,
    form.value.requests.level,
    form.value.requests.status,
    form.value.requests.data
  ]

  const completedFields = requiredFields.filter(field =>
      field !== null && field !== undefined && field !== '' && field !== 0
  ).length

  return Math.round((completedFields / requiredFields.length) * 100)
})

// Methods
const handleSubmit = async () => {
  loading.value = true

  try {
    const validatedData = requestFormSchema.parse(form.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Submitting request:', validatedData)

    emit('submitted', validatedData)

    toast.success('Request submitted successfully!', {
      title: 'Success',
      action: {
        label: 'View Request',
        handler: () => console.log('View request')
      }
    })

    resetForm()

  } catch (error) {
    console.error('Error submitting request:', error)

    if (error instanceof z.ZodError) {
      toast.error('Please check all required fields', {
        title: 'Validation Error'
      })
    } else {
      toast.error('Failed to submit request. Please try again.', {
        title: 'Submission Error',
        action: {
          label: 'Retry',
          handler: () => handleSubmit()
        }
      })
    }
  } finally {
    loading.value = false
  }
}

const saveDraft = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Set status to draft
    form.value.requests.status = 'Draft'

    emit('saved', form.value)

    toast.success('Draft saved successfully!', {
      title: 'Draft Saved'
    })

  } catch (error) {
    toast.error('Failed to save draft', {
      title: 'Save Error'
    })
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    requests: {
      id: 0,
      form_type: '',
      form_name: '',
      attachedImage: '',
      roleId: '',
      branch: '',
      teller: '',
      position: '',
      level: '',
      status: '',
      data: ''
    },
    image: ''
  }
  imagePreview.value = ''
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    processFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]

  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file', {
      title: 'Invalid File Type'
    })
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must be less than 10MB', {
      title: 'File Too Large'
    })
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    imagePreview.value = result
    form.value.image = result
    form.value.requests.attachedImage = file.name

    toast.success('Image uploaded successfully!', {
      title: 'Upload Complete'
    })
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = ''
  form.value.image = ''
  form.value.requests.attachedImage = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const loadTemplate = () => {
  // Load a template
  form.value.requests = {
    ...form.value.requests,
    form_type: 'Leave Request',
    form_name: 'Annual Leave Application',
    status: 'Draft',
    data: 'Please approve my annual leave request for...'
  }

  toast.info('Template loaded', {
    title: 'Template'
  })
}

const previewRequest = () => {
  toast.info('Opening preview window...', {
    title: 'Preview'
  })
}

const exportData = () => {
  const dataStr = JSON.stringify(form.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `request-${form.value.requests.id || 'draft'}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast.success('Data exported successfully!', {
    title: 'Export Complete'
  })
}

// Auto-generate ID on mount
onMounted(() => {
  form.value.requests.id = Date.now()
})

// SEO
useSeoMeta({
  title: 'Create Request - Request Management',
  description: 'Create a new request with all required information and attachments'
})
</script>

<style scoped>
/* Custom drag and drop styles */
.drag-over {
  border-color: rgb(59 130 246);
  background-color: rgb(59 130 246 / 0.05);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.3s ease-in-out;
}

/* File upload hover effect */
.file-upload-area:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Form validation styles */
.form-field-error {
  border-color: rgb(239 68 68);
}

.form-field-success {
  border-color: rgb(34 197 94);
}
</style>