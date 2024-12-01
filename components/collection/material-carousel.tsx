'use client';

import { CollectionMaterial } from '@/lib/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import { SearchBar } from '../searchbar';
import ThemedZoom from '../themed-zoom';
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
}

function MaterialCarousel({ data }: Props) {
  const t = useTranslations();
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });

  console.log(data, 'data');

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
        endpoint="/SupplierFabricColors"
        mutationKey={['delete-collection']}
        state={deleteState}
        setState={setDeleteState}
      />
      <div className="mb-4 flex justify-between gap-4">
        <SearchBar
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-auto min-w-72 bg-card"
          placeholder={t('search_fabric_color_code')}
        />
        <AddMaterialToCollectionSheet />
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
              <Empty description={t('fabric_carousel_empty_description')} />
            </div>
          ) : (
            filteredData?.map((material, index: number) => (
              <CarouselItem key={index} className="">
                <Card className="w-full overflow-hidden bg-cover bg-center p-0">
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <ThemedZoom>
                      <img
                        src={material.image}
                        className="aspect-square w-full origin-top-left object-cover object-top"
                      />
                    </ThemedZoom>
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

                    {/* <div className="my-2 flex w-full flex-col px-5">
                      <div className="flex w-full justify-between">
                        <span className="text-xs text-muted-foreground">
                          {t('size')}
                        </span>
                        <span className="text-xs">{material.size}</span>
                      </div>
                      <div className="flex w-full justify-between">
                        <span className="text-xs text-muted-foreground">
                          {t('amount')}
                        </span>
                        <span className="text-xs">{material.amount}</span>
                      </div>
                    </div> */}
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
                      <Button
                        className="flex-1 rounded-none"
                        onClick={() =>
                          setDeleteState({
                            open: true,
                            id: material.id
                          })
                        }
                        variant="destructive"
                        size="sm"
                      >
                        {/* {t('delete')} */}
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-none"
                        size="sm"
                        // onClick={() => {
                        //   setEditState({
                        //     id: fabric.id,
                        //     manufacturerCode: fabric.manufacturerCode,
                        //     open: true
                        //   });
                        // }}
                      >
                        {/* {t('edit')} */}
                        <Pencil size={16} />
                      </Button>
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
