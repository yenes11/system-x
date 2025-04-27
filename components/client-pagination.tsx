import { usePagination } from '@/hooks/use-pagination';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination';
import {
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon
} from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>> | ((page: number) => void);
  paginationItemsToDisplay?: number;
};

export default function ClientPagination({
  currentPage,
  totalPages,
  setPage,
  paginationItemsToDisplay = 5
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay
  });

  return (
    <Pagination>
      <PaginationContent className="shadow-xs inline-flex gap-0 -space-x-px rounded-md rtl:space-x-reverse">
        {/* Previous page button */}
        <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
          <PaginationLink
            className={cn(
              buttonVariants({
                variant: 'outline'
              }),
              'rounded-none p-0 shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50'
            )}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage === 1) return;
              setPage(currentPage - 1);
            }}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? 'link' : undefined}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>

        {/* Left ellipsis (...) */}
        {showLeftEllipsis && (
          <PaginationItem className="p-0 [&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page number links */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              className={cn(
                buttonVariants({
                  variant: 'outline'
                }),
                'rounded-none shadow-none focus-visible:z-10',
                page === currentPage && 'bg-accent'
              )}
              onClick={(event) => {
                event.preventDefault();
                setPage(page - 1);
              }}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis (...) */}
        {showRightEllipsis && (
          <PaginationItem className="!p-0 [&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
          <PaginationLink
            className={cn(
              buttonVariants({
                variant: 'outline'
              }),
              'rounded-none p-0 shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50'
            )}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage === totalPages) return;
              setPage(currentPage + 1);
            }}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages ? true : undefined}
            role="button"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
