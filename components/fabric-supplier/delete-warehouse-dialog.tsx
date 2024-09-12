'use client';

import api from '@/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface Props {
  state: any;
  setState: any;
}

export function DeleteWarehouseDialog({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const deleteFabric = useMutation({
    mutationKey: ['delete-warehouse'],
    mutationFn: async () => {
      const res = await api.delete(`/FabricSupplierWarehouses/${state.id}`);
      return res.data;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        id: '',
        open: false
      });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    },
    onError: (e) => {}
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
          <DialogTitle className="text-start">Delete warehouse</DialogTitle>
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
            variant="outline"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={() => {
              deleteFabric.mutate();
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
