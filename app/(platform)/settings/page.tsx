import ColorManagementTable from '@/components/settings/color-management-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPinHouse, Palette } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

function SettingsPage() {
  const t = useTranslations();
  return (
    <Tabs defaultValue="color-management">
      <TabsList>
        <TabsTrigger value="color-management">
          <Palette className="mr-2 h-4 w-4" />
          {t('color_management')}
        </TabsTrigger>
        <TabsTrigger value="product-station-address-management">
          <MapPinHouse className="mr-2 h-4 w-4" />
          {t('product_station_address_management')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="color-management">
        <ColorManagementTable />
      </TabsContent>
      <TabsContent value="product-station-address-management">2</TabsContent>
    </Tabs>
  );
}

export default SettingsPage;
