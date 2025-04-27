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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  state: any;
  setState: any;
  mutationKey: Array<string | number>;
  endpoint: string;
  title: string;
  onSuccessMessage?: string;
  submessage?: string;
}

export default function ConfirmDeleteDialog({
  state,
  setState,
  mutationKey,
  endpoint,
  title,
  onSuccessMessage,
  submessage
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();

  const confirmDelete = useMutation({
    mutationKey,
    mutationFn: async () => {
      const res = await api.delete(`${endpoint}/${state.id}`);
      return res.data;
    },
    onSuccess: (res) => {
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: mutationKey
      });
      setState((prev: any) => ({
        ...prev,
        open: false
      }));

      toast.success(t('item_deleted'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onOpenChange = (val: boolean) => {
    setState((prev: any) => ({ ...prev, open: val }));
  };

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[425px]">
        <DialogHeader className="">
          <DialogTitle className="border-b bg-muted/50 p-4 text-start">
            {title}
          </DialogTitle>
          <DialogDescription className="p-4 text-start">
            {submessage || t('confirm_delete')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row items-center border-t bg-muted/50 px-4 py-2">
          <Button
            size="sm"
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
            size="sm"
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
