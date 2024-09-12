import { getRequestConfig } from 'next-intl/server';
import clientCookies from 'js-cookie';
import { isServer } from '@tanstack/react-query';
import { cookies } from 'next/headers';

const languages = {
  'en-US': 'en',
  'tr-TR': 'tr'
};

export default getRequestConfig(async () => {
  const selectedLanguage = cookies().get('lang')
    ?.value as keyof typeof languages;

  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = languages[selectedLanguage || 'en-US'];

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
