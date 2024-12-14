import axios from 'axios';
import clientCookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL
});

api.interceptors.request.use(async (config) => {
  let token;
  let lang;

  if (isServer) {
    const { cookies } = await import('next/headers');
    token = cookies().get('session')?.value;
    lang = cookies().get('lang')?.value || 'en-US';
  } else {
    token = clientCookies.get('session');
    lang = clientCookies.get('lang');
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Accept-Language'] = lang;
  }

  return config;
});

export default api;
