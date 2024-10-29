import { Ingredient } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import Link from 'next/link';

interface Props {
  id: string;
  size: string;
  img: string;
}

function MaterialColorCard({ id, size, img }: Props) {
  const t = useTranslations();
  return (
    <Link
      href={`/material/library/color/${id}`}
      className="flex gap-4 rounded-none bg-background p-4 shadow-none"
    >
      <img className="h-24 w-24 rounded object-cover" src={img} alt={size} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{t('size')}</span>
          <span>{size}</span>
        </div>
      </div>
    </Link>
  );
}

export default MaterialColorCard;
