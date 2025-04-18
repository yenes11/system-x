'use client';
import { useTranslations } from 'next-intl';

function Translate({ message }: { message: string }) {
  const t = useTranslations();

  return t(message);
}

export default Translate;
