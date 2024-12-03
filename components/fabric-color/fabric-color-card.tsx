import { Ingredient } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  id: string;
  name: string;
  img: string;
  ingredients: Ingredient[];
}

function FabricColorCard({ id, name, img, ingredients }: Props) {
  const t = useTranslations();
  return (
    <Link
      href={`/fabric/library/color/${id}`}
      className="flex gap-4 rounded-none bg-card p-4 shadow-none"
    >
      <Image
        width={96}
        height={96}
        className="size-24 rounded"
        objectFit="cover"
        src={img}
        alt="Fabric color"
      />
      {/* <img className="h-24 w-24 rounded object-cover" src={img} alt={name} /> */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{t('name')}</span>
          <span>{name}</span>
        </div>
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-muted-foreground">
            {t('ingredients')}
          </span>
          <div className="flex flex-wrap gap-1">
            {ingredients.map((ingredient, index) => (
              <Badge className="text-nowrap rounded-sm text-white" key={index}>
                {ingredient.percentage}% {ingredient.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default FabricColorCard;
