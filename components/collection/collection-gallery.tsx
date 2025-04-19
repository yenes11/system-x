'use client';

import api from '@/api';
import { CollectionGallery as CollectionImage } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import ImageZoom from '../image-zoom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import Empty from '../ui/empty';
import { Input } from '../ui/input';
import FileUpload from '../file-upload';
import { useFileUpload } from '@/hooks/use-file-upload';

interface Props {
  images: CollectionImage[];
}

const maxSizeMB = 5;
const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
const maxFiles = 6;

function CollectionGallery({ images }: Props) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const [inputKey, setInputKey] = useState(1);
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });

  const upload = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize,
    multiple: true,
    maxFiles
  });

  const [{ files }, { clearFiles }] = upload;

  const addImage = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post(`/CollectionImages`, formData);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setInputKey((prev) => prev + 1);
      clearFiles();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('collectionId', params?.id as string);
    for (const file of files) {
      formData.append('images', file.file as Blob);
    }
    addImage.mutate(formData);
  };

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
        <CardHeader className="flex-row items-center border-b p-0">
          <FileUpload onSend={onSubmit} upload={upload} />
          {/* <Input
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
          /> */}
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
