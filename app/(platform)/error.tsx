'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface Props {
  error: {
    digest: string;
    message: string;
    stack: string;
  };
}

function ErrorPage({ error }: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-xl">{error.message}</h1>

      <div>
        <Button onClick={() => window.location.reload()} className="mr-4">
          {t('try_again')}
        </Button>
        <Button onClick={() => router.push('/dashboard')} variant="secondary">
          {t('go_home')}
        </Button>
      </div>
    </div>
  );
}

export default ErrorPage;
