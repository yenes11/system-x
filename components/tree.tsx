'use client';

import { Department } from '@/lib/types';
import { useCustomerDepartmentsSlice } from '@/store/customer-departments-slice';
import {
  ChevronDown,
  File,
  Workflow,
  Users,
  Plus,
  Trash2,
  PencilLine
} from 'lucide-react';
import React, { useState } from 'react';
import ThemedTooltip from './ThemedTooltip';
import { useTranslations } from 'next-intl';

interface TreeProps {
  data: Department[];
  depth?: number;
}

function Tree({ data, depth = 0 }: TreeProps) {
  return (
    <div className="select-none">
      {data.map((department) => (
        <MemoizedTreeNode
          key={department.id}
          department={department}
          depth={depth}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  department: Department;
  depth: number;
}

const TreeNode = ({ department, depth }: TreeNodeProps) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

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
    <div>
      {/* Department Row */}
      <div
        className="relative flex items-center gap-2 py-2"
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        <div className="flex h-8 w-8 items-center justify-center">
          {department.childs?.length > 0 && (
            <ChevronDown
              onClick={toggle}
              className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 hover:bg-muted ${
                isOpen ? 'rotate-180' : ''
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
        <div className="flex w-full items-center justify-between gap-6">
          {department.name}
          <div className="flex items-center gap-2">
            <ThemedTooltip text="display_employees">
              <Users
                onClick={() => {
                  selectDepartment(department.employees, department.id);
                }}
                size={16}
                className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 hover:bg-muted`}
              />
            </ThemedTooltip>
            <ThemedTooltip text="edit_department">
              <PencilLine
                onClick={() => {
                  console.log(department, 'department');
                  setEditSheet(department, true);
                }}
                size={16}
                className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 hover:bg-muted`}
              />
            </ThemedTooltip>
            <ThemedTooltip text="delete_department">
              <Trash2
                role="button"
                onClick={() => {
                  setDeleteDialog({
                    open: true,
                    id: department.id
                  });
                }}
                size={16}
                className={`-m-2 mr-1 box-content rounded-full p-2 text-destructive hover:bg-muted`}
              />
            </ThemedTooltip>
            <ThemedTooltip text="add_sub_department">
              <Plus
                onClick={() => {
                  setIsAddSheetOpen(true, department.id);
                }}
                className={`-m-2 mr-1 box-content cursor-pointer rounded-full p-2 hover:bg-muted`}
                size={16}
              />
            </ThemedTooltip>
          </div>
        </div>
      </div>

      {/* Child Nodes */}
      {isOpen && department.childs?.length > 0 && (
        <Tree data={department.childs} depth={depth + 1} />
      )}
    </div>
  );
};

// Memoized TreeNode to prevent unnecessary re-renders
const MemoizedTreeNode = React.memo(TreeNode);

export default Tree;
