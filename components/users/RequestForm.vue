<template>
  <div class="max-w-6xl mx-auto p-6">
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Request</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Submit a new request with all requierror information and attachments</p>
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
              <UFormGroup label="Request ID" name="requests.id" requierror>
                <UInput
                    v-model.number="form.requests.id"
                    type="number"
                    placeholder="Auto-generated"
                    icon="i-heroicons-hashtag"
                    :disabled="true"
                />
              </UFormGroup>

              <UFormGroup label="Form Type" name="requests.form_type" requierror>
                <USelectMenu
                    v-model="form.requests.form_type"
                    :options="formTypeOptions"
                    :items="formTypeOptions"
                    placeholder="Select form type"
                    @change="onFormTypeChange"
                    class="w-48"
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Form Name" name="requests.form_name" requierror>
              <UInput
                  v-model="form.requests.form_name"
                  placeholder="Enter form name or select from suggestions"
                  icon="i-heroicons-document-text"
              />
              <!-- Form name suggestions based on form type -->
              <div v-if="formNameSuggestions.length > 0" class="mt-2">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggestions:</p>
                <div class="flex flex-wrap gap-1">
                  <UButton
                      v-for="suggestion in formNameSuggestions"
                      :key="suggestion"
                      variant="outline"
                      size="xs"
                      @click="form.requests.form_name = suggestion"
                      class="cursor-pointer"
                  >
                    {{ suggestion }}
                  </UButton>
                </div>
              </div>
            </UFormGroup>

            <!-- Personnel Information -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-3 space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Personnel Information</h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UFormGroup label="Role ID" name="requests.roleId" requierror>
                  <USelectMenu
                      v-model="form.requests.roleId"
                      :options="roleOptions"
                      :items="roleOptions"
                      placeholder="Select role"
                      @change="onRoleChange"
                      class="w-48"
                  />
                </UFormGroup>

                <UFormGroup label="Branch" name="requests.branch" requierror>
                  <USelectMenu
                      v-model="form.requests.branch"
                      :options="branchOptions"
                      :items="branchOptions"
                      placeholder="Select branch"
                      searchable
                      class="w-48"
                  />
                </UFormGroup>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UFormGroup label="Teller" name="requests.teller" requierror>
                  <UInput
                      v-model="form.requests.teller"
                      placeholder="Teller name"
                      icon="i-heroicons-user"
                      class="w-48"
                  />
                </UFormGroup>

                <UFormGroup label="Position" name="requests.position" requierror>
                  <USelectMenu
                      v-model="form.requests.position"
                      :options="filteerrorPositions"
                      :items="filteerrorPositions"
                      placeholder="Select position"
                      class="w-48"
                  />
                </UFormGroup>

                <UFormGroup label="Level" name="requests.level" requierror>
                  <USelectMenu
                      v-model="form.requests.level"
                      :options="levelOptions"
                      :items="levelOptions"
                      placeholder="Select level"
                      class="w-48"
                  />
                </UFormGroup>
              </div>
            </div>

            <!-- Priority and Urgency -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-3 space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Priority and Urgency </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <UFormGroup label="Priority" name="requests.priority">
                  <USelectMenu
                      v-model="form.requests.priority"
                      :options="priorityOptions"
                      :items="priorityOptions"
                      placeholder="Select priority"
                      class="w-48"
                  />
                </UFormGroup>

                <UFormGroup label="Due Date" name="requests.dueDate">
                  <UInput
                      v-model="form.requests.dueDate"
                      type="date"
                      icon="i-heroicons-calendar"
                      class="w-48"
                  />
                </UFormGroup>

                <UFormGroup label="Status" name="requests.status" requierror>
                  <USelectMenu
                      v-model="form.requests.status"
                      :options="statusOptions"
                      :items="statusOptions"
                      placeholder="Select status"
                      class="w-48"
                  />
                </UFormGroup>
              </div>
            </div>

            <!-- Request Data with Rich Text Editor -->
            <UFormGroup label="Request Details" name="requests.data" requierror>
              <div class="space-y-2">
                <div class="flex items-center space-x-2 mb-2">
                  <UButton
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-bold"
                      @click="insertMarkdown('**', '**')"
                      class="cursor-pointer"
                  />
                  <UButton
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-italic"
                      @click="insertMarkdown('*', '*')"
                      class="cursor-pointer"
                  />
                  <UButton
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-list-bullet"
                      @click="insertMarkdown('- ', '')"
                      class="cursor-pointer"
                  />
                  <UButton
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-link"
                      @click="insertMarkdown('[Link Text](', ')')"
                      class="cursor-pointer"
                  />
                </div>
                <UTextarea
                    ref="dataTextarea"
                    v-model="form.requests.data"
                    placeholder="Enter detailed request information... (Supports basic markdown)"
                    :rows="8"
                    resize
                    class="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Character count: {{ form.requests.data.length }}/2000
                </p>
              </div>
            </UFormGroup>

            <!-- Attachments Section -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Attachments</h3>

              <!-- Multiple file upload -->
              <div class="space-y-4">
                <div
                    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                    @click="triggerFileUpload"
                    @dragover.prevent
                    @drop.prevent="handleFileDrop"
                >
                  <input
                      ref="fileInput"
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      multiple
                      class="hidden"
                      @change="handleFileUpload"
                  >

                  <UIcon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p class="text-gray-600 dark:text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500">
                    PNG, JPG, PDF, DOC, TXT up to 10MB each (Max 5 files)
                  </p>
                </div>

                <!-- File List -->
                <div v-if="attachments.length > 0" class="space-y-2">
                  <h4 class="font-medium text-gray-900 dark:text-white">Attached Files:</h4>
                  <div class="space-y-2">
                    <div
                        v-for="(attachment, index) in attachments"
                        :key="index"
                        class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div class="flex items-center space-x-3">
                        <UIcon :name="getFileIcon(attachment.type)" class="w-5 h-5 text-gray-400" />
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ attachment.name }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(attachment.size) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <UButton
                            v-if="attachment.type.startsWith('image/')"
                            variant="ghost"
                            size="xs"
                            icon="i-heroicons-eye"
                            @click="previewFile(attachment)"
                            class="cursor-pointer"
                        />
                        <UButton
                            variant="ghost"
                            size="xs"
                            icon="i-heroicons-trash"
                            color="error"
                            @click="removeAttachment(index)"
                            class="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Options -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Additional Options</h3>
              </template>

              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <UCheckbox
                      v-model="form.requests.notifySubmission"
                      id="notify-submission"
                  />
                  <label for="notify-submission" class="text-sm text-gray-700 dark:text-gray-300">
                    Send email notification upon submission
                  </label>
                </div>

                <div class="flex items-center space-x-3">
                  <UCheckbox
                      v-model="form.requests.allowComments"
                      id="allow-comments"
                  />
                  <label for="allow-comments" class="text-sm text-gray-700 dark:text-gray-300">
                    Allow reviewers to add comments
                  </label>
                </div>

                <div class="flex items-center space-x-3">
                  <UCheckbox
                      v-model="form.requests.isConfidential"
                      id="is-confidential"
                  />
                  <label for="is-confidential" class="text-sm text-gray-700 dark:text-gray-300">
                    Mark as confidential
                  </label>
                </div>
              </div>
            </UCard>

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
                  variant="outline"
                  size="lg"
                  @click="saveDraft"
                  :disabled="loading"
                  icon="i-heroicons-document-duplicate"
                  class="cursor-pointer"
              >
                Save Draft
              </UButton>
              <UButton
                  type="submit"
                  size="lg"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                  icon="i-heroicons-paper-airplane"
                  class="cursor-pointer"
              >
                Submit Request
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>

      <!-- Enhanced Sidebar -->
      <div class="space-y-6">
        <!-- Form Progress -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Form Progress</h3>
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
              <div v-for="field in requierrorFields" :key="field.key" class="flex items-center">
                <UIcon
                    :name="field.completed ? 'i-heroicons-check-circle' : 'i-heroicons-minus-circle'"
                    :class="field.completed ? 'text-green-500' : 'text-gray-400'"
                    class="w-4 h-4 mr-2"
                />
                {{ field.label }}
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
            <UButton  class="cursor-pointer" variant="outline" block size="sm" @click="loadTemplate" icon="i-heroicons-document-duplicate">
              Load Template
            </UButton>

            <UButton  class="cursor-pointer" variant="outline" block size="sm" @click="previewRequest" icon="i-heroicons-eye">
              Preview Request
            </UButton>

            <UButton  class="cursor-pointer" variant="outline" block size="sm" @click="exportData" icon="i-heroicons-arrow-down-tray">
              Export Data
            </UButton>

            <UButton  class="cursor-pointer" variant="outline" block size="sm" @click="scheduleSubmission" icon="i-heroicons-clock">
              Schedule Submission
            </UButton>
          </div>
        </UCard>

        <!-- Help & Guidelines -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Guidelines</h3>
          </template>

          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-start space-x-2">
              <UIcon name="i-heroicons-information-circle" class="w-4 h-4 mt-0.5 text-blue-500" />
              <p>Ensure all requierror fields are completed before submission.</p>
            </div>
            <div class="flex items-start space-x-2">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 mt-0.5 text-yellow-500" />
              <p>Standard processing time is 3-5 business days.</p>
            </div>
            <div class="flex items-start space-x-2">
              <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mt-0.5 text-green-500" />
              <p>All submissions are encrypted and secure.</p>
            </div>
          </div>
        </UCard>

        <!-- Form Statistics -->
        <UCard v-if="formStats">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h3>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Average Processing Time</span>
              <span class="text-sm font-medium">{{ formStats.avgProcessingTime }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
              <span class="text-sm font-medium">{{ formStats.approvalRate }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Similar Requests</span>
              <span class="text-sm font-medium">{{ formStats.similarRequests }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- File Preview Modal -->
    <UModal v-model="showPreviewModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">File Preview</h3>
        </template>

        <div v-if="previewFile" class="text-center">
          <img
              v-if="previewFile.type.startsWith('image/')"
              :src="previewFile.url"
              :alt="previewFile.name"
              class="max-w-full max-h-96 mx-auto rounded-lg"
          />
          <div v-else class="p-8">
            <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">{{ previewFile.name }}</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton  class="cursor-pointer" @click="showPreviewModal = false">Close</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Define enhanced interface
interface EnhancedRequest {
  id: number
  form_type: string
  form_name: string
  attachedImage: string
  roleId: string
  branch: string
  teller: string
  position: string
  level: string
  status: string
  data: string
  priority?: string
  dueDate?: string
  notifySubmission?: boolean
  allowComments?: boolean
  isConfidential?: boolean
}

interface EnhancedRequestForm {
  requests: EnhancedRequest
  image: string
}

interface FileAttachment {
  name: string
  size: number
  type: string
  url: string
}

// Emit events
const emit = defineEmits<{
  submitted: [request: EnhancedRequestForm]
  saved: [request: EnhancedRequestForm]
  cancelled: []
}>()

// State
const loading = ref(false)
const fileInput = ref<HTMLInputElement>()
const dataTextarea = ref<HTMLTextAreaElement>()
const toast = useToast()
const attachments = ref<FileAttachment[]>([])
const showPreviewModal = ref(false)
const previewFile = ref<FileAttachment | null>(null)

// Enhanced form data
const form = ref<EnhancedRequestForm>({
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
    status: 'Draft',
    data: '',
    priority: 'Medium',
    dueDate: '',
    notifySubmission: true,
    allowComments: true,
    isConfidential: false
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
    data: z.string().min(10, 'Request data must be at least 10 characters').max(2000, 'Request data must be less than 2000 characters'),
    priority: z.string().optional(),
    dueDate: z.string().optional(),
    notifySubmission: z.boolean().optional(),
    allowComments: z.boolean().optional(),
    isConfidential: z.boolean().optional()
  }),
  image: z.string().optional()
})

// Enhanced options
const formTypeOptions = [
  'Leave Request',
  'Expense Report',
  'Equipment Request',
  'Access Request',
  'Training Request',
  'Transfer Request',
  'Maintenance Request',
  'Policy Exception',
  'Budget Approval',
  'Other'
]

const priorityOptions = [
  'Low',
  'Medium',
  'High',
  'Critical'
]

const roleOptions = [
  'ADMIN',
  'MANAGER',
  'SUPERVISOR',
  'TELLER',
  'OFFICER',
  'CLERK',
  'ANALYST',
  'SPECIALIST'
]

const branchOptions = [
  'Main Branch',
  'Downtown Branch',
  'North Branch',
  'South Branch',
  'East Branch',
  'West Branch',
  'Online Banking',
  'Mobile Banking',
  'Corporate Office'
]

const allPositions = [
  'Branch Manager',
  'Assistant Manager',
  'Senior Teller',
  'Teller',
  'Customer Service Representative',
  'Loan Officer',
  'Senior Loan Officer',
  'Accountant',
  'Senior Accountant',
  'Financial Analyst',
  'Operations Specialist',
  'Compliance Officer',
  'Risk Analyst',
  'IT Specialist',
  'Security Officer'
]

const levelOptions = [
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
  'Level 5',
  'Senior Level',
  'Management Level'
]

const statusOptions = [
  'Draft',
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Completed',
  'On Hold'
]

// Computed properties
const formNameSuggestions = computed(() => {
  const suggestions: Record<string, string[]> = {
    'Leave Request': [
      'Annual Leave Application',
      'Sick Leave Request',
      'Emergency Leave Request',
      'Maternity/Paternity Leave',
      'Study Leave Application'
    ],
    'Expense Report': [
      'Travel Expense Reimbursement',
      'Office Supplies Purchase',
      'Client Entertainment Expenses',
      'Training Course Expenses',
      'Equipment Purchase Request'
    ],
    'Equipment Request': [
      'New Computer Request',
      'Office Furniture Request',
      'Software License Request',
      'Mobile Device Request',
      'Printer/Scanner Request'
    ],
    'Access Request': [
      'System Access Request',
      'Building Access Request',
      'VPN Access Request',
      'Database Access Request',
      'Application Permission Request'
    ]
  }
  return suggestions[form.value.requests.form_type] || []
})

const filteredPositions = computed(() => {
  // Filter positions based on selected role
  const roleBasedPositions: Record<string, string[]> = {
    'TELLER': ['Teller', 'Senior Teller'],
    'MANAGER': ['Branch Manager', 'Assistant Manager'],
    'OFFICER': ['Loan Officer', 'Senior Loan Officer', 'Compliance Officer'],
    'ANALYST': ['Financial Analyst', 'Risk Analyst'],
    'ADMIN': allPositions
  }
  return roleBasedPositions[form.value.requests.roleId] || allPositions
})

const isFormValid = computed(() => {
  try {
    requestFormSchema.parse(form.value)
    return true
  } catch {
    return false
  }
})

const requiredFields = computed(() => [
  { key: 'id', label: 'Request ID', completed: !!form.value.requests.id },
  { key: 'form_type', label: 'Form Type', completed: !!form.value.requests.form_type },
  { key: 'form_name', label: 'Form Name', completed: !!form.value.requests.form_name },
  { key: 'roleId', label: 'Role ID', completed: !!form.value.requests.roleId },
  { key: 'branch', label: 'Branch', completed: !!form.value.requests.branch },
  { key: 'teller', label: 'Teller', completed: !!form.value.requests.teller },
  { key: 'position', label: 'Position', completed: !!form.value.requests.position },
  { key: 'level', label: 'Level', completed: !!form.value.requests.level },
  { key: 'status', label: 'Status', completed: !!form.value.requests.status },
  { key: 'data', label: 'Request Data', completed: form.value.requests.data.length >= 10 }
])

const completionPercentage = computed(() => {
  const completedFields = requiredFields.value.filter(field => field.completed).length
  return Math.round((completedFields / requiredFields.value.length) * 100)
})

const formStats = computed(() => ({
  avgProcessingTime: '3.2 days',
  approvalRate: 87,
  similarRequests: 23
}))

// Methods
const onFormTypeChange = () => {
  // Auto-suggest form name based on type
  if (formNameSuggestions.value.length > 0) {
    form.value.requests.form_name = formNameSuggestions.value[0]
  }
}

const onRoleChange = () => {
  // Reset position when role changes
  form.value.requests.position = ''
}

const insertMarkdown = (before: string, after: string) => {
  if (!dataTextarea.value) return

  const textarea = dataTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.requests.data.substring(start, end)

  const newText = form.value.requests.data.substring(0, start) +
      before + selectedText + after +
      form.value.requests.data.substring(end)

  form.value.requests.data = newText

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  })
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
}

