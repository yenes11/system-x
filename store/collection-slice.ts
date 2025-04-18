import { CollectionDetails, CollectionDraft } from '@/lib/types';
import { create } from 'zustand';

type CollectionState = {
  currentCollectionColor: CollectionDraft | null;
  isVerified: boolean;
};

type CollectionActions = {
  setCurrentCollectionColor: (collection: CollectionDraft) => void;
};

type CustomerDepartmentsSlice = CollectionState & CollectionActions;

export const useCollectionSlice = create<CustomerDepartmentsSlice>((set) => ({
  currentCollectionColor: null,
  isVerified: false,
  setCurrentCollectionColor: (collection: CollectionDraft) => {
    set({
      currentCollectionColor: collection,
      isVerified: collection.identityDefined
    });
  }
}));
