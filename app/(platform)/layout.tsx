import { AppSidebar } from '@/components/app-sidebar';
import Header from '@/components/layout/header';
// import Sidebar from '@/components/layout/sidebar';
import Providers from '@/providers/query-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SystemX Dashboard',
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
        {/* <Sidebar /> */}
        <AppSidebar />
        <div className="h-screen w-full min-w-0 max-w-full overflow-auto bg-background">
          <Header />
          <main className="px-4 py-3 md:px-8 md:py-6">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
