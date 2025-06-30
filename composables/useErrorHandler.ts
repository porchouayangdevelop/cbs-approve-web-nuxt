export const useErrorHandler = () => {
  const toast = useToast();

  const handleAuthError = async (err: any) => {
    const {logout} = useAuth();

    switch (err.statusCode) {
      case 401:
        toast.add({title: 'Your session has expired. Please log in again.',});
        await logout();
        break
      case 403:
        toast.add({title: `You don't have permission to perform this action.`,})
        navigateTo('/auth/unauthorized');
        break;
      case 429:
        toast.add({title: 'Too many requests. Please try again later.'})
        break;
      default:
        toast.add({title: 'An unexpected error occurred. Please try again.'})
    }
  }

  const handleApiError = async (err: any) => {
    console.error('API Error:', err);

    if (err.statusCode >= 400 && err.statusCode < 500) {
      await handleAuthError(err);
    } else {
      toast.add({title: 'Server error. Please contact support if the problem persists.'})
    }
  }

  return {
    handleAuthError,
    handleApiError,
  }
}
