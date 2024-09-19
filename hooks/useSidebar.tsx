import { create } from 'zustand';

interface SidebarStore {
  isMinimized: boolean;
  collapse: () => void;
  toggle: () => void;
}

// const _window = window;
const isSmallWindow = false; //_window.innerWidth < 950;

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: isSmallWindow,
  collapse: () => set((state) => ({ isMinimized: true })),
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized }))
}));
