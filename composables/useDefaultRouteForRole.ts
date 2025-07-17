export const useDefaultRouteForRole = () => {

  const defaultRoute = (role?: string): string => {
    const roleRoute: Record<string, string> = {
      'admin': '/admin',
      'checker': '/checker',
      'user': '/user',
    };
    return roleRoute[role?.toLowerCase() || ''] || '/auth/login';
  }
  return {
    defaultRoute,
  };
}
