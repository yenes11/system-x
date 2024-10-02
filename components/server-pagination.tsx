import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext
} from './ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

function ServerPagination({
  data
}: {
  data: {
    pages: number;
    count: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}) {
  const router = useRouter();
  const pathName = usePathname();
  const t = useTranslations();
  const searchParams = useSearchParams();

  const size = Number(searchParams.get('size')) || 10;
  const index = Number(searchParams.get('index')) || 0;

  return (
    <div className="mt-4 flex gap-4">
      <Select
        value={size.toString()}
        onValueChange={(value) => {
          router.push(`${pathName}/?size=${value}&index=${0}`);
        }}
      >
        <SelectTrigger className="w-auto min-w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-auto min-w-32">
          {[5, 10, 15, 20, 50].map((item, i) => (
            <SelectItem key={i} value={item.toString()}>
              {item} {t('rows')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Pagination className="justify-end">
        <PaginationContent>
          {data.hasPrevious && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  router.replace(
                    `${pathName}/?size=${size}&index=${index - 1}`
                  );
                }}
              />
            </PaginationItem>
          )}
          {data.pages > 6 ? (
            <>
              {/* İlk sayfalar: 1, 2, 3 */}
              {index > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      className={
                        index === 0
                          ? 'cursor-pointer bg-secondary'
                          : 'cursor-pointer'
                      }
                      onClick={() => {
                        router.replace(`${pathName}/?size=${size}&index=0`);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {index > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              {Array.from({ length: 3 }).map((_, i) => {
                const pageIndex =
                  Math.max(0, Math.min(data.pages - 3, index - 1)) + i;
                if (pageIndex >= 0 && pageIndex < data.pages) {
                  return (
                    <PaginationItem key={pageIndex}>
                      <PaginationLink
                        className={
                          pageIndex === index
                            ? 'cursor-pointer bg-secondary'
                            : 'cursor-pointer'
                        }
                        onClick={() => {
                          router.replace(
                            `${pathName}/?size=${size}&index=${pageIndex}`
                          );
                        }}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              {/* Son sayfalar: (n-2), (n-1), n */}
              {index < data.pages - 2 && (
                <>
                  {index < data.pages - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      className={
                        index === data.pages - 1
                          ? 'cursor-pointer bg-secondary'
                          : 'cursor-pointer'
                      }
                      onClick={() => {
                        router.replace(
                          `${pathName}/?size=${size}&index=${data.pages - 1}`
                        );
                      }}
                    >
                      {data.pages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
            </>
          ) : (
            Array.from({ length: data.pages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  className={
                    i === index
                      ? 'cursor-pointer bg-secondary'
                      : 'cursor-pointer'
                  }
                  onClick={() => {
                    router.replace(`${pathName}/?size=${size}&index=${i}`);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          )}
          {data.hasNext && (
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  router.replace(
                    `${pathName}/?size=${size}&index=${index + 1}`
                  );
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      <Select
        value={index.toString()}
        onValueChange={(value) =>
          router.push(`${pathName}/?size=${size}&index=${value}`)
        }
      >
        <SelectTrigger className="w-auto min-w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-auto min-w-16">
          {Array.from({ length: data.pages }).map((_, i) => (
            <SelectItem key={i} value={i.toString()}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ServerPagination;
