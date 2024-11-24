'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { MaterialCollection } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Empty from '../ui/empty';
import ThemedZoom from '../themed-zoom';
import { SearchBar } from '../searchbar';
import Code from '../ui/code';

const statusOptions = [
  { value: '0', label: 'all' },
  { value: '1', label: 'unknown' },
  { value: '2', label: 'accepted' },
  { value: '3', label: 'rejected' }
];

function MaterialCollectionsCarousel({ data }: { data: MaterialCollection[] }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [commandValue, setCommandValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<any>('0');

  console.log(data, 'hellos');

  const filteredData = useMemo(() => {
    return data.filter(
      (collection) =>
        collection.collectionColorName
          .toLowerCase()
          .includes(searchKey.toLowerCase()) ||
        collection.collectionName
          .toLocaleLowerCase()
          .includes(searchKey.toLowerCase()) ||
        collection.collectionManufacturerCode
          .toLowerCase()
          .includes(searchKey.toLowerCase())
    );
  }, [data, searchKey, selectedStatus]);

  return (
    <>
      {/* <div className="mb-2 flex justify-between">
        <Input
          className="w-96"
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
      </div> */}
      <div className="mb-4 flex justify-between gap-4">
        <SearchBar
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-auto min-w-72 bg-card"
          placeholder={t('search_fabric_color_code')}
        />
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
            data?.map((collection, index) => (
              <CarouselItem
                key={index}
                className="shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/5"
              >
                <div className="p-1">
                  <Card className="overflow-hidden bg-cover bg-center p-0">
                    <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                      <ThemedZoom>
                        <img
                          src={collection.collectionImage}
                          className="aspect-square w-full origin-top-left object-cover object-top"
                        />
                      </ThemedZoom>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-2">
                      <span className="text-xs text-muted-foreground">
                        {t('manufacturer_code')}
                      </span>
                      <Code>{collection.collectionManufacturerCode}</Code>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {t('amount')}
                      </span>
                      {collection.amount}
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

export default MaterialCollectionsCarousel;
