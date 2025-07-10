'use client';

import { createContext, useContext } from 'react';

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
