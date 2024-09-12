import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Providers from '@/providers/query-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex w-full">
        <Sidebar />
        {/* <div className="w-full"> */}
        <div className="bg-soft h-screen w-full min-w-0 max-w-full overflow-auto">
          <Header />
          <main className="p-4 md:px-8">{children}</main>
        </div>
        {/* </div> */}
      </div>
    </Providers>
  );
}
