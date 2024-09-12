import { LibraryBig, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface HeadingProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  icon
}) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-x-2">
      {icon}
      <h2 className="text-2xl font-semibold tracking-tight ">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
