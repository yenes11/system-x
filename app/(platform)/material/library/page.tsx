import api from '@/api';
import AddMaterialSheet from '@/components/material/add-material-sheet';
import MaterialTable from '@/components/material/material-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getMaterialUrl } from '@/constants/api-constants';
import { IMaterial, PaginatedData } from '@/lib/types';
import { Shell } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const getMaterials = async ({
  pageIndex,
  pageSize,
  name,
  type
}: {
  pageIndex: number;
  pageSize: number;
  name?: string;
  type?: string;
}) => {
  try {
    const res = await api.get(
      getMaterialUrl({ pageIndex, pageSize, name, type })
    );
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export default async function MaterialLibraryPage({
  searchParams
}: {
  searchParams: { size: string; index: string; name: string; type: string };
}) {
  const t = await getTranslations();
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const type = searchParams?.type || '';
  const name = searchParams?.name || '';

  const materials: PaginatedData<IMaterial> = await getMaterials({
    pageIndex: index,
    pageSize: size,
    name,
    type
  });

  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading
          title={t('material_library')}
          icon={<Icon icon="disk" size={28} currentColor />}
        />
        <AddMaterialSheet />
      </div>
      <MaterialTable data={materials} />
    </div>
  );
}
