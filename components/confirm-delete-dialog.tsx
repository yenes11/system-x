'use client';

import api from '@/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import moment from 'moment';
import { toast } from 'sonner';
import { BadgeCheck } from 'lucide-react';
import { AxiosError } from 'axios';

interface Props {
  state: any;
  setState: any;
  mutationKey: Array<string | number>;
  endpoint: string;
  title: string;
  onSuccessMessage?: string;
}

export default function ConfirmDeleteDialog({
  state,
  setState,
  mutationKey,
  endpoint,
  title,
  onSuccessMessage
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const path = usePathname();

  const confirmDelete = useMutation({
    mutationKey,
    mutationFn: async () => {
      const res = await api.delete(`${endpoint}/${state.id}`);
      return res.data;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        id: '',
        open: false
      });

      toast.success(t('item_deleted'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  return (
    <Dialog
      open={state.open}
      onOpenChange={(val) => {
        setState((prev: any) => ({ ...prev, open: val }));
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-start">{title}</DialogTitle>
          <DialogDescription className="text-start">
            {t('confirm_delete')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() =>
              setState({
                id: '',
                open: false
              })
            }
            variant="ghost"
          >
            {t('cancel')}
          </Button>
          <Button
            loading={confirmDelete.isPending}
            onClick={() => {
              confirmDelete.mutate();
            }}
            variant="destructive"
          >
            {t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
