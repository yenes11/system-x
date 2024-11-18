'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '../ui/carousel';
import { useMemo, useState } from 'react';
import { DeleteIcon, Euro, Pencil, Plus, Trash, Trash2 } from 'lucide-react';
import AddPriceToFabricSheet from '../suppliers/add-price-to-fabric-sheet';
import RecentPricesDialog from '../suppliers/recent-prices-dialog';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import Empty from '../ui/empty';
import { Input } from '../ui/input';
import { CollectionMaterial, Fabric } from '@/lib/types';
import { SearchBar } from '../searchbar';
import ThemedZoom from '../themed-zoom';
import AddFabricToCollectionSheet from './add-fabric-to-collection-sheet';
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

interface Props {
  data: CollectionMaterial[];
}

function MaterialCarousel({ data }: Props) {
  const t = useTranslations();
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
              <CarouselItem key={index} className="lg:w-64">
                <Card className="overflow-hidden bg-cover bg-center p-0">
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <ThemedZoom>
                      <img
                        src={material.image}
                        className="aspect-square w-full origin-top-left object-cover object-top"
                      />
                    </ThemedZoom>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center gap-0 p-2 px-0 pb-0 text-sm">
                    <span>{material.name}</span>
                    <span>{material.color}</span>
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
