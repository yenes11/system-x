import React, { Dispatch, SetStateAction } from 'react';
import ThemedDialog from '../themed-dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

function HelpDialog({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <ThemedDialog
      contentClassName="max-w-md"
      title="Help"
      open={open}
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
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="mr-6">1</span>
          <Input placeholder="Enter a description..." />
          <Button variant="ghost" size="icon">
            <Edit size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-6">1</span>
          <Input placeholder="Enter a description..." />
          <Button variant="ghost" size="icon">
            <Edit size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-6">1</span>
          <Input placeholder="Enter a description..." />
          <Button variant="ghost" size="icon">
            <Edit size={16} />
          </Button>
        </div>
      </div>
    </ThemedDialog>
  );
}

export default HelpDialog;
