'use client';

import { Euro, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import ImageZoom from '../image-zoom';
import { SearchBar } from '../searchbar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import Empty from '../ui/empty';
import AddPriceToMaterialSheet from './add-price-to-material-sheet';
import AssignMaterialSheet from './assign-material-sheet';
import EditMaterialSheet from './edit-material-sheet';
import MaterialRecentPricesDialog from './material-recent-prices-dialog';

interface SupplierMaterial {
  id: string;
  materialId: string;
  materialColorId: string;
  materialColorVariantId: string;
  name: string;
  color: string;
  size: string;
  manufacturerCode: string;
  originalImage: string;
  supplierImage: string;
}

interface Props {
  data: SupplierMaterial[];
}

function MaterialCarousel({ data }: Props) {
  const t = useTranslations();
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });
  const [recentPricesState, setRecentPricesState] = useState({
    open: false,
    materialColorId: ''
  });
  const [editState, setEditState] = useState({
    open: false,
    materialColorId: '',
    manufacturerCode: ''
  });
  const [addPriceState, setAddPriceState] = useState({
    open: false,
    materialColorId: ''
  });

  const [searchKey, setSearchKey] = useState('');

  const filteredData: SupplierMaterial[] = useMemo(() => {
    return data.filter(
      (material) =>
        material?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
        material.color?.toLowerCase().includes(searchKey.toLowerCase()) ||
        material.manufacturerCode
          .toLowerCase()
          .includes(searchKey.toLowerCase())
    );
  }, [data, searchKey]);

  return (
    <>
      <MaterialRecentPricesDialog
        state={recentPricesState}
        setState={setRecentPricesState}
      />
      <AddPriceToMaterialSheet
        state={addPriceState}
        setState={setAddPriceState}
      />
      <ConfirmDeleteDialog
        title={t('delete')}
        endpoint="/SupplierMaterialColorVariants"
        mutationKey={['delete-collection']}
        state={deleteState}
        setState={setDeleteState}
      />
      <EditMaterialSheet state={editState} setState={setEditState} />
      <div className="mb-4 flex gap-4">
        {/* <AssignFabricSheet /> */}
        <SearchBar
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-auto min-w-72 bg-card"
          placeholder={t('search_material_color_code')}
        />
        <AssignMaterialSheet />
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
              <Empty description={t('material_carousel_empty_description')} />
            </div>
          ) : (
            filteredData?.map((material, index) => (
              <CarouselItem key={index} className="lg:w-64">
                <Card className="overflow-hidden bg-cover bg-center p-0">
                  <CardHeader className="flex justify-center bg-muted/50 px-3 py-2">
                    <CardTitle
                      title={`${material.color} - ${material.name}`}
                      className="text-md w-full max-w-full gap-2 overflow-hidden text-ellipsis text-nowrap p-0 text-center"
                    >
                      {material.color} - {material.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <ImageZoom>
                      <img
                        src={material.supplierImage || material.originalImage}
                        className="aspect-square w-full origin-top-left object-cover object-top"
                      />
                    </ImageZoom>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center gap-2 p-2 px-0 pb-0">
                    {/* <span className="text-xs text-muted-foreground">Code</span> */}
                    <code className="self-center">
                      {material.manufacturerCode}
                    </code>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-600/20 text-blue-800 dark:text-blue-300">
                        {/* {t(MaterialUnit[material.unit as IMaterialUnit])} */}
                        {material.size}
                      </Badge>
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
                        onClick={() => {
                          setEditState({
                            materialColorId: material.id,
                            manufacturerCode: material.manufacturerCode,
                            open: true
                          });
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-none"
                        size="sm"
                        onClick={() => {
                          setAddPriceState({
                            open: true,
                            materialColorId: material.id
                          });
                        }}
                      >
                        <Plus size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-none"
                        size="sm"
                        onClick={() => {
                          setRecentPricesState({
                            open: true,
                            materialColorId: material.id
                          });
                        }}
                      >
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

export default MaterialCarousel;
