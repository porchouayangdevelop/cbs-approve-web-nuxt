import axios from 'axios';

export default defineNuxtPlugin(nuxtApp => {
  const authApiInstance = axios.create({
    baseURL: useRuntimeConfig().auth_base_url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  const apiInstance = axios.create({
    baseURL: useRuntimeConfig().api_base_url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${useCookie('access_token')?.value || ''}`
    }
  });


  nuxtApp.vueApp.use(authApiInstance);
  nuxtApp.vueApp.use(apiInstance);

  return {
    provide: {
      authApi: authApiInstance,
      api: apiInstance
    }
  }

})
