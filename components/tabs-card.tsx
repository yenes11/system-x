'use client';

import { BoxIcon, HouseIcon, PanelsTopLeftIcon, Plus } from 'lucide-react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { EmployeeTable } from './tables/employee-tables/employee-table';
import { DataTable } from './ui/data-table';

export default function TabsCard() {
  const columns = [
    { header: 'name', accessorKey: 'name' },
    { header: 'unit', accessorKey: 'unit' },
    { header: 'currency', accessorKey: 'currency' },
    {
      id: 'asd',

      header: () => (
        // <div>
        <Button variant="ghost" size="sm" className="-my-2 ml-auto flex">
          <Plus className="mr-2 size-4" /> Add Material
        </Button>
        // </div>
      )
    }
  ];

  const data = [
    { id: 1, name: 'Enes', unit: 'TRY', currency: 'Yenicilik' },
    { id: 2, name: 'Enes', unit: 'TRY', currency: 'Yenicilik' },
    { id: 3, name: 'Enes', unit: 'TRY', currency: 'Yenicilik' },
    { id: 4, name: 'Enes', unit: 'TRY', currency: 'Yenicilik' }
  ];

  return (
    <Tabs defaultValue="tab-1">
      <Card className="border-none bg-transparent">
        <CardHeader className="p-0">
          <TabsList className="relative -mb-[1px] h-auto w-full justify-start gap-0.5 bg-transparent p-0 ">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden !rounded-b-none border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:border-b-background data-[state=active]:shadow-none"
            >
              <HouseIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden !rounded-b-none border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:border-b-background data-[state=active]:shadow-none"
            >
              <PanelsTopLeftIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="overflow-hidden !rounded-b-none border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:border-b-background data-[state=active]:shadow-none"
            >
              <BoxIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Packages
            </TabsTrigger>
            {/* <Button variant="outline" size="sm" className="ml-auto flex">
              <Plus className="mr-2 size-4" /> Add Material
            </Button> */}
          </TabsList>
        </CardHeader>
        <CardContent className="overflow-hidden rounded !rounded-ss-none border p-0">
          <TabsContent className="mt-0 p-0" value="tab-1">
            <div className="">
              <DataTable
                className="!w-full"
                searchKey=""
                columns={columns}
                data={data}
              />
            </div>
          </TabsContent>
          <TabsContent className="mt-0" value="tab-2">
            <p className="p-4 pt-1 text-center text-xs text-muted-foreground">
              Content for Tab 2
            </p>
          </TabsContent>
          <TabsContent className="mt-0" value="tab-3">
            <p className="p-4 pt-1 text-center text-xs text-muted-foreground">
              Content for Tab 3
            </p>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
