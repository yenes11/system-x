import { create } from 'zustand';
import { Employee } from '@/lib/types';

type CustomerDepartment = {
  id: string;
  name: string;
  parentCustomerDepartmentId: string | null;
};

type CustomerDepartmentsState = {
  isAddSheetOpen: boolean;
  parentId: string | null;
  isEditSheetOpen: boolean;
  isDeleteDialogOpen: boolean;
  deleteId: string | null;
  editData: Partial<CustomerDepartment> | null;
  selectedDepartmentId: string | null;
  selectedEmployees: Employee[];
};

type CustomerDepartmentsActions = {
  openAddSheet: () => void;
  setIsAddSheetOpen: (isOpen: boolean, parentId: string | null) => void;
  setEditSheet: (data: Partial<CustomerDepartment>, isOpen: boolean) => void;
  openEditSheet: (data: CustomerDepartment) => void;
  setDeleteDialog: ({ id, open }: { id: string; open: boolean }) => void;
  openDeleteDialog: (id: string) => void;
  closeAddSheet: () => void;
  closeEditSheet: () => void;
  closeDeleteDialog: () => void;
  setSelectedDepartmentId: (id: string) => void;
  selectDepartment: (employees: Employee[], departmentId: string) => void;
};

type CustomerDepartmentsSlice = CustomerDepartmentsState &
  CustomerDepartmentsActions;

export const useCustomerDepartmentsSlice = create<CustomerDepartmentsSlice>(
  (set) => ({
    isAddSheetOpen: false,
    parentId: null,
    isEditSheetOpen: false,
    selectedEmployees: [],
    isDeleteDialogOpen: false,
    deleteId: null,
    editData: {
      id: '',
      name: ''
    },
    selectedDepartmentId: null,
    setIsAddSheetOpen: (isOpen: boolean, parentId: string | null) => {
      set({ isAddSheetOpen: isOpen, parentId });
    },
    openAddSheet: () => {
      set({ isAddSheetOpen: true });
    },
    setEditSheet: (data: any, isOpen: boolean) => {
      set({ isEditSheetOpen: isOpen, editData: data });
    },
    openEditSheet: (data: any) => {
      set({ isEditSheetOpen: true, editData: data });
    },
    setDeleteDialog: ({ id, open }) => {
      set({ isDeleteDialogOpen: open, deleteId: id });
    },
    openDeleteDialog: (id: string) => {
      set({ isDeleteDialogOpen: true, deleteId: id });
    },
    closeAddSheet: () => {
      set({ isAddSheetOpen: false });
    },
    closeEditSheet: () => {
      set({ isEditSheetOpen: false, editData: null });
    },
    closeDeleteDialog: () => {
      set({ isDeleteDialogOpen: false, deleteId: null });
    },
    setSelectedDepartmentId: (id) => {
      set({ selectedDepartmentId: id });
    },
    selectDepartment: (employees: Employee[], departmentId: string) => {
      set({ selectedEmployees: employees, selectedDepartmentId: departmentId });
    }
  })
);
