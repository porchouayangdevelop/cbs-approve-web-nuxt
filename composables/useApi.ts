import axios, {type AxiosError, type AxiosResponse} from "axios";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useApi = () => {
  const config = useRuntimeConfig();

  // const axiosInstance = axios.create({
  //   baseURL: config.api_base_url,
  // })

  const apiCall = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS',
    url: string,
    data?: any,
    options?: any
  ): Promise<ApiResponse<T>> => {
    const response = reactive<ApiResponse<T>>({
      data: null,
      error: null,
      loading: true
    });

    const {$authApi, $api} = useNuxtApp();

    try {
      const result: AxiosResponse = await $api({
        method,
        url,
        data,
        ...options
      });

      response.data = result.data;
      response.loading = false;

    } catch (e) {
      const error = e as AxiosError
      response.error = error.message || 'An error occurred'
      response.loading = false;
    }
    return response as ApiResponse<T>;
  }


  return {
    get: <T>(url: string, options?: any) => apiCall<T>('GET', url, null, options),
    post: <T>(url: string, data?: any, options?: any) => apiCall<T>('POST', url, data, options),
    put: <T>(url: string, data?: any, options?: any) => apiCall<T>('PUT', url, data, options),
    patch: <T>(url: string, data?: any, options?: any) => apiCall<T>('PATCH', url, data, options),
    delete: <T>(url: string, options?: any) => apiCall<T>('DELETE', url, null, options),
    options: <T>(url: string, options?: any) => apiCall<T>('OPTIONS', url, null, options),
  }
}
