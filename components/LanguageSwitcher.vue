<!-- components/system/LanguageSwitcher.vue -->
<template>
  <UDropdownMenu :items="languageMenuItems" :popper="{ placement: 'bottom-end' }">
    <UButton
        variant="ghost"
        size="sm"
        class="flex items-center space-x-2"
    >
      <span class="text-lg">{{ currentLanguage.flag }}</span>
      <span class="hidden sm:inline">{{ currentLanguage.name }}</span>
      <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const { $t } = useI18n()

// Define language flags and display names
const languageConfig = {
  en: { flag: '🇺🇸', name: 'English' },
  lo: { flag: '🇱🇦', name: 'ລາວ' }
}

// Available languages
const availableLocales = computed(() => {
  return (locales.value as any[]).map(locale => ({
    code: locale.code,
    name: languageConfig[locale.code as keyof typeof languageConfig]?.name || locale.name,
    flag: languageConfig[locale.code as keyof typeof languageConfig]?.flag || '🌐'
  }))
})

// Current language
const currentLanguage = computed(() => {
  const current = availableLocales.value.find(lang => lang.code === locale.value)
  return current || availableLocales.value[0]
})

// Menu items for dropdown
const languageMenuItems = computed(() => [
  availableLocales.value.map(lang => ({
    label: lang.name,
    icon: lang.flag,
    click: () => switchLanguage(lang.code),
    disabled: lang.code === locale.value
  }))
])

// Switch language function
const switchLanguage = async (newLocale: string) => {
  try {
    await setLocale(newLocale)

    // Show success toast
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-language',
      title: newLocale === 'en' ? 'Language changed to English' : 'ພາສາປ່ຽນເປັນລາວແລ້ວ',
      color: 'success',
    })

    // Save preference to localStorage
    if (process.client) {
      localStorage.setItem('preferred-language', newLocale)
    }

  } catch (error) {
    console.error('Failed to switch language:', error)

    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-exclamation-triangle',
      title: 'Failed to change language',
      color: 'error'
    })
  }
}

// Load saved language preference on mount
onMounted(() => {
  if (process.client) {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && savedLanguage !== locale.value) {
      setLocale(savedLanguage)
    }
  }
})
</script>