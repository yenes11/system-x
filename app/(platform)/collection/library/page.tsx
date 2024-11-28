import api from '@/api';
import AddCollectionDialog from '@/components/collection/add-collection-dialog';
import CollectionTable from '@/components/collection/collection-table';
import FabricCarousel from '@/components/collection/fabric-carousel';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCollections } from '@/lib/api-calls';
import { CollectionStatus } from '@/lib/types';
import { getMessages, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

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
          icon={
            <Icon
              currentColor
              icon="abstract-26"
              size={24}
              className="text-icon"
            />
          }
          title={t('collections')}
          description=""
        />
        <Link href="/collection/new-collection">
          <Button>{t('add_collection')}</Button>
        </Link>
        {/* <AddCollectionDialog /> */}
      </div>
      <CollectionTable data={collections} />
    </div>
  );
}

export default CollectionLibraryPage;
