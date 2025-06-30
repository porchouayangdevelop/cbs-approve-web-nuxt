import {useAuthStore} from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  const publicRoutes: string[] = ['/auth/login', '/auth/register', '/auth/unauthorized'];
  if (publicRoutes.includes(to.path)) {
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login');
  }

  if (authStore.checkSessionExpiry()) {
    console.log('Session expired, attempting refresh...');

    const refreshed = await authStore.refreshSession();
    if (!refreshed) return navigateTo('/auth/login');
  } else {
    authStore.updateLastActivity();
  }

})
