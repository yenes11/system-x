'use client';

import api from '@/api';
import { BasicEntity } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import ThemedDialog from '../themed-dialog';
import { Button } from '../ui/button';
import Icon from '../ui/icon';
import TransferList from './transfer-list';

function AddStationDialog() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<BasicEntity[]>([]);
  const [allStations, setAllStations] = useState<BasicEntity[]>([]);
  const [selectedStations, setSelectedStations] = useState<BasicEntity[]>([]);

  const productStations = useQuery({
    queryKey: ['product-stations'],
    queryFn: async () => {
      const res = await api.get('/ProductStations');
      console.log(res.data, 'sssss');
      setAllStations(res.data);
      return res.data;
    }
  });

  const addProductStation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/CollectionProductionStations', data);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = () => {
    const data = {
      collectionId: params?.id,
      productStations: selectedStations.map((stataion, index) => ({
        productStationId: stataion.id,
        priority: index + 1
      }))
    };
    addProductStation.mutate(data);
  };

  return (
    <ThemedDialog
      open={open}
      setOpen={setOpen}
      triggerLabel={t('add')}
      title={t('add_product_station')}
      footer={
        <div>
          <Button onClick={onSubmit}>{t('save')}</Button>
        </div>
      }
    >
      <TransferList
        leftItems={allStations}
        rightItems={selectedStations}
        onChangeLeft={setAllStations as any}
        onChangeRight={setSelectedStations as any}
      />
    </ThemedDialog>
  );
}

export default AddStationDialog;

function Item(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
    active
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto'
  };

  return (
    <div
      className={`${!props.isLast && 'border-b'} bg-muted px-6 py-4 text-sm`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Icon icon="element-2" size={16} currentColor className="mr-4" />
      {`${props.item.name}`}
    </div>
  );
}
