interface CheckAuth {
  role: string;
}

export const useCheckAuth = () => {
  const {decodeToken} = useJWTDecoder();
  const role = decodeToken(useCookie('access_token').value);

  const checkRole = computed(() => role);

  return {
    checkRole
  }

}
