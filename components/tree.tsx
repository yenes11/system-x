'use client';

import { Department } from '@/lib/types';
import { useCustomerDepartmentsSlice } from '@/store/customer-departments-slice';
import { Pencil1Icon, Pencil2Icon } from '@radix-ui/react-icons';
import {
  ChevronDown,
  Dot,
  File,
  Package,
  Pencil,
  PencilLine,
  Plus,
  Trash,
  Trash2,
  Users,
  Workflow
} from 'lucide-react';
import React, { useState } from 'react';

interface TreeProps {
  data: Department[];
  depth?: number;
}

function Tree({ data, depth = 0 }: TreeProps) {
  const [openDepartments, setOpenDepartments] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDepartment = (id: string) => {
    setOpenDepartments((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectDepartment = useCustomerDepartmentsSlice(
    (state) => state.selectDepartment
  );
  const setDeleteDialog = useCustomerDepartmentsSlice(
    (state) => state.setDeleteDialog
  );
  const setIsAddSheetOpen = useCustomerDepartmentsSlice(
    (state) => state.setIsAddSheetOpen
  );

  const setEditSheet = useCustomerDepartmentsSlice(
    (state) => state.setEditSheet
  );

  return (
    <div className="select-none">
      {data.map((department) => (
        <div key={department.id}>
          <div
            className="relative flex items-center gap-2 py-2"
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            <div className="flex h-8 w-8 items-center justify-center">
              {department.childs?.length > 0 && (
                <ChevronDown
                  onClick={() => toggleDepartment(department.id)}
                  className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 duration-300 hover:bg-muted ${
                    openDepartments[department.id] ? 'rotate-180' : ''
                  }`}
                  size={18}
                />
              )}
            </div>
            {department.childs?.length > 0 ? (
              <Workflow size={12} />
            ) : (
              <File size={12} />
            )}
            <div className="flex w-full items-center justify-between gap-6 text-nowrap">
              {department.name}
              <div className="flex items-center gap-2">
                <Users
                  onClick={() => {
                    selectDepartment(department.employees, department.id);
                  }}
                  size={16}
                  className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 duration-300 hover:bg-muted`}
                />
                <PencilLine
                  onClick={() => {
                    setEditSheet(department, true);
                  }}
                  size={16}
                  className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 duration-300 hover:bg-muted`}
                />
                <Trash2
                  // onClick={() => {
                  //   setDeleteDialog({ id: department.id, open: true });
                  // }}
                  size={16}
                  className={`-m-2 mr-1 box-content cursor-not-allowed rounded-full p-2 text-destructive/50 duration-300 hover:bg-muted`}
                />
                <Plus
                  onClick={() => {
                    setIsAddSheetOpen(true, department.id);
                  }}
                  className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 duration-300 hover:bg-muted`}
                  size={16}
                />
              </div>
            </div>
          </div>
          {department.childs?.length > 0 && (
            <div
              className={`${
                openDepartments[department.id] ? 'block' : 'hidden'
              }`}
            >
              <Tree depth={depth + 1} data={department.childs} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Tree;
