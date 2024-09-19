import { Ingredient } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import Link from 'next/link';

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
      className="border-r-light-foreground flex gap-4 rounded-none bg-card p-4 shadow-none sm:odd:border-r"
    >
      <img className="h-24 w-24 rounded object-cover" src={img} alt={name} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{t('name')}</span>
          <span>{name}</span>
        </div>
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-muted-foreground">
            {t('ingredients')}
          </span>
          <div className="flex gap-2">
            {ingredients.map((ingredient, index) => (
              <Badge
                className="border border-primary bg-primary/30 text-primary-foreground"
                key={index}
              >
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
