export const useRoutePublic = () => {
  const publicRoutes  = computed(() => {
    return [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/unauthorized',
      '/contact',
      '/help',
      '/systems/help',
      '/systems/contact'
    ]
  })

  return  {
    publicRoutes,
  }
}
