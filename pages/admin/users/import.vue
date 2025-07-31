<script setup lang="ts">
import FileUpload from "~/components/uploads/FileUpload.vue";

definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

// Reactive state for the selected file
const selectedFile = ref<File | null>(null);
const isProcessing = ref(false);
const uploadMessage = ref("");

// Handle file selection
const handleFileSelected = (file: File) => {
  console.log("File selected:", file.name, file.type, file.size);
  uploadMessage.value = `Selected: ${file.name}`;
};

// Handle file removal
const handleFileRemoved = () => {
  console.log("File removed");
  uploadMessage.value = "File removed";
  selectedFile.value = null;
};

// Handle validation errors
const handleValidationError = (error: string) => {
  console.error("Validation error:", error);
  uploadMessage.value = `Error: ${error}`;
};

// Handle successful upload/validation
const handleUploadSuccess = async (file: File) => {
  console.log("Upload success:", file);
  isProcessing.value = true;
  uploadMessage.value = "Processing file...";

  try {
    // Here you would typically:
    // 1. Read the file content
    // 2. Parse CSV/Excel data
    // 3. Send to API
    // 4. Process the data

    // Example of reading file content
    if (file.type === "text/csv" || file.type === "application/csv") {
      await processCSVFile(file);
    } else {
      await processExcelFile(file);
    }

    uploadMessage.value = "";
    const toast = useToast();
    toast.add({
      title: "Process",
      description: "Process document ",
      icon: "i-lucide-check-check",
      color: "success",
      duration:1000
    });
  } catch (error) {
    console.error("Processing error:", error);
    uploadMessage.value = "Error processing file";
  } finally {
    isProcessing.value = false;
  }
};

// Process CSV file
const processCSVFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      console.log("CSV Content:", csvContent);
      // Process CSV data here
      resolve(csvContent);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Process Excel file
const processExcelFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      console.log("Excel ArrayBuffer:", arrayBuffer);
      // Process Excel data here (you'd use a library like SheetJS)
      resolve(arrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Programmatically clear the file
const clearFile = () => {
  selectedFile.value = null;
};

// Check if file is selected
const hasFile = computed(() => selectedFile.value !== null);

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Create a user by import file</h1>

    <!-- File Upload Component -->
    <div class="mb-6">
      <FileUpload
        v-model="selectedFile"
        label="Import Data File"
        description="Upload your Excel or CSV file to import data"
        :max-file-size="50 * 1024 * 1024"
        placeholder="Drop your file here or click to browse"
        required
        @file-selected="handleFileSelected"
        @file-removed="handleFileRemoved"
        @validation-error="handleValidationError"
        @upload-success="handleUploadSuccess"
      />
    </div>

    <!-- Status Messages -->
    <div v-if="uploadMessage" class="mb-4">
      <UAlert
        variant="outline"
        :color="uploadMessage.startsWith('Error') ? 'error' : 'success'"
        :title="uploadMessage"
        :loading="isProcessing"
      />
    </div>

    <!-- File Information -->
    <div v-if="hasFile" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
      <h3 class="font-semibold mb-2">File Information:</h3>
      <ul class="text-sm space-y-1">
        <li><strong>Name:</strong> {{ selectedFile?.name }}</li>
        <li>
          <strong>Size:</strong>
          {{ selectedFile?.size ? formatBytes(selectedFile.size) : "N/A" }}
        </li>
        <li><strong>Type:</strong> {{ selectedFile?.type }}</li>
        <li>
          <strong>Last Modified:</strong>
          {{
            selectedFile?.lastModified
              ? new Date(selectedFile.lastModified).toLocaleString()
              : "N/A"
          }}
        </li>
      </ul>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <UButton
        v-if="hasFile && !isProcessing"
        label="Process File"
        color="primary"
        @click="handleUploadSuccess(selectedFile!)"
      />

      <UButton
        v-if="hasFile"
        label="Clear File"
        color="tertiary"
        variant="outline"
        :disabled="isProcessing"
        @click="clearFile"
      />
    </div>

    <!-- Custom Upload with Different Settings -->
    <!-- <div class="mt-12">
      <h2 class="text-xl font-semibold mb-4">Custom Configuration Example</h2>

      <FileUpload
        v-model="selectedFile"
        label="Large File Upload"
        description="Upload large Excel files (up to 50MB)"
        :max-file-size="50 * 1024 * 1024"
        :accepted-types="[
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]"
        placeholder="Excel files only (.xlsx)"
        @file-selected="
          (file) => console.log('Large file selected:', file.name)
        "
        @validation-error="(error) => console.error('Large file error:', error)"
      />
    </div> -->
  </div>
</template>

<style scoped></style>
