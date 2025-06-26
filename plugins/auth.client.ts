export default defineNuxtPlugin(async (nuxtApp) => {
  const {getCurrentUser} = useAuth();

  if (process.client) {
    try {
      await getCurrentUser();
    } catch (e) {
      console.error('Failed to initialize auth:', e)
    }
  }
})
