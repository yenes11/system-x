'use client';

import React, { useMemo, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { CheckIcon, Copy, ListFilter } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';
import {
  CollectionStatus,
  CollectionStatusColor,
  ICollection,
  ICollectionStatus
} from '@/lib/types';
import { Badge } from './ui/badge';
import Empty from './ui/empty';
import { PopoverTrigger, Popover, PopoverContent } from './ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command';
import { SearchBar } from './searchbar';
import { toast } from './ui/use-toast';
import ThemedZoom from './themed-zoom';
import Code from './ui/code';

const statusOptions = [
  { value: '0', label: 'all' },
  { value: '1', label: 'unknown' },
  { value: '2', label: 'accepted' },
  { value: '3', label: 'rejected' }
];

function CollectionsCarousel({ data }: { data: ICollection[] }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<any>('0');

  const filteredData = useMemo(() => {
    return data.filter(
      (collection) =>
        (selectedStatus === '0' ||
          collection.status.toString() === selectedStatus) &&
        collection.manufacturerCode
          .toLowerCase()
          .includes(searchKey.toLowerCase())
    );
  }, [data, searchKey, selectedStatus]);

  return (
    <>
      <div className="mb-2 flex justify-between">
        <SearchBar
          className="w-96 rounded-full bg-card"
          placeholder="Search collection..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedStatus
                ? t(
                    statusOptions.find(
                      (status) => status.value === selectedStatus
                    )?.label
                  )
                : 'Select Status...'}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder={t('search')} className="h-9" /> */}
              <CommandList>
                <CommandEmpty>{t('no_collections_found')}</CommandEmpty>
                <CommandGroup>
                  {statusOptions.map((status) => (
                    <CommandItem
                      key={status.value}
                      value={status.value.toString()}
                      onSelect={(currentValue) => {
                        setSelectedStatus(
                          currentValue as unknown as ICollectionStatus
                        );
                        setOpen(false);
                      }}
                    >
                      {t(status.label)}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedStatus?.toString() ===
                            status.value?.toString()
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Carousel
        opts={{
          align: 'start'
        }}
        className="m-auto mb-4 min-w-0 max-w-full"
      >
        <CarouselContent>
          {filteredData?.length === 0 ? (
            <div className="flex w-full items-center justify-center py-10">
              <Empty description={t('no_collections_found')} />
            </div>
          ) : (
            filteredData?.map((collection, index) => (
              <CarouselItem
                key={index}
                className="shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/5"
              >
                <div className="p-1">
                  <Card className="overflow-hidden bg-cover bg-center p-0">
                    <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                      <ThemedZoom>
                        <img
                          src={collection.image}
                          className="aspect-square w-full origin-top-left object-cover object-top"
                        />
                      </ThemedZoom>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-2">
                      <span className="text-xs text-muted-foreground">
                        {t('manufacturer_code')}
                      </span>
                      <div className="mb-1 flex items-center gap-2">
                        <Code>{collection.manufacturerCode}</Code>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t('status')}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="relative flex size-2">
                          <span
                            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                              collection.status === 1
                                ? 'bg-gray-300'
                                : collection.status === 2
                                ? 'bg-green-600'
                                : 'bg-destructive'
                            } opacity-75`}
                          ></span>
                          <span
                            className={`relative inline-flex size-2 rounded-full ${
                              collection.status === 1
                                ? 'bg-gray-300'
                                : collection.status === 2
                                ? 'bg-green-600'
                                : 'bg-destructive'
                            }`}
                          ></span>
                        </span>
                        {t(CollectionStatus[collection.status])}
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}

export default CollectionsCarousel;
