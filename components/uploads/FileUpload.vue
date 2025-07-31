<!-- components/FileUploadComponent.vue -->
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// Props definition
interface Props {
  modelValue?: File | null
  maxFileSize?: number // in bytes
  acceptedTypes?: string[]
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  maxFileSize: 10 * 1024 * 1024, // 10MB default
  acceptedTypes: () => [
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv', // .csv
    'application/csv'
  ],
  label: 'Upload File',
  description: 'Excel (.xlsx, .xls) or CSV files only',
  required: false,
  disabled: false,
  placeholder: 'Choose a file...'
})

// Emits definition
interface Emits {
  'update:modelValue': [file: File | null]
  'file-selected': [file: File]
  'file-removed': []
  'validation-error': [error: string]
  'upload-success': [file: File]
}

const emit = defineEmits<Emits>()

// Utility function
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Validation schema
const schema = computed(() => z.object({
  file: z
    .instanceof(File, {
      message: 'Please select a file.'
    })
    .refine((file) => file.size <= props.maxFileSize, {
      message: `File is too large. Maximum size is ${formatBytes(props.maxFileSize)}.`
    })
    .refine((file) => props.acceptedTypes.includes(file.type), {
      message: 'Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.'
    })
    .refine((file) => {
      // Additional validation for file extensions
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      return validExtensions.includes(fileExtension)
    }, {
      message: 'Invalid file extension. Only .xlsx, .xls, and .csv files are allowed.'
    })
}))

type Schema = z.output<ReturnType<typeof schema>>

// Reactive state
const state = reactive<Partial<Schema>>({
  file: props.modelValue || undefined
})

// File input reference
const fileInputRef = ref<HTMLInputElement>()

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  state.file = newValue || undefined
})

// Open file dialog
const openFileDialog = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// Handle file input change
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  handleFileSelect(file)
}

// Remove file
const removeFile = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  handleFileSelect(null)
}

// File selection handler
const handleFileSelect = (file: File | null) => {
  state.file = file || undefined
  emit('update:modelValue', file)
  
  if (file) {
    emit('file-selected', file)
  } else {
    emit('file-removed')
  }
}

// File validation
const validateFile = async (file: File): Promise<boolean> => {
  try {
    await schema.value.parseAsync({ file })
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0]?.message || 'File validation failed'
      emit('validation-error', errorMessage)
    }
    return false
  }
}

// Form submission handler
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (event.data.file) {
    const isValid = await validateFile(event.data.file)
    if (isValid) {
      emit('upload-success', event.data.file)
    }
  }
}

// Get file icon based on type
const getFileIcon = (file: File | undefined) => {
  if (!file) return 'i-lucide-file'
  
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  switch (extension) {
    case '.xlsx':
    case '.xls':
      return 'i-lucide-file-spreadsheet'
    case '.csv':
      return 'i-lucide-file-text'
    default:
      return 'i-lucide-file'
  }
}

// Get file type display name
const getFileTypeDisplay = (file: File | undefined) => {
  if (!file) return ''
  
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  switch (extension) {
    case '.xlsx':
      return 'Excel Workbook'
    case '.xls':
      return 'Excel 97-2003'
    case '.csv':
      return 'CSV File'
    default:
      return 'Unknown'
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField 
      name="file" 
      :label="label" 
      :description="description"
      :required="required"
    >
      <!-- File input reference -->
      <input
        ref="fileInputRef"
        type="file"
        :accept="acceptedTypes.join(',')"
        :disabled="disabled"
        class="hidden"
        @change="onFileChange"
      />
      
      <div class="flex flex-col space-y-3">
        <!-- File selection area -->
        <div 
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
          @click="!disabled && openFileDialog()"
        >
          <UIcon 
            :name="getFileIcon(state.file)" 
            class="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" 
          />
          
          <div v-if="!state.file" class="space-y-2">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ placeholder }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ description }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Max size: {{ formatBytes(maxFileSize) }}
            </p>
          </div>
          
          <div v-else class="space-y-2">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ state.file.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ getFileTypeDisplay(state.file) }} • {{ formatBytes(state.file.size) }}
            </p>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="flex items-center gap-2">
          <UButton
            :label="state.file ? 'Change file' : 'Choose file'"
            color="primary"
            variant="outline"
            size="sm"
            :disabled="disabled"
            @click="openFileDialog()"
          />
          
          <UButton
            v-if="state.file"
            label="Remove"
            color="error"
            variant="ghost"
            size="sm"
            :disabled="disabled"
            @click="removeFile()"
          />
        </div>
      </div>
    </UFormField>
  </UForm>
</template>