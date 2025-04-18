import React, { Dispatch, SetStateAction } from 'react';
import ThemedDialog from '../themed-dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CostType } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import moment from 'moment';

function EditUnitQuantityDialog({
  state,
  setState
}: {
  state: any;
  setState: Dispatch<SetStateAction<any>>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (!state.data) return;

    const mapped = state.data.reduce(
      (acc: Record<string, number>, item: any) => {
        acc[item.id] = item.unit;
        return acc;
      },
      {}
    );

    setValues(mapped);
  }, [state]);

  console.log(state, 'values');

  const editUnit = useMutation({
    mutationFn: async (values: { id: string; unitMeter: number }) => {
      const response = await api.put(
        '/CollectionColorFabricUnitMeters',
        values
      );
      return response;
    },
    onSuccess: (response) => {
      router.refresh();
      // setState({
      //   data: null,
      //   open: false
      // });

      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.valueAsNumber
    });
  };

  const onSave = (id: string) => {
    editUnit.mutate({ id, unitMeter: values[id] });
  };

  return (
    <ThemedDialog
      contentClassName="max-w-md"
      title={t('edit_quantity_list')}
      open={state.open}
      setOpen={setState}
    >
      <div className="grid grid-cols-7 items-center gap-4">
        {state.data?.map((item: any) => (
          <React.Fragment key={item.id}>
            <span className="col-span-3 mr-6">
              {t(CostType[item.type as keyof typeof CostType])}
            </span>
            <div className="col-span-4 flex items-center gap-2">
              <Input
                defaultValue={item.unit}
                type="number"
                name={item.id}
                onChange={setValue}
                placeholder={t('enter_unit_value')}
              />
              <Button onClick={() => onSave(item.id)}>{t('save')}</Button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </ThemedDialog>
  );
}

export default EditUnitQuantityDialog;
