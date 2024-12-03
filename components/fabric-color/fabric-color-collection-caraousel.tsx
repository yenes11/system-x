'use client';

import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import { Copy } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { toast } from '../ui/use-toast';
import ThemedZoom from '../themed-zoom';
import { SearchBar } from '../searchbar';
import Empty from '../ui/empty';
import Code from '../ui/code';
import { ColorCollection } from '@/lib/types';
import Image from 'next/image';

function FabricColorCollectionCarousel({ data }: { data: ColorCollection[] }) {
  const t = useTranslations();
  const [searchKey, setSearchKey] = useState('');

  const filteredData = data.filter((collection) =>
    collection.collectionCustomerCode
      .toLowerCase()
      .includes(searchKey.toLowerCase())
  );

  return (
    <React.Fragment>
      <SearchBar
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        className="mb-2 w-full bg-card sm:w-72"
        placeholder={t('search')}
      />
      <Carousel
        opts={{
          align: 'start'
        }}
        className="m-auto mb-4 min-w-0 max-w-full"
      >
        <CarouselContent>
          {filteredData.length === 0 ? (
            <div className="flex w-full justify-center py-8">
              <Empty description={t('no_collection_found')} />
            </div>
          ) : (
            filteredData.map((collection, index) => (
              <CarouselItem key={index} className="">
                <div className="p-1">
                  <Card className="overflow-hidden bg-cover bg-center p-0">
                    <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                      <ThemedZoom>
                        <Image
                          width={256}
                          height={256}
                          alt={collection.collectionColorName}
                          src={collection.collectionImage}
                          className="aspect-square w-full origin-top-left object-cover object-top"
                        />
                      </ThemedZoom>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-2">
                      <span className="text-xs text-muted-foreground">
                        {t('code')}
                      </span>
                      <div className="flex items-center gap-2">
                        <Code>{collection.collectionManufacturerCode}</Code>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t('percentage')}
                      </span>
                      <span>{collection.percent}%</span>
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
    </React.Fragment>
  );
}

export default FabricColorCollectionCarousel;
