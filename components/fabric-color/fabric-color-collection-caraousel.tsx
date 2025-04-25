'use client';

import { ColorCollection } from '@/lib/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import ImageZoom from '../image-zoom';
import { SearchBar } from '../searchbar';
import { Card, CardContent, CardFooter } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import Code from '../ui/code';
import Empty from '../ui/empty';

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
                      <ImageZoom>
                        <Image
                          width={256}
                          height={256}
                          alt={collection.collectionColorName}
                          src={collection.collectionImage}
                          className="aspect-square w-full origin-top-left object-cover object-top"
                        />
                      </ImageZoom>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-2">
                      <span className="text-xs text-muted-foreground">
                        {t('manufacturer_code')}
                      </span>
                      <Code>{collection.collectionManufacturerCode}</Code>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {t('customer_code')}
                      </span>
                      <Code>{collection.collectionCustomerCode}</Code>
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
