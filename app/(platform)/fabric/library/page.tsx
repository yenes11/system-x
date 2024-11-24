import AddFabricSheet from '@/components/fabric/add-fabric-sheet';
import FabricTable from '@/components/tables/fabric-tables/fabric-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getFabrics, getFabricsWithColors } from '@/lib/api-calls';
import { getTranslations } from 'next-intl/server';

export default async function FabricLibraryPage({
  searchParams
}: {
  searchParams: { size: string; index: string; name: string; grammage: string };
}) {
  const t = await getTranslations();
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const name = searchParams?.name || '';
  const grammage =
    searchParams?.grammage && !isNaN(Number(searchParams.grammage))
      ? searchParams.grammage
      : '';

  const fabrics = await getFabricsWithColors({
    pageIndex: index,
    pageSize: size,
    grammage,
    name
  });

  // if ('message' in fabrics) {
  //   return <div>{fabrics.message}</div>;
  // }

  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading
          icon={
            <Icon
              currentColor
              icon="some-files"
              size={24}
              className="text-icon"
            />
          }
          title={t('fabric_library')}
        />
        <AddFabricSheet />
      </div>
      <FabricTable data={fabrics} />
    </div>
  );
}
