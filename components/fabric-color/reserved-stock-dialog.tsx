import React from 'react';
import ThemedDialog from '../themed-dialog';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';
import moment from 'moment';
import { OrderStatus } from '@/lib/types';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Empty from '../ui/empty';

interface Props {
  unit: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEmpty?: boolean;
}

function ReservedStockDialog({ open, setOpen, unit, isEmpty }: Props) {
  const t = useTranslations();
  const params = useParams();
  const path = usePathname();

  const url = path.startsWith('/fabric')
    ? '/FabricColors/ReservedInformation'
    : '/MaterialColorVariants/ReservedInformation';

  const stocks = useQuery({
    queryKey: ['reserved-stock-details', params.id, url],
    queryFn: async () => {
      const response = await api(`${url}/${params.id}`);
      return response.data;
    },
    enabled: !isEmpty
  });

  return (
    <ThemedDialog open={open} setOpen={setOpen} title={t('stock_info')}>
      {isEmpty ? (
        <Empty description={t('no_reserved_stock')} />
      ) : (
        stocks.data &&
        stocks.data.map((stock: any, index: number) => {
          const collection = stock.collection;
          const order = stock.order;
          return (
            <React.Fragment key={stock.id}>
              <div>
                <div className="flex">
                  <div className="flex flex-1 border-r pr-6">
                    <img
                      className="mr-4 size-32 rounded object-cover object-top"
                      src={collection.image}
                      alt="collection"
                    />
                    <div className="flex flex-col justify-between">
                      <dl className="text-sm">
                        <dt className="mb-2 text-xs text-muted-foreground">
                          {t('collection_details')}
                        </dt>
                        <dd>{collection.name}</dd>
                        <dd>{collection.color}</dd>
                        <dd>{collection.customerCode}</dd>
                        <dd>{collection.manufacturerCode}</dd>
                      </dl>
                      <Link
                        href=""
                        className="mt-3 flex items-center p-0 text-sm text-blue-500"
                      >
                        {t('go_to_collection_details')}{' '}
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between pl-6">
                    <dl className="text-sm">
                      <dt className="mb-2 text-xs text-muted-foreground">
                        {t('order_details')}
                      </dt>
                      <dd>
                        <span className="text-sm text-muted-foreground">
                          {t('order_amount')}:
                        </span>{' '}
                        {order.amount}
                      </dd>
                      <dd>
                        <span className="text-sm text-muted-foreground">
                          {t('plm_id')}:
                        </span>{' '}
                        {order.plmId}
                      </dd>
                      <dd>
                        <span className="text-sm text-muted-foreground">
                          {t('group_plm_id')}:
                        </span>{' '}
                        {order.groupPlmId}
                      </dd>
                      <dd>
                        <span className="text-sm text-muted-foreground">
                          {t('status')}:
                        </span>{' '}
                        {t(
                          OrderStatus[order.status as keyof typeof OrderStatus]
                        )}
                      </dd>
                      <dd>
                        <span className="text-sm text-muted-foreground">
                          {t('deadline')}:
                        </span>{' '}
                        {moment(order.deadline).format('DD/MM/YYYY, HH:mm')}
                      </dd>
                    </dl>
                    <Link
                      href=""
                      className="mt-3 flex items-center p-0 text-sm text-blue-500"
                    >
                      {t('go_to_order_details')}{' '}
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </div>
                </div>
                <p className="mt-2 rounded bg-muted py-2 text-center text-sm text-muted-foreground">
                  {path.startsWith('/fabric')
                    ? t('fabric_stock_footnote')
                    : t('material_stock_footnote')}
                  :{' '}
                  <span className="font-semibold text-primary-foreground">
                    {stock.amount}
                  </span>{' '}
                  {unit}
                </p>
              </div>

              {index !== stocks.data.length - 1 && (
                <Separator className="my-4" />
              )}
            </React.Fragment>
          );
        })
      )}
    </ThemedDialog>
  );
}

export default ReservedStockDialog;
