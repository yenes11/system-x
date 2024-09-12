import {
  customerTypeEnums,
  CustomerType,
  currencyEnums,
  Currency
} from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

function CustomerDetailsCard({ data }: any) {
  const t = useTranslations();
  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="max-h-[70%] overflow-auto bg-nutural p-0">
        <CardHeader className="flex flex-row items-start bg-muted/50 px-6 py-2">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {data?.name}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              ></Button>
            </CardTitle>
          </div>
        </CardHeader>
        <div className="px-6 py-3 text-sm">
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('appellation')}
                </span>
                <span>{data?.appellation}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('address')}</span>
                <span>{data?.address}</span>
              </li>
            </ul>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('tax_administration')}
                </span>
                <span>{data?.taxAdministration}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('tax_no')}</span>
                <span>{data?.taxNo}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('description')}
                </span>
                <span>{data?.description}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('country')}</span>
                <span>{data?.country}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('type')}</span>
                <span>{customerTypeEnums[data?.type as CustomerType]}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('currency')}</span>
                <span>{currencyEnums[data?.currency as Currency]}</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CustomerDetailsCard;
