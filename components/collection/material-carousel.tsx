'use client';

import { CollectionMaterial } from '@/lib/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import ImageZoom from '../image-zoom';
import { SearchBar } from '../searchbar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import Empty from '../ui/empty';
import AddMaterialToCollectionSheet from './add-material-to-collection-sheet';
import EditCollectionMaterialSheet from './edit-collection-material-sheet';
import { cn } from '@/lib/utils';
import ThemedTooltip from '../ThemedTooltip';

interface SupplierFabric {
  id: string;
  fabricColorId: string;
  fabricName: string;
  fabricColorName: string;
  grammage: number;
  image: string;
  percent: number;
}

const materialProperties = [
  {
    title: 'name',
    value: 'name'
  },
  {
    title: 'color',
    value: 'color'
  },
  {
    title: 'size',
    value: 'size'
  },
  {
    title: 'amount',
    value: 'amount'
  }
];

interface Props {
  data: CollectionMaterial[];
  verified?: boolean;
}

function MaterialCarousel({ data, verified }: Props) {
  const t = useTranslations();
  const [editState, setEditState] = useState({
    open: false,
    id: '',
    amount: 0
  });
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });

  const [searchKey, setSearchKey] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      (fabric) =>
        fabric.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        fabric.color.toLowerCase().includes(searchKey.toLowerCase())
      // fabric.manufacturerCode.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [data, searchKey]);

  return (
    <>
      <ConfirmDeleteDialog
        title={t('delete')}
        endpoint="/CollectionColorMaterials"
        mutationKey={['delete-collection-material-variant']}
        state={deleteState}
        setState={setDeleteState}
      />
      <EditCollectionMaterialSheet state={editState} setState={setEditState} />
      <div className="mb-4 flex justify-between gap-4">
        <SearchBar
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-auto min-w-72 bg-card"
          placeholder={t('search_material_color_code')}
        />
        <AddMaterialToCollectionSheet verified={verified} />
      </div>
      <Carousel
        opts={{
          align: 'start'
        }}
        className="m-auto mb-4 min-w-0 max-w-full"
      >
        <CarouselContent className="">
          {filteredData?.length === 0 ? (
            <div className="flex w-full items-center justify-center py-10">
              <Empty description={t('no_material_found')} />
            </div>
          ) : (
            filteredData?.map((material, index: number) => (
              <CarouselItem
                key={index}
                // className="shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/5"
              >
                <Card className="w-full overflow-hidden bg-cover bg-center p-0">
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <ImageZoom>
                      <img
                        src={material.image}
                        className="aspect-square w-full origin-top-left object-cover object-top"
                      />
                    </ImageZoom>
                  </CardContent>
                  <CardFooter className="flex w-full flex-col items-stretch gap-0 p-2 px-0 pb-0 text-sm">
                    {/* <span>{material.name}</span>
                    <span>{material.color}</span> */}

                    <ul className="grid gap-2 px-3">
                      {materialProperties.map((m) => (
                        <li
                          key={m.value}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-muted-foreground">
                            {t(m.title)}
                          </span>
                          <span className="text-xs">
                            {(material as any)[m.value]}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="my-2 flex flex-wrap justify-center gap-2">
                      {material.attributes.map((attr) => (
                        <Badge
                          key={`${attr.value}-${attr.name}`}
                          className="rounded bg-blue-600/20 text-blue-800 dark:text-blue-300"
                        >
                          <span className="font-light">{attr.name}:&nbsp;</span>{' '}
                          {attr.value}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex w-full">
                      <ThemedTooltip
                        disabled={verified}
                        text="verification_required"
                      >
                        <Button
                          className={cn(
                            {
                              'cursor-not-allowed bg-destructive/50 hover:bg-destructive/50 hover:active:bg-destructive/50':
                                !verified
                            },
                            'flex-1 rounded-none'
                          )}
                          onClick={() => {
                            if (!verified) return;
                            setDeleteState({
                              open: true,
                              id: material.id
                            });
                          }}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </ThemedTooltip>
                      <ThemedTooltip
                        disabled={verified}
                        text="verification_required"
                      >
                        <Button
                          variant="secondary"
                          className={cn(
                            {
                              'cursor-not-allowed bg-secondary/50 hover:bg-secondary/50 hover:active:bg-secondary/50':
                                !verified
                            },
                            'flex-1 rounded-none'
                          )}
                          size="sm"
                          onClick={() => {
                            if (!verified) return;
                            setEditState({
                              open: true,
                              id: material.id,
                              amount: material.amount
                            });
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                      </ThemedTooltip>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}

export default MaterialCarousel;
