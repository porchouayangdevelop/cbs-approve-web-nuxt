import axios, {type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig} from 'axios';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const authApiInstance: AxiosInstance = axios.create({
    baseURL: config.public.auth_url,
    headers: {
      // 'Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  const apiInstance = axios.create({
    baseURL: config.public.api_url,
    headers: {
      'Allow-Origin': '*',
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${useCookie('access_token')?.value || ''}`
    }
  });

  authApiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useCookie('access_token');
    if (token.value) {
      if (!config.headers) {
        config.headers = {} as any
      }
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config;
  }, (error: AxiosError) => Promise.reject(error));

  apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (useCookie("access_token").value) {
      if (!config.headers) {
        config.headers = {} as any
      }
      config.headers.Authorization = `Bearer ${useCookie("access_token").value}`
    }
    return config;
  }, (error: AxiosError) => Promise.reject(error));

  authApiInstance.interceptors.response.use((response) => response, (error) => {
    if (error.response?.data.status === 401) {

      useCookie('access_token').value = null;
      useCookie('access_token').value = null;

      navigateTo('/auth/login')
    }
    return Promise.reject(error);
  });

  return {
    provide: {
      authApi: authApiInstance,
      api: apiInstance
    }
  }

})
