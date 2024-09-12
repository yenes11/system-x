import axios from 'axios';
import { getSession } from 'next-auth/react';
import clientCookies from 'js-cookie';
import { decode, encode } from 'next-auth/jwt';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const isServer = typeof window === 'undefined';

// let token: string;

// async function setToken() {
//   const session = await getSession();
//   token = session?.user.accessToken.token || '';
// }

// setToken();

const api = axios.create({
  baseURL,
  headers: {
    // 'Content-Type': 'application/json'
    // Accept: 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    const token = cookies().get('session')?.value;
    const lang = cookies().get('lang')?.value || 'en-US';
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Accept-Language'] = lang;
    }
  } else {
    const token = clientCookies.get('session');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
