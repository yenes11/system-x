import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useId } from 'react';

interface Props {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}

export default function CheckboxCard({
  title,
  description,
  checked,
  onCheckedChange
}: Props) {
  const id = useId();
  return (
    <div className="shadow-xs has-data-[state=checked]:border-primary relative flex w-full items-start gap-2 rounded-md border border-input p-4 outline-none">
      <Checkbox
        id={id}
        checked={checked}
        onClick={onCheckedChange}
        className="order-1 after:absolute after:inset-0"
        aria-describedby={`${id}-description`}
      />
      <div className="grid grow gap-1">
        <Label className="text-xs text-muted-foreground" htmlFor={id}>
          {title}
        </Label>
        <p id={`${id}-description`} className="font-bold">
          {description}
        </p>
      </div>
    </div>
  );
}
