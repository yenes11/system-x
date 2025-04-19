import CollectionTable from '@/components/collection/collection-table';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { getCollections } from '@/lib/api-calls';
import { CollectionStatus } from '@/lib/types';
import { Plus, SwatchBook } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = {};

async function CollectionLibraryPage({
  searchParams
}: {
  searchParams: {
    size: string;
    index: string;
    customerId: string;
    customerCode: string;
    categoryId: string;
    status: string;
  };
}) {
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const customerId = searchParams?.customerId;
  const customerCode = searchParams?.customerCode;
  const categoryId = searchParams?.categoryId;
  const status = searchParams?.status;
  const collections = await getCollections({
    pageIndex: index,
    pageSize: size,
    customerId,
    customerCode,
    categoryId,
    status: status as unknown as keyof typeof CollectionStatus
  });
  const t = await getTranslations();

  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading
          icon={<SwatchBook />}
          title={t('collections')}
          description=""
        />
        <Link href="/collection/new-collection">
          <Button icon={<Plus className="mr-2 size-4" />}>
            {t('add_collection')}
          </Button>
        </Link>
      </div>
      <CollectionTable data={collections} />
    </div>
  );
}

export default CollectionLibraryPage;
