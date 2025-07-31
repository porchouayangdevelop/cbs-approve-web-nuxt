<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center mb-6">
          <div
            class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4"
          >
            <UIcon
              name="i-heroicons-document-text"
              class="w-7 h-7 text-white"
            />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Terms of Service
          </h1>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          CBS Approve Web - Last updated: January 2025
        </p>
      </div>

      <!-- Content -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div class="prose prose-blue max-w-none dark:prose-invert">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using CBS Approve Web ("the Service"), you accept
            and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            CBS Approve Web is an approval management system designed to
            streamline organizational workflows and approval processes.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To access our Service, you must create an account. You are
            responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
            <li>Keeping your account information updated</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Upload or transmit malicious code</li>
            <li>Attempt to gain unauthorized access to other accounts</li>
            <li>Interfere with the proper functioning of the Service</li>
          </ul>

          <h2>5. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to
            understand how we collect, use, and protect your information.
          </p>

          <h2>6. Service Availability</h2>
          <p>
            While we strive to maintain continuous service availability, we do
            not guarantee uninterrupted access to the Service.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            CBS Approve Web shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of the Service.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will
            be effective immediately upon posting.
          </p>

          <h2>9. Contact Information</h2>
          <p>
            If you have questions about these Terms of Service, please contact
            us at support@cbsapproveweb.com
          </p>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-8 text-center">
        <UButton
          @click="$router.go(-1)"
          variant="outline"
          icon="i-heroicons-arrow-left"
        >
          Go Back
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [],
  path: "/terms-of-service",
});

useSeoMeta({
  title: "Terms of Service - CBS Approve Web",
  description:
    "Terms of Service for CBS Approve Web approval management system",
});
</script>
