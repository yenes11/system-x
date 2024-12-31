import React, { Dispatch, SetStateAction } from 'react';
import ThemedDialog from '../themed-dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';

function HelpDialog({
  state,
  setOpen
}: {
  state: any;
  setOpen: Dispatch<SetStateAction<any>>;
}) {
  const t = useTranslations();

  const [values, setValues] = React.useState({
    draft: '',
    approved: '',
    system: ''
  });

  const setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <ThemedDialog
      contentClassName="max-w-md"
      title="Help"
      open={state}
      setOpen={setOpen}
      footer={
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </div>
      }
    >
      <div className="grid grid-cols-6 items-center gap-4">
        <span className=" col-span-2 mr-6">{t('draft')}</span>
        <div className="col-span-4 flex items-center gap-2">
          <Input
            name="draft"
            onChange={setValue}
            placeholder={t('enter_unit_value')}
          />
          <Button variant="ghost" size="icon">
            <Edit size={16} />
          </Button>
        </div>

        <span className=" col-span-2 mr-6">{t('approved')}</span>
        <div className="col-span-4 flex items-center gap-2">
          <Input
            name="approved"
            onChange={setValue}
            placeholder={t('enter_unit_value')}
          />
          <Button variant="ghost" size="icon">
            <Edit size={16} />
          </Button>
        </div>
        <span className=" col-span-2 mr-6">{t('system_unit_meter')}</span>
        <div className="col-span-4 flex items-center gap-2">
          <Input
            name="system"
            onChange={setValue}
            placeholder={t('enter_unit_value')}
          />
          <Button variant="ghost" size="icon">
            <Edit size={16} />
          </Button>
        </div>
      </div>
    </ThemedDialog>
  );
}

export default HelpDialog;
