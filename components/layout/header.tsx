import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import { Input } from '../ui/input';
import LocaleDropdown from './locale-dropdown';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 z-40 h-14 w-full border-b bg-card">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn('block md:!hidden')}>
          <MobileSidebar />
        </div>
        {/* <Input placeholder="Search..." /> */}
        <div className="flex items-center gap-2">
          <LocaleDropdown />
          <ThemeToggle />
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
