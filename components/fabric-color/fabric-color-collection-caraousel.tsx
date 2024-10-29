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

interface ColorCollection {
  collectionId: string;
  collectionColorId: string;
  collectionName: string;
  collectionCustomerCode: string;
  collectionManufacturerCode: string;
  collectionImage: string;
  collectionColorName: string;
  percent: number;
}

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
        className="mb-4 w-96 rounded-full bg-card"
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
                          className="positio aspect-square w-full origin-top-left object-cover object-top"
                        />
                      </ThemedZoom>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-2">
                      <span className="text-xs text-muted-foreground">
                        {t('code')}
                      </span>
                      <div className="flex items-center gap-2">
                        <code>{collection.collectionManufacturerCode}</code>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              collection.collectionManufacturerCode
                            );
                            toast({
                              title: t('copied_to_clipboard'),
                              description: t(
                                'collection_code_copied_to_clipboard'
                              )
                            });
                          }}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy Order ID</span>
                        </Button>
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
