'use client';

import React from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

function DeleteCollectionDialog({ id }: { id: string }) {
  const t = useTranslations();
  const [state, setState] = React.useState({
    open: false,
    id
  });
  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => setState({ open: true, id })}
      >
        <Trash2 className="mr-2 size-4" />
        {t('delete')}
      </Button>
      <ConfirmDeleteDialog
        setState={setState}
        state={state}
        endpoint="/Collections"
        mutationKey={['delete-collection', id]}
        title={t('delete_collection')}
        submessage={t('delete_collection_message')}
      />
    </React.Fragment>
  );
}

export default DeleteCollectionDialog;
