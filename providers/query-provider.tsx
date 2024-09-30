// In Next.js, this file would be called: app/providers.jsx
'use client';

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  isServer
} from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';

function makeQueryClient() {
  const t = useTranslations();
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000
      },
      mutations: {
        onError: (error: Error) => {
          const axiosError = error as AxiosError;
          const responseData = axiosError.response?.data as { Title: string };
          const errorMessage = responseData.Title || t('unknown_error');
          toast({
            title: t('error'),
            description: errorMessage,
            variant: 'destructive'
          });
        }
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // const [queryClient] = useState(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         queries: {
  //           // With SSR, we usually want to set some default staleTime
  //           // above 0 to avoid refetching immediately on the client
  //           staleTime: 4 * 1000,
  //           refetchInterval: 4 * 1000,
  //         },
  //       },
  //     })
  // );
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
