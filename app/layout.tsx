import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
import '@/public/icon-style.css';

const inter = localFont({
  src: '../public/fonts/InterVariable.ttf',
  variable: '--font-inter-local'
});

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html className="overflow-hidden" lang={locale}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <NextTopLoader color="#0d9488" showSpinner={false} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
