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
import {
  CircleHelp,
  DeleteIcon,
  Euro,
  Pencil,
  Plus,
  Trash,
  Trash2
} from 'lucide-react';
import AddPriceToFabricSheet from '../suppliers/add-price-to-fabric-sheet';
import RecentPricesDialog from '../suppliers/recent-prices-dialog';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import Empty from '../ui/empty';
import { Input } from '../ui/input';
import { Fabric } from '@/lib/types';
import { SearchBar } from '../searchbar';
import ThemedZoom from '../themed-zoom';
import AddFabricToCollectionSheet from './add-fabric-to-collection-sheet';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import EditUnitMeterDialog from './edit-unit-meter-dialog';
import EditCollectionFabricSheet from './edit-collection-fabric';

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
}

function FabricCarousel({ data }: Props) {
  const t = useTranslations();
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });

  const [editState, setEditState] = useState({
    open: false,
    id: '',
    percent: 0
  });

  const [helpState, setHelpState] = useState({
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
      <EditUnitMeterDialog state={helpState} setState={setHelpState} />
      {/* <EditFabricSheet state={editState} setState={setEditState} /> */}
      <div className="mb-4 flex justify-between gap-4">
        <SearchBar
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-auto min-w-72 bg-card"
          placeholder={t('search_fabric_color_code')}
        />
        {/* <AssignFabricSheet /> */}
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
              <Empty description={t('fabric_carousel_empty_description')} />
            </div>
          ) : (
            filteredData?.map((fabric, index: number) => (
              <CarouselItem key={index} className="lg:w-64">
                <Card className="overflow-hidden bg-cover bg-center p-0">
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <ThemedZoom>
                      <img
                        src={fabric.image}
                        className="aspect-square w-full origin-top-left object-cover object-top"
                      />
                    </ThemedZoom>
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
                      <Button
                        className="flex-1 rounded-none"
                        onClick={() =>
                          setDeleteState({
                            open: true,
                            id: fabric.id
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
                        onClick={() => {
                          setEditState({
                            id: fabric.id,
                            percent: fabric.percent,
                            open: true
                          });
                        }}
                      >
                        {/* {t('edit')} */}
                        <Pencil size={16} />
                      </Button>
                      <Button
                        className="flex-1 rounded-none"
                        onClick={() =>
                          setHelpState({ open: true, data: fabric.unitMeters })
                        }
                        variant="secondary"
                        size="sm"
                      >
                        {/* {t('delete')} */}
                        <CircleHelp size={16} />
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
