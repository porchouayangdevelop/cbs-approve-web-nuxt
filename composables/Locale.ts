export const locale = () => {

  return useState<string>('locale', () => useDefaultLocale().value);
}
export const useDefaultLocale = (fallback = 'en-US') => {
  const locale = ref(fallback);

  if (import.meta.server) {
    const reqLocale = useRequestHeaders()['accept-language']?.split(',')[0]
    if (reqLocale) {
      locale.value = reqLocale
    }
  } else if (import.meta.client) {
    const navLang = navigator.language
    if (navLang) {
      locale.value = navLang
    }
  }
  return locale
}

export const useLocales = () => {
  const locale = locale()
  const locales = ref([
    'en-US',
    'en-GB',
    ...
      'ja-JP-u-ca-japanese'
  ])
  if (!locales.value.includes(locale.value)) {
    locales.value.unshift(locale.value)
  }
  return locales
}

export const useLocaleDate = (date: Ref<Date> | Date, locale = locale()) => {
  return computed(() => new Intl.DateTimeFormat(locale.value, {dateStyle: 'full'}).format(unref(date)))
}