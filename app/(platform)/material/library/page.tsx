import api from '@/api';
import AddMaterialSheet from '@/components/material/add-material-sheet';
import MaterialTable from '@/components/material/material-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getMaterialUrl } from '@/constants/api-constants';
import { IMaterial, PaginatedData } from '@/lib/types';
import { Shell } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const getMaterials = async () => {
  try {
    const res = await api.get(getMaterialUrl({ pageIndex: 0, pageSize: 20 }));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export default async function MaterialLibraryPage() {
  const t = await getTranslations();
  const materials: PaginatedData<IMaterial> = await getMaterials();

  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading
          title={t('material_library')}
          icon={<Icon icon="disk" size={28} currentColor />}
        />
        <AddMaterialSheet />
      </div>
      <MaterialTable data={materials.items} />
    </div>
  );
}
