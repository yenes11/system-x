import { Ingredient } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Edit, Edit2, Pencil, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import React from 'react';
import { useRouter } from 'next/navigation';
import EditFabricColorSheet from './edit-fabric-color-sheet';

interface Props {
  id: string;
  name: string;
  img: string;
  ingredients: Ingredient[];
}

function FabricColorCard({ id, name, img, ingredients }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [deleteState, setDeleteState] = React.useState({
    open: false,
    id: ''
  });

  const [editState, setEditState] = React.useState<{
    open: boolean;
    data: any;
  }>({
    open: false,
    data: null
  });

  return (
    <>
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
                <Badge
                  className="text-nowrap rounded-sm text-white"
                  key={index}
                >
                  {ingredient.percentage}% {ingredient.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="ml-auto flex flex-col justify-center gap-2">
          <Button
            onClick={(event) => {
              event.preventDefault();
              console.log(ingredients, 'ingredients');
              event.nativeEvent.stopImmediatePropagation();
              setEditState({
                open: true,
                data: {
                  id,
                  name,
                  img,
                  ingredients
                }
              });
            }}
            variant="outline"
            size="icon"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            onClick={(event) => {
              event.preventDefault();
              event.nativeEvent.stopImmediatePropagation();
              setDeleteState({
                open: true,
                id
              });
            }}
            variant="outline"
            size="icon"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </Link>
      <ConfirmDeleteDialog
        endpoint="/FabricColors"
        state={deleteState}
        setState={setDeleteState}
        mutationKey={['delete-fabric-color', id]}
        title={t('delete_fabric_color')}
      />
      <EditFabricColorSheet state={editState} setState={setEditState} />
    </>
  );
}

export default FabricColorCard;
