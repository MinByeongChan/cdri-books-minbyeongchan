import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { syncAcrossTabs } from './syncAcrossTabs'

export const MAX_SEARCH_HISTORY = 8

/** 최신 검색어를 맨 앞에 두고, 중복은 제거하고, 최대 8개를 넘으면 오래된 것부터 버린다. */
export function addHistory(history: string[], keyword: string): string[] {
  const trimmed = keyword.trim()
  if (!trimmed) return history
  return [trimmed, ...history.filter((item) => item !== trimmed)].slice(0, MAX_SEARCH_HISTORY)
}

interface SearchHistoryState {
  history: string[]
  add: (keyword: string) => void
  remove: (keyword: string) => void
}

/** 검색 기록. localStorage에 저장해서 브라우저를 다시 열어도 유지된다. */
export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      add: (keyword) => set((state) => ({ history: addHistory(state.history, keyword) })),
      remove: (keyword) => set((state) => ({ history: state.history.filter((item) => item !== keyword) })),
    }),
    {
      name: 'cdri-books:search-history',
      partialize: (state) => ({ history: state.history }),
    },
  ),
)

syncAcrossTabs(useSearchHistoryStore)
