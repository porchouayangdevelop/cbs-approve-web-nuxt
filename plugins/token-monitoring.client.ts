export default defineNuxtPlugin(nuxtApp => {
    const { isAuthenticated } = useAuth();
    const { publicRoutes } = useRoutePublic();
    const { initializeTokenMonitoring } = useTokenExpiration();
    const route = useRoute();

    const shouldMonitor = computed(() => {
        return isAuthenticated.value && !publicRoutes.value.includes(route.path);
    })


    watch(shouldMonitor, (s) => {
        if (s) {
            initializeTokenMonitoring();
        }

    }, { immediate: true })
})
