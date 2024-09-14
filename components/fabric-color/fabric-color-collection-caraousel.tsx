'use client';

import React from 'react';
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

  return (
    <Carousel
      opts={{
        align: 'start'
      }}
      className="m-auto mb-4 min-w-0 max-w-full"
    >
      <CarouselContent>
        {data.map((collection, index) => (
          <CarouselItem
            key={index}
            className="shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/5"
          >
            <div className="p-1">
              <Card className="overflow-hidden bg-cover bg-center p-0">
                <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                  <img
                    src={collection.collectionImage}
                    className="positio aspect-square w-full origin-top-left object-cover object-top"
                  />
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
                          description: t('collection_code_copied_to_clipboard')
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
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default FabricColorCollectionCarousel;