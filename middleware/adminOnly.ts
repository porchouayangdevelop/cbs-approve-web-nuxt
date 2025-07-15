export default defineNuxtRouteMiddleware((to, from) => {
  const {user} = useAuth();
  const {hasRole} = useGuards();

  if (!user.value || !hasRole('admin')) {
    throw createError({
      statusCode: 403,
      statusMessage: ''
    })
  }

})
