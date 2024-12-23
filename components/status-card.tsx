import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

function StatusCard({ title, value, icon }: Props) {
  const Icon = icon;
  return (
    <Card>
      <CardContent className="flex h-full items-center gap-4 p-4">
        <span className="rounded-lg bg-theme-blue/10 p-4">
          {<Icon className="text-theme-blue-foreground" />}
        </span>
        <div>
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatusCard;
