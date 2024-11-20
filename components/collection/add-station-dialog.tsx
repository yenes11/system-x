'use client';

import { useTranslations } from 'next-intl';
import ThemedDialog from '../themed-dialog';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { BasicEntity } from '@/lib/types';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../ui/icon';
import TransferList from './transfer-list';
import ThemedSheet from '../themed-sheet';
import { Button } from '../ui/button';
import { useParams, useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import { AxiosError } from 'axios';

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
      toast({
        title: t('success'),
        description: t('product_station_added')
      });
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as { Title: string };
      const errorMessage = responseData.Title || t('unknown_error');
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive'
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
