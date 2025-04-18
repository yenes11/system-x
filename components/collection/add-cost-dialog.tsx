import api from '@/api';
import { CostDetailItem, CostType } from '@/lib/types';
import { useCollectionSlice } from '@/store/collection-slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ThemedTooltip from '../ThemedTooltip';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { toast } from 'sonner';
import moment from 'moment';

const formSchema = z.object({
  name: z.string().min(1),
  type: z.number().min(1),
  price: z.number().min(1)
});

interface Props {
  verified?: boolean;
}

function AddCostDialog() {
  const t = useTranslations();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const verified = useCollectionSlice((state) => state.isVerified);
  const queryClient = useQueryClient();

  const [info, setInfo] = React.useState<{
    name: string;
    type: number | undefined;
  }>({
    name: '',
    type: undefined
  });

  const [fabricCosts, setFabricCosts] = React.useState<CostDetailItem[]>([]);
  const [materialCosts, setMaterialCosts] = React.useState<CostDetailItem[]>(
    []
  );
  const [productStationCosts, setProductStationCosts] = React.useState<
    CostDetailItem[]
  >([]);

  const handleInfoChange = (key: keyof typeof info, value: string | number) => {
    setInfo((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const addCost = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/CollectionColorCosts', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['costs']
      });
      setOpen(false);
      setInfo({ name: '', type: undefined });
      setFabricCosts([]);
      setMaterialCosts([]);
      setProductStationCosts([]);

      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const costDetails = useQuery({
    queryKey: ['cost-details'],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColors/GetCostInformationsForCreate/${params.id}`
      );

      let tempCosts: CostDetailItem[] = [];

      response.data?.fabrics?.forEach((item: any, index: number) => {
        tempCosts.push({
          name: item.name,
          unit: 1,
          price: 0,
          currency: 1,
          type: item.type
        });
      });

      setFabricCosts(tempCosts);
      tempCosts = [];

      response.data?.materials?.forEach((item: any, index: number) => {
        tempCosts.push({
          name: item.name,
          unit: 1,
          price: 0,
          currency: 1,
          type: item.type
        });
      });

      setMaterialCosts(tempCosts);
      tempCosts = [];

      response.data?.productStations?.forEach((item: any, index: number) => {
        tempCosts.push({
          name: item.name,
          unit: 1,
          price: 0,
          currency: 1,
          type: item.type
        });
      });
      setProductStationCosts(tempCosts);
      return response.data;
    },
    staleTime: 0
  });

  const onSubmit = () => {
    const formData = {
      ...info,
      collectionColorId: params.id,
      costs: [...fabricCosts, ...materialCosts, ...productStationCosts]
    };
    addCost.mutate(formData as any);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ThemedTooltip text="verification_required">
        <div className="inline-block">
          <DialogTrigger asChild>
            <Button disabled={!verified} size="sm" variant="outline">
              <Plus className="mr-2 size-4" />
              {t('add_cost')}
            </Button>
          </DialogTrigger>
        </div>
      </ThemedTooltip>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-3xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex flex-col border-b border-border px-6 py-4 text-base">
            <span>{t('add_cost')}</span>
          </DialogTitle>
          <div className="overflow-y-auto px-6 py-4">
            <DialogDescription asChild>
              <div>
                <div className="mb-6">
                  <Label className="mb-1 inline-block">{t('name')}</Label>
                  <Input
                    onChange={(e) => handleInfoChange('name', e.target.value)}
                    placeholder={t('draft_cost')}
                  />

                  <Label className="mb-1 mt-2 inline-block">{t('type')}</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInfoChange('type', Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_supplier')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CostType)?.map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {t(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-lg text-foreground">
                  {t('product_stations')}
                </span>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {costDetails.data?.productStations.map(
                    (item: any, index: number) => (
                      <React.Fragment key={item.name}>
                        <Label>{item.name}</Label>
                        <span>{item.amount}</span>
                        <Input
                          type="number"
                          onChange={(e) => {
                            setProductStationCosts((prev) => {
                              const updatedCosts = [...prev];
                              updatedCosts[index] = {
                                ...updatedCosts[index],
                                price: Number(e.target.value)
                              };
                              return updatedCosts;
                            });
                          }}
                        />
                      </React.Fragment>
                    )
                  )}
                </div>

                <span className="mt-4 inline-block text-lg text-foreground">
                  {t('fabric')}
                </span>
                <div className="grid grid-cols-3 items-center gap-2">
                  {costDetails.data?.fabrics.map((item: any, index: number) => (
                    <React.Fragment key={item.name}>
                      <Label>
                        {item.name}-{item.color}-{item.grammage}
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          console.log(value, 222);
                          console.log(item, 222);
                          setFabricCosts((prev) => {
                            const updatedCosts = [...prev];
                            updatedCosts[index] = {
                              ...updatedCosts[index],
                              type: Number(value)
                            };
                            return updatedCosts;
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_item')} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.unitMeters.map((unit: any, index: number) => (
                            <SelectItem
                              key={unit.type}
                              value={unit.type.toString()}
                            >
                              {t(CostType[unit.type as keyof typeof CostType])}{' '}
                              - {unit.amount}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        onChange={(e) => {
                          setFabricCosts((prev) => {
                            const updatedCosts = [...prev];
                            updatedCosts[index] = {
                              ...updatedCosts[index],
                              price: Number(e.target.value)
                            };
                            return updatedCosts;
                          });
                        }}
                        type="number"
                      />
                    </React.Fragment>
                  ))}
                </div>
                <span className="mt-4 inline-block text-lg text-foreground">
                  {t('material')}
                </span>
                <div className="mt-4 grid grid-cols-3 items-center gap-2">
                  {costDetails.data?.materials.map(
                    (item: any, index: number) => (
                      <React.Fragment key={item.name}>
                        <Label>{item.name}</Label>
                        <span>{item.amount}</span>
                        <Input
                          onChange={(e) => {
                            setMaterialCosts((prev) => {
                              const updatedCosts = [...prev];
                              updatedCosts[index] = {
                                ...updatedCosts[index],
                                price: Number(e.target.value)
                              };
                              return updatedCosts;
                            });
                          }}
                          type="number"
                        />
                      </React.Fragment>
                    )
                  )}
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-t border-border px-6 py-4 sm:items-center">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button onClick={onSubmit} type="button">
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCostDialog;
