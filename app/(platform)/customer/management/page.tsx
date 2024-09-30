import api from '@/api';
import AddCustomerSheet from '@/components/customer/add-custumer-sheet';
import CustomerTable from '@/components/customer/customer-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { Currency, currencyEnums } from '@/types';
import { UserRound, UsersRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const getCustomers = async ({
  pageIndex,
  pageSize
}: {
  pageIndex: number;
  pageSize: number;
}) => {
  try {
    const res = await api.get(
      `/Customers?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

async function CustomerManagementPage({
  searchParams
}: {
  searchParams: { size: string; index: string };
}) {
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const customers = await getCustomers({ pageIndex: index, pageSize: size });
  const t = await getTranslations();

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Heading
          title={t('customer')}
          description=""
          icon={<Icon icon="users" currentColor size={32} />}
        />
        <AddCustomerSheet />
      </div>
      <CustomerTable data={customers} />
    </div>
  );
}

export default CustomerManagementPage;
