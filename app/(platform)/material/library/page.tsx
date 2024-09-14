import api from '@/api';
import { Breadcrumbs } from '@/components/breadcrumbs';
import AddFabricSheet from '@/components/fabric/add-fabric-sheet';
import PageContainer from '@/components/layout/page-container';
import AddMaterialSheet from '@/components/material/add-material-sheet';
import MaterialTable from '@/components/material/material-table';
import FabricTable from '@/components/tables/fabric-tables/fabric-table';
import { Heading } from '@/components/ui/heading';
import { getFabricUrl, getMaterialUrl } from '@/constants/api-constants';
import { IMaterial, PaginatedData } from '@/lib/types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { InspectionPanel, Shell } from 'lucide-react';
import { getMessages, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

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
          icon={<Shell size={28} className="text-icon" />}
        />
        <AddMaterialSheet />
      </div>
      <MaterialTable data={materials.items} />
    </div>
  );
}
