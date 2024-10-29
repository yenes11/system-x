import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md bg-[url("/images/search.svg")] bg-[position:12px_50%;] bg-no-repeat py-1 pl-10 pr-3 text-sm shadow-sm ring-1 ring-input transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[url("/images/search-dark.svg")]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
SearchBar.displayName = 'SearchBar';

export { SearchBar };
