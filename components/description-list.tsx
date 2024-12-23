import { EMPTY } from '@/constants/all';
import React from 'react';

interface ListItem {
  title: string;
  description: any;
}

interface Props {
  listItems: ListItem[];
}

function DescriptionList({ listItems }: Props) {
  return (
    <div className="flow-root">
      <dl className="text-sm">
        {listItems.map((listItem) => (
          <div
            key={listItem.title}
            className="grid grid-cols-1 gap-1 px-6 py-3 even:bg-muted sm:grid-cols-3 sm:gap-4"
          >
            <dt className="text-muted-foreground">{listItem.title}</dt>
            <dd className="sm:col-span-2">{listItem.description || EMPTY}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default DescriptionList;
