export const useRoleNavigation = () => {
  const {user} = useAuth();

  const getDefaultRoutes = () => {
    if (!user.value) return '/auth/login';

    switch (user.value?.role.toLowerCase()) {
      case 'admin':
        return '/admin';
      case 'checker':
        return '/checkers';
      case 'user':
        return '/users';
      default:
        return '/';
    }
  }

  const canRegister = () => {
    return user.value?.role.toLowerCase() === 'admin';
  }

  return {
    getDefaultRoutes,
    canRegister,
  }
}
