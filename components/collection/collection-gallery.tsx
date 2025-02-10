'use client';

import { CollectionGallery as CollectionImage } from '@/lib/types';
import React, { Ref, useRef, useState } from 'react';
import ThemedZoom from '../themed-zoom';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { useTranslations } from 'next-intl';
import { Input } from '../ui/input';
import moment from 'moment';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '../ui/card';
import Empty from '../ui/empty';
import ImageZoom from '../image-zoom';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';

interface Props {
  images: CollectionImage[];
}

function CollectionGallery({ images }: Props) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const [inputKey, setInputKey] = useState(1);
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });

  const addImage = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post(`/CollectionImages`, formData);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setInputKey((prev) => prev + 1);
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  return (
    <React.Fragment>
      <ConfirmDeleteDialog
        endpoint="/CollectionImages"
        mutationKey={['delete-collection-image', deleteState.id]}
        setState={setDeleteState}
        state={deleteState}
        title={t('delete_image')}
      />
      <Card>
        <CardHeader className="h-16 flex-row items-center border-b px-4 py-0">
          <Input
            key={inputKey}
            multiple
            onChange={(event) => {
              if (!event.target.files) {
                toast.error(t('error'), {
                  description: t('unknown_error')
                });
                return;
              }
              const formData = new FormData();
              formData.append('collectionId', params?.id as string);
              for (const file of Array.from(event.target.files)) {
                console.log(file.name, 'filename');
                formData.append('images', file);
              }
              addImage.mutate(formData);
            }}
            type="file"
            className="w-72 py-0 pl-0"
          />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1 p-4">
          {images.length > 0 ? (
            images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square min-w-52 flex-1 bg-secondary md:max-w-52"
              >
                <Button
                  className="absolute right-1 top-1 z-50 !size-7"
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    setDeleteState({
                      id: image.id,
                      open: true
                    })
                  }
                >
                  <Trash2 size={16} />
                </Button>
                <ImageZoom>
                  <img
                    src={image.image}
                    className="size-52 rounded object-cover object-top"
                  />
                </ImageZoom>
                <div></div>
              </div>
            ))
          ) : (
            <Empty className="w-full" description={t('no_image_found')} />
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default CollectionGallery;
