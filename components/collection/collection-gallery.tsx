'use client';

import { CollectionGallery as CollectionImage } from '@/lib/types';
import React, { Ref, useRef, useState } from 'react';
import ThemedZoom from '../themed-zoom';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { toast } from '../ui/use-toast';
import { useTranslations } from 'next-intl';
import { Input } from '../ui/input';

interface Props {
  images: CollectionImage[];
}

function CollectionGallery({ images }: Props) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const [inputKey, setInputKey] = useState(1);

  const addImage = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post(`/CollectionImages`, formData);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setInputKey((prev) => prev + 1);
      toast({
        title: t('success'),
        description: t('note_added')
      });
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: t('unknown_error'),
        variant: 'destructive'
      });
    }
  });

  return (
    <div>
      <Input
        key={inputKey}
        onChange={(event) => {
          if (!event.target.files) {
            toast({
              title: t('error'),
              description: t('unknown_error'),
              variant: 'destructive'
            });
            return;
          }
          const formData = new FormData();
          formData.append('collectionId', params?.id as string);
          formData.append('image', event.target.files[0]);
          addImage.mutate(formData);
        }}
        type="file"
        className="mb-4 w-72 py-0 pl-0"
        title="asdsa"
      />
      <div className="flex flex-wrap gap-1">
        {images.map((image) => (
          <div
            key={image.id}
            className="aspect-square min-w-52 flex-1 bg-secondary md:max-w-52"
          >
            {/* <ThemedZoom contentClass="w-full h-full"> */}
            <img src={image.image} className="h-full w-full rounded" />
            {/* </ThemedZoom> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionGallery;
