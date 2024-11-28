'use client';

import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import { ClipboardCopyIcon, CopyIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

function Code({
  children,
  className,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  const t = useTranslations();
  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children).then(() => {
        toast.success(t('copied_to_clipboard'), {
          // description: t('collection_code_copied_to_clipboard')
        });
      });
    }
  };

  return (
    <code
      className={clsx('group relative overflow-hidden', className)}
      {...rest}
    >
      {children}
      <span
        onClick={handleCopy}
        className="absolute right-0 top-1/2 flex h-full -translate-y-1/2 cursor-pointer items-center border-l bg-soft px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <ClipboardCopyIcon />
      </span>
    </code>
  );
}

export default Code;
