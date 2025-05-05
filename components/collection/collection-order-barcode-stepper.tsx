'use client';

import api from '@/api';
import { CollectionOrderDetails } from '@/lib/types';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { NotebookTabs } from 'lucide-react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import ThemedStepper from '../themed-stepper';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import EditBarcodeStatusSheet from './edit-barcode-status-sheet';

function CollectionOrderBarcodeStepper() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations();
  const params = useParams();
  const [input, setInput] = useState('');
  const [editOpen, setEditOpen] = useState(false);

  const details = useSuspenseQuery<CollectionOrderDetails>({
    queryKey: ['collection-order', params.id],
    queryFn: async () => {
      const response = await api.get(`/CollectionColorOrders/${params.id}`);
      return response.data;
    }
  });

  const sizeBarcode = details.data?.order.sizeBarcode;

  let steps = [
    {
      step: 1,
      title: t('waiting'),
      description: ''
    },
    {
      step: 2,
      title: t('in_progress'),
      description: moment(sizeBarcode.inProgressDate).format('DD/MM/YYYY')
    },
    {
      step: 3,
      title: t('prepared'),
      description: moment(sizeBarcode.preparedDate).format('DD/MM/YYYY')
    },
    {
      step: 4,
      title: t('delivered'),
      description: moment(sizeBarcode.deliveredDate).format('DD/MM/YYYY')
    }
  ];

  const addNote = useMutation({
    mutationFn: async (values: any) => {
      const res = await api.post('/CollectionColorOrderNotes', values);
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['collection-color-order-notes']
      });
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
      setInput('');
    }
  });

  return (
    <Card>
      <CardHeader className="h-16 flex-row items-center gap-2 border-b py-0">
        <NotebookTabs className="size-6" />
        <CardTitle className="flex justify-between text-lg">
          {t('product_station_addresses')}
        </CardTitle>
        <EditBarcodeStatusSheet
          state={{
            data: {
              status: sizeBarcode.status
            },
            open: editOpen
          }}
          setState={setEditOpen}
        />
      </CardHeader>
      <CardContent className="pt-8">
        <ThemedStepper currentStep={sizeBarcode.status} steps={steps} />
      </CardContent>
    </Card>
  );
}

export default CollectionOrderBarcodeStepper;
