import CollectionOrdersTable from '@/components/collection/collection-orders-table';
import { Heading } from '@/components/ui/heading';
import { getCollectionOrders } from '@/lib/api-calls';
import { CollectionStatus } from '@/lib/types';
import { SwatchBook } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

type Props = {};

async function CollectionColorsPage({
  searchParams
}: {
  searchParams: {
    size: string;
    index: string;
    customerId: string;
    plmId: string;
    groupPlmId: string;
    status: string;
  };
}) {
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const customerId = searchParams?.customerId;
  const plmId = searchParams?.plmId;
  const groupPlmId = searchParams?.groupPlmId;
  const status = searchParams?.status;
  const collections = await getCollectionOrders({
    pageIndex: index,
    pageSize: size,
    customerId,
    plmId,
    groupPlmId,
    status: status as unknown as keyof typeof CollectionStatus
  });
  const t = await getTranslations();

  console.log(collections);

  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading
          icon={<SwatchBook />}
          title={t('collection_color_orders')}
          description=""
        />
        {/* <Link href="/collection/new-collection">
          <Button icon={<Plus className="mr-2 size-4" />}>
            {t('add_collection')}
          </Button>
        </Link> */}
      </div>
      <CollectionOrdersTable data={collections} />
    </div>
  );
}

export default CollectionColorsPage;
