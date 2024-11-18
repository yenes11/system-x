'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardFooter } from '@/components/ui/card';
import Icon from '../ui/icon';

interface Item {
  id: string;
  name: string;
}

type ContainerId = 'left' | 'right';

interface SortableItemProps {
  item: Item;
  index: number;
  renderItem?: (item: Item, index: number) => React.ReactNode;
}

interface DraggableItemProps {
  item: Item;
  index: number;
  renderItem?: (item: Item, index: number) => React.ReactNode;
}

interface DroppableContainerProps {
  id: ContainerId;
  items: Item[];
  title: string;
  renderItem?: (item: Item, index: number) => React.ReactNode;
  emptyStateText?: string;
}

interface TransferListProps {
  leftItems: Item[];
  rightItems: Item[];
  onChangeLeft: (items: Item[]) => void;
  onChangeRight: (items: Item[]) => void;
  leftTitle?: string;
  rightTitle?: string;
  renderItem?: (item: Item, index: number) => React.ReactNode;
  emptyStateText?: string;
  className?: string;
}

const DefaultItemRenderer: React.FC<{ item: Item; index: number }> = ({
  item,
  index
}) => (
  <div className="flex items-center">
    <Icon icon="burger-menu-3" currentColor size={16} className="mr-4" />
    <span>
      {index + 1}. {item.name}
    </span>
  </div>
);

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  index,
  renderItem
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move select-none bg-muted p-4 shadow hover:bg-muted/50"
    >
      {renderItem ? (
        renderItem(item, index)
      ) : (
        <DefaultItemRenderer item={item} index={index} />
      )}
    </div>
  );
};

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  renderItem
}) => (
  <div className="cursor-grabbing select-none rounded bg-muted p-4 opacity-50 shadow">
    {renderItem ? (
      renderItem(item, index)
    ) : (
      <DefaultItemRenderer item={item} index={index} />
    )}
  </div>
);

const DroppableContainer: React.FC<DroppableContainerProps> = ({
  id,
  items,
  title,
  renderItem,
  emptyStateText = 'This list is empty'
}) => {
  const { setNodeRef } = useSortable({ id });

  return (
    <Card className="flex-1 overflow-hidden rounded">
      {/* <div className="">{title}</div> */}
      <div ref={setNodeRef} className="min-h-[400px]">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="divide-y">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                renderItem={renderItem}
              />
            ))}
            {items.length === 0 && (
              <div className="rounded border-2 border-dashed p-4 text-center text-gray-500">
                {emptyStateText}
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </Card>
  );
};

const TransferList: React.FC<TransferListProps> = ({
  leftItems,
  rightItems,
  onChangeLeft,
  onChangeRight,
  leftTitle = 'Left List',
  rightTitle = 'Right List',
  renderItem,
  emptyStateText,
  className = 'flex gap-4'
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragStartIndex, setDragStartIndex] = useState<number>(0);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5
    }
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  });

  const sensors = useSensors(mouseSensor, pointerSensor);

  const getContainerId = (id: string | ContainerId): ContainerId | null => {
    if (id === 'left' || id === 'right') return id;
    if (leftItems.find((item) => item.id === id)) return 'left';
    if (rightItems.find((item) => item.id === id)) return 'right';
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const container = getContainerId(event.active.id as string);
    const items = container === 'left' ? leftItems : rightItems;
    const index = items.findIndex((item) => item.id === event.active.id);
    setDragStartIndex(index);
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = getContainerId(active.id as string);
    const overContainer = getContainerId(over.id as string | ContainerId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    const activeItem = [...leftItems, ...rightItems].find(
      (item) => item.id === active.id
    );

    if (!activeItem) return;

    if (activeContainer === 'left') {
      onChangeLeft(leftItems.filter((item) => item.id !== active.id));
      onChangeRight([...rightItems, activeItem]);
    } else {
      onChangeRight(rightItems.filter((item) => item.id !== active.id));
      onChangeLeft([...leftItems, activeItem]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainer = getContainerId(active.id as string);
    const overContainer = getContainerId(over.id as string | ContainerId);

    if (activeContainer !== overContainer) {
      const activeItem = [...leftItems, ...rightItems].find(
        (item) => item.id === active.id
      );

      if (!activeItem) return;

      if (activeContainer === 'left') {
        onChangeLeft(leftItems.filter((item) => item.id !== active.id));
        onChangeRight([...rightItems, activeItem]);
      } else {
        onChangeRight(rightItems.filter((item) => item.id !== active.id));
        onChangeLeft([...leftItems, activeItem]);
      }
    } else {
      const items = activeContainer === 'left' ? leftItems : rightItems;
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== newIndex) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        if (activeContainer === 'left') {
          onChangeLeft(newItems);
        } else {
          onChangeRight(newItems);
        }
      }
    }

    setActiveId(null);
  };

  const activeItem = activeId
    ? [...leftItems, ...rightItems].find((item) => item.id === activeId)
    : null;

  const activeContainer = activeId ? getContainerId(activeId) : null;
  const activeIndex =
    activeContainer === 'left'
      ? leftItems.findIndex((item) => item.id === activeId)
      : rightItems.findIndex((item) => item.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={className}>
        <DroppableContainer
          id="left"
          items={leftItems}
          title={leftTitle}
          renderItem={renderItem}
          emptyStateText={emptyStateText}
        />
        <Icon
          className="self-center"
          icon="arrow-right-left"
          currentColor
          size={24}
        />
        <DroppableContainer
          id="right"
          items={rightItems}
          title={rightTitle}
          renderItem={renderItem}
          emptyStateText={emptyStateText}
        />
      </div>

      <DragOverlay adjustScale={false} dropAnimation={null}>
        {activeItem ? (
          <DraggableItem
            item={activeItem}
            index={activeIndex}
            renderItem={renderItem}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TransferList;
