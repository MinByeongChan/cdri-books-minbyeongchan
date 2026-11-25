import { createPersistentStore, useStore } from '@/lib/createPersistentStore'

export const MAX_SEARCH_HISTORY = 8

export const searchHistoryStore = createPersistentStore<string[]>('cdri-books:search-history', [])

/** 최신 검색어를 맨 앞에 두고, 중복은 제거하고, 최대 8개를 넘으면 오래된 것부터 버린다. */
export function addHistory(history: string[], keyword: string): string[] {
  const trimmed = keyword.trim()
  if (!trimmed) return history
  return [trimmed, ...history.filter((item) => item !== trimmed)].slice(0, MAX_SEARCH_HISTORY)
}

export const searchHistoryActions = {
  add: (keyword: string) => searchHistoryStore.setState((prev) => addHistory(prev, keyword)),
  remove: (keyword: string) =>
    searchHistoryStore.setState((prev) => prev.filter((item) => item !== keyword)),
}

export const useSearchHistory = () => useStore(searchHistoryStore)
