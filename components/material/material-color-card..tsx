import { Ingredient } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import EditMaterialVariantSheet from './edit-material-variant-sheet';

interface Props {
  id: string;
  size: string;
  img: string;
}

function MaterialColorCard({ id, size, img }: Props) {
  const t = useTranslations();

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteState, setDeleteState] = React.useState({
    open: false,
    id: ''
  });

  return (
    <React.Fragment>
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
        <div className="ml-auto flex flex-col justify-center gap-2">
          <Button
            onClick={(event) => {
              event.preventDefault();
              event.nativeEvent.stopImmediatePropagation();
              setEditOpen(true);
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
        endpoint="/MaterialColorVariants"
        state={deleteState}
        setState={setDeleteState}
        mutationKey={['delete-material-variant', id]}
        title={t('delete_material_variant_color')}
      />
      <EditMaterialVariantSheet
        state={{
          open: editOpen,
          id,
          img,
          size
        }}
        setState={setEditOpen}
      />
    </React.Fragment>
  );
}

export default MaterialColorCard;
