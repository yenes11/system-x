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

const getCustomers = async () => {
  try {
    const res = await api.get('/Customers?PageIndex=0&PageSize=10');
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

async function CustomerManagementPage() {
  const customers = await getCustomers();
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
      <CustomerTable data={customers.items} />
    </div>
  );
}

export default CustomerManagementPage;