const handleFileDrop = (event: DragEvent) => {
  const files = Array.from(event.dataTransfer?.files || [])
  processFiles(files)
}

const processFiles = (files: File[]) => {
  if (attachments.value.length + files.length > 5) {
    // toast.error('Maximum 5 files allowed', { title: 'Upload Limit' })
    return
  }

  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      // toast.error(`File ${file.name} is too large (max 10MB)`, { title: 'File Too Large' })
      return
    }

    const url = URL.createObjectURL(file)
    attachments.value.push({
      name: file.name,
      size: file.size,
      type: file.type,
      url
    })
  })

  // toast.success(`${files.length} file(s) uploaded successfully`, { title: 'Upload Complete' })
}

const removeAttachment = (index: number) => {
  URL.revokeObjectURL(attachments.value[index].url)
  attachments.value.splice(index, 1)
}

const previewFileModal = (attachment: FileAttachment) => {
  previewFile.value = attachment
  showPreviewModal.value = true
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return 'i-heroicons-photo'
  if (type.includes('pdf')) return 'i-heroicons-document'
  if (type.includes('word')) return 'i-heroicons-document-text'
  return 'i-heroicons-document'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  loading.value = true

  try {
    const validatedData = requestFormSchema.parse(form.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Submitting request:', validatedData)
    console.log('Attachments:', attachments.value)

    emit('submitted', validatedData)

    // toast.success('Request submitted successfully!', {
    //   title: 'Success',
    //   action: {
    //     label: 'View Request',
    //     handler: () => console.log('View request')
    //   }
    // })

    resetForm()

  } catch (error) {
    console.error('Error submitting request:', error)

    if (error instanceof z.ZodError) {
      // toast.error('Please check all required fields', {
      //   title: 'Validation Error'
      // })
    } else {
      // toast.error('Failed to submit request. Please try again.', {
      //   title: 'Submission Error',
      //   action: {
      //     label: 'Retry',
      //     handler: () => handleSubmit()
      //   }
      // })
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

    // toast.success('Draft saved successfully!', {
    //   title: 'Draft Saved'
    // })

    // Save to localStorage for persistence
    localStorage.setItem(`request_draft_${form.value.requests.id}`, JSON.stringify(form.value))

  } catch (error) {
    // toast.error('Failed to save draft', {
    //   title: 'Save Error'
    // })
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    requests: {
      id: Date.now(),
      form_type: '',
      form_name: '',
      attachedImage: '',
      roleId: '',
      branch: '',
      teller: '',
      position: '',
      level: '',
      status: 'Draft',
      data: '',
      priority: 'Medium',
      dueDate: '',
      notifySubmission: true,
      allowComments: true,
      isConfidential: false
    },
    image: ''
  }
  attachments.value = []
}

const loadTemplate = () => {
  const templates = {
    'Leave Request': {
      form_type: 'Leave Request',
      form_name: 'Annual Leave Application',
      priority: 'Medium',
      data: `Dear Manager,

I would like to request annual leave for the following period:

**Leave Duration:** [Start Date] to [End Date]
**Total Days:** [Number of days]
**Reason:** [Brief reason for leave]

**Coverage Arrangements:**
- [Name] will handle urgent matters
- All pending tasks will be completed before departure

**Contact Information:**
- Emergency contact: [Phone number]
- Email: [Email address] (checked periodically)

Thank you for your consideration.

Best regards,
[Your name]`
    },
    'Expense Report': {
      form_type: 'Expense Report',
      form_name: 'Travel Expense Reimbursement',
      priority: 'Medium',
      data: `**Expense Report Details:**

**Trip Purpose:** [Business purpose]
**Travel Dates:** [Start date] to [End date]
**Destination:** [Location]

**Expense Breakdown:**
- Transportation: $[Amount]
- Accommodation: $[Amount]
- Meals: $[Amount]
- Other: $[Amount]

**Total Amount:** $[Total]

**Notes:**
[Any additional notes or explanations]

All receipts are attached for verification.`
    }
  }

  const template = templates[form.value.requests.form_type as keyof typeof templates]
  if (template) {
    Object.assign(form.value.requests, template)
    // toast.info('Template loaded successfully', {
    //   title: 'Template Applied'
    // })
  } else {
    // toast.warning('No template available for this form type', {
    //   title: 'Template Not Found'
    // })
  }
}

const previewRequest = async () => {
  try {
    // Validate form before preview
    const validatedData = requestFormSchema.parse(form.value)

    // For new requests, create a preview with current form data
    const previewData = {
      ...validatedData,
      attachments: attachments.value.map(a => ({
        name: a.name,
        size: a.size,
        type: a.type,
        url: a.url
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        formProgress: completionPercentage.value,
        estimatedProcessingTime: formStats.value.avgProcessingTime,
        similarRequestsCount: formStats.value.similarRequests
      }
    }

    // Store preview data in session storage for the preview page
    sessionStorage.setItem('requestPreviewData', JSON.stringify(previewData))

    // Navigate to preview page
    await navigateTo('/users/request-preview')

    // toast.success('Opening preview...', {
    //   title: 'Preview Ready'
    // })

  } catch (error) {
    if (error instanceof z.ZodError) {
      // toast.error('Please complete all required fields before preview', {
      //   title: 'Validation Error'
      // })
    } else {
      // toast.error('Failed to generate preview', {
      //   title: 'Preview Error'
      // })
    }
  }
}

// Add new method for viewing existing requests
const viewExistingRequest = (requestId: string) => {
  // Navigate to request view page
  navigateTo(`/users/requests/${requestId}`)
}

const exportData = () => {
  const exportData = {
    ...form.value,
    attachments: attachments.value.map(a => ({ name: a.name, size: a.size, type: a.type })),
    exportedAt: new Date().toISOString()
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `request-${form.value.requests.id || 'draft'}-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  // toast.success('Data exported successfully!', {
  //   title: 'Export Complete'
  // })
}

const scheduleSubmission = () => {
  // toast.info('Schedule submission feature coming soon!', {
  //   title: 'Feature Preview'
  // })
}

// Load draft on mount if exists
const loadDraft = () => {
  const draftKey = `request_draft_${form.value.requests.id}`
  const savedDraft = localStorage.getItem(draftKey)

  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft)
      form.value = draft
      // toast.info('Draft loaded from previous session', {
      //   title: 'Draft Restored'
      // })
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }
}

// Auto-save functionality
const autoSave = debounce(() => {
  if (form.value.requests.data.length > 0) {
    const draftKey = `request_draft_${form.value.requests.id}`
    localStorage.setItem(draftKey, JSON.stringify(form.value))
  }
}, 30000) // Auto-save every 30 seconds

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }) as T
}

// Watch for changes to auto-save
watch(() => form.value.requests.data, autoSave)

// Auto-generate ID on mount
onMounted(() => {
  form.value.requests.id = Date.now()
  loadDraft()
})

// Cleanup on unmount
onUnmounted(() => {
  // Cleanup object URLs
  attachments.value.forEach(attachment => {
    URL.revokeObjectURL(attachment.url)
  })
})

// SEO
useSeoMeta({
  title: 'Create Request - Request Management',
  description: 'Create a new request with all required error information and attachments'
})
</script>
<style scoped lang="css">

</style>