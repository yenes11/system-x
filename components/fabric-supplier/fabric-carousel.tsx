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
import EditFabricSheet from './edit-fabric-sheet';
import AddPriceToFabricSheet from '../suppliers/add-price-to-fabric-sheet';
import RecentPricesDialog from '../suppliers/recent-prices-dialog';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import Empty from '../ui/empty';
import { Input } from '../ui/input';
import { Fabric } from '@/lib/types';
import { SearchBar } from '../searchbar';
import AssignFabricSheet from './assign-fabric-sheet';

interface SupplierFabric {
  fabricSupplierFabricColorId: string;
  fabricName: string;
  fabricColor: string;
  manufacturerCode: string;
  unit: string;
  type: string;
  image: string;
}

interface Props {
  data: SupplierFabric[];
}

function FabricCarousel({ data }: Props) {
  const t = useTranslations();
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });
  const [recentPricesState, setRecentPricesState] = useState({
    open: false,
    fabricColorId: ''
  });
  const [editState, setEditState] = useState({
    open: false,
    fabricColorId: '',
    manufacturerCode: ''
  });
  const [addPriceState, setAddPriceState] = useState({
    open: false,
    fabricColorId: ''
  });

  const [searchKey, setSearchKey] = useState('');

  console.log(data, 'hello');

  const filteredData = useMemo(() => {
    return data.filter(
      (fabric) =>
        fabric.fabricName.toLowerCase().includes(searchKey.toLowerCase()) ||
        fabric.fabricColor.toLowerCase().includes(searchKey.toLowerCase()) ||
        fabric.manufacturerCode.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [data, searchKey]);

  return (
    <>
      <RecentPricesDialog
        state={recentPricesState}
        setState={setRecentPricesState}
      />
      <AddPriceToFabricSheet
        state={addPriceState}
        setState={setAddPriceState}
      />
      <ConfirmDeleteDialog
        title={t('delete')}
        endpoint="/FabricSupplierFabricColors"
        mutationKey={['delete-collection']}
        state={deleteState}
        setState={setDeleteState}
      />
      <EditFabricSheet state={editState} setState={setEditState} />
      <div className="mb-4 flex gap-4">
        <AssignFabricSheet />

        <SearchBar
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-auto min-w-72 rounded-full bg-card"
          placeholder={t('search_fabric_color_code')}
        />
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
              <Empty description={t('fabric_carousel_empty_description')} />
            </div>
          ) : (
            filteredData?.map((fabric: any, index: number) => (
              <CarouselItem key={index} className="lg:w-64">
                <Card className="overflow-hidden bg-cover bg-center p-0">
                  <CardHeader className="flex justify-center bg-muted/50 px-3 py-2">
                    <CardTitle className="text-md gap-2 p-0 text-center ">
                      {fabric.fabricName}-{fabric.fabricColor}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <img
                      src={fabric.image}
                      className="aspect-square w-full origin-top-left object-cover object-top"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center gap-2 p-2 px-0 pb-0">
                    {/* <span className="text-xs text-muted-foreground">Code</span> */}
                    <code className="self-center">
                      {fabric.manufacturerCode}
                    </code>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-600/20 text-blue-800 dark:text-blue-300">
                        {fabric.unit}
                      </Badge>
                      <Badge className="bg-emerald-600/20 text-emerald-800 dark:text-emerald-300">
                        {fabric.type}
                      </Badge>
                    </div>
                    <div className="flex w-full">
                      <Button
                        className="flex-1 rounded-none"
                        onClick={() =>
                          setDeleteState({
                            open: true,
                            id: fabric.fabricSupplierFabricColorId
                          })
                        }
                        // variant={'destructive'}
                        variant="secondary"
                        size="sm"
                      >
                        {/* {t('delete')} */}
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-none"
                        size="sm"
                        onClick={() => {
                          setEditState({
                            fabricColorId: fabric.fabricSupplierFabricColorId,
                            manufacturerCode: fabric.manufacturerCode,
                            open: true
                          });
                        }}
                      >
                        {/* {t('edit')} */}
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-none"
                        size="sm"
                        onClick={() => {
                          setAddPriceState({
                            open: true,
                            fabricColorId: fabric.fabricSupplierFabricColorId
                          });
                        }}
                      >
                        {/* {t('edit')} */}
                        <Plus size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-none"
                        size="sm"
                        onClick={() => {
                          setRecentPricesState({
                            open: true,
                            fabricColorId: fabric.fabricSupplierFabricColorId
                          });
                        }}
                      >
                        {/* {t('edit')} */}
                        <Euro size={16} />
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

export default FabricCarousel;
