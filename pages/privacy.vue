<!-- pages/privacy-policy.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center mb-6">
          <div
            class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4"
          >
            <UIcon name="i-heroicons-shield-check" class="w-7 h-7 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
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
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as:</p>
          <ul>
            <li>Account information (name, email, username)</li>
            <li>Profile information (department, position, phone number)</li>
            <li>Approval requests and related documents</li>
            <li>Communication and support interactions</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process approval requests and workflows</li>
            <li>Send administrative notifications</li>
            <li>Provide customer support</li>
            <li>Ensure security and prevent fraud</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To authorized personnel within your organization</li>
            <li>When required by law or legal process</li>
            <li>To protect our rights and safety</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to
            provide our services and fulfill the purposes outlined in this
            policy.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
          </ul>

          <h2>7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience
            and improve our services. You can control cookie settings through
            your browser.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at privacy@cbsapproveweb.com
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
  path: '/privacy-policy',
});

useSeoMeta({
  title: "Privacy Policy - CBS Approve Web",
  description: "Privacy Policy for CBS Approve Web approval management system",
});
</script>