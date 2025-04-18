'use client';

import { CircleHelp, Pencil, PencilRuler, Trash2 } from 'lucide-react';
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
import AddFabricToCollectionSheet from './add-fabric-to-collection-sheet';
import EditCollectionFabricSheet from './edit-collection-fabric';
import EditUnitQuantityDialog from './edit-unit-quantity-dialog';
import { useCollectionSlice } from '@/store/collection-slice';
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
  unitMeters: any;
}

interface Props {
  data: SupplierFabric[];
  verified?: boolean;
}

function FabricCarousel({ data }: Props) {
  const t = useTranslations();
  const verified = useCollectionSlice((state) => state.isVerified);
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });

  const [editState, setEditState] = useState({
    open: false,
    id: '',
    percent: 0
  });

  const [unitQuantityState, setUnitQuantityState] = useState({
    open: false,
    data: null
  });

  const [searchKey, setSearchKey] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      (fabric) =>
        fabric.fabricName.toLowerCase().includes(searchKey.toLowerCase()) ||
        fabric.fabricColorName.toLowerCase().includes(searchKey.toLowerCase())
      // fabric.manufacturerCode.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [data, searchKey]);

  return (
    <>
      <ConfirmDeleteDialog
        title={t('delete')}
        endpoint="/CollectionColorFabrics"
        mutationKey={['delete-collection-fabric-color']}
        state={deleteState}
        setState={setDeleteState}
      />
      <EditCollectionFabricSheet setState={setEditState} state={editState} />
      <EditUnitQuantityDialog
        state={unitQuantityState}
        setState={setUnitQuantityState}
      />
      <div className="mb-4 flex justify-between gap-4">
        <SearchBar
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-auto min-w-72 bg-card"
          placeholder={t('search_fabric_color_code')}
        />
        <AddFabricToCollectionSheet />
      </div>
      <Carousel
        opts={{
          align: 'start'
        }}
        className="m-auto mb-4 min-w-0 max-w-full"
      >
        <CarouselContent>
          {filteredData?.length === 0 ? (
            <div className="flex w-full items-center justify-center py-10">
              <Empty description={t('no_fabric_found')} />
            </div>
          ) : (
            filteredData?.map((fabric, index: number) => (
              <CarouselItem key={index} className="lg:w-64">
                <Card className="overflow-hidden bg-cover bg-center p-0">
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <ImageZoom>
                      <img
                        src={fabric.image}
                        className="aspect-square w-full origin-top-left object-cover object-top"
                      />
                    </ImageZoom>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center gap-0 p-2 px-0 pb-0 text-sm">
                    <span>{fabric.fabricName}</span>
                    <span>{fabric.fabricColorName}</span>
                    <div className="my-2 flex gap-2">
                      <Badge className="bg-blue-600/20 text-blue-800 dark:text-blue-300">
                        {fabric.grammage}g
                      </Badge>
                      <Badge className="bg-emerald-600/20 text-emerald-800 dark:text-emerald-300">
                        {fabric.percent}%
                      </Badge>
                    </div>
                    <div className="flex w-full">
                      <ThemedTooltip
                        disabled={!verified}
                        text="verification_required"
                      >
                        <div className="flex-1">
                          <Button
                            disabled={verified}
                            className="w-full rounded-none"
                            onClick={() => {
                              setDeleteState({
                                open: true,
                                id: fabric.id
                              });
                            }}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </ThemedTooltip>
                      <ThemedTooltip
                        disabled={!verified}
                        text="verification_required"
                      >
                        <div className="flex-1">
                          <Button
                            disabled={verified}
                            variant="secondary"
                            className="w-full rounded-none"
                            size="sm"
                            onClick={() => {
                              setEditState({
                                id: fabric.id,
                                percent: fabric.percent,
                                open: true
                              });
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                        </div>
                      </ThemedTooltip>
                      <div className="flex-1">
                        <Button
                          className="w-full rounded-none"
                          onClick={() =>
                            setUnitQuantityState({
                              open: true,
                              data: fabric.unitMeters
                            })
                          }
                          variant="secondary"
                          size="sm"
                        >
                          <PencilRuler size={16} />
                        </Button>
                      </div>
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

export default FabricCarousel;
