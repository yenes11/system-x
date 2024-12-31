'use client';

import ThemedDialog from '../themed-dialog';
import { CheckCircle } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { toast } from 'sonner';
import { CollectionDraft } from '@/lib/types';

function VerifyCollectionDialog({ details }: { details: CollectionDraft }) {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();

  console.log(details, 'details');

  const verifyCollection = useMutation({
    mutationFn: async () => {
      const response = await api.patch(
        `/CollectionColors/VerifyCollectionColor/${params.id}`
      );
      return response;
    },
    onSuccess: () => {
      toast.success(t('collection_verified'));
      router.refresh();
    }
  });

  return (
    <ThemedDialog
      title={t('verify_collection')}
      contentClassName="text-sm max-w-md"
      triggerIcon={<CheckCircle size={14} className="mr-2" />}
      triggerLabel={t('verify')}
    >
      <p>{t('verify_collection_description')}</p>
      <div className="mt-4 flex w-full justify-end gap-2">
        <DialogClose asChild>
          <Button variant="ghost">{t('cancel')}</Button>
        </DialogClose>
        <Button onClick={() => verifyCollection.mutate()}>
          {t('confirm')}
        </Button>
      </div>
    </ThemedDialog>
  );
}

export default VerifyCollectionDialog;
