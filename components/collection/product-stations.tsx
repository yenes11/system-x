'use client';

import { ProductStation } from '@/lib/types';
import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../ui/icon';

interface Props {
  data: ProductStation[];
}

function ProductStations({ data }: Props) {
  const [state, setState] = useState(data);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setState((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext strategy={verticalListSortingStrategy} items={state}>
          {state.map((item, index) => (
            <Item
              item={item}
              isLast={index === state.length - 1}
              key={item.id}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default ProductStations;

function Item(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
    active
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto'
  };

  return (
    <div
      className={`${!props.isLast && 'border-b'} bg-muted px-6 py-4 text-sm`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Icon icon="element-2" size={16} currentColor className="mr-4" />
      {`${props.item.priority}. ${props.item.name}`}
    </div>
  );
}
