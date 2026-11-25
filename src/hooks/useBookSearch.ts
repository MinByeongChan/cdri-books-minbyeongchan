import { useInfiniteQuery } from '@tanstack/react-query'
import { searchBooks } from '@/api/kakaoBook'
import type { SearchTarget } from '@/api/types'

export const PAGE_SIZE = 10
/** 카카오 API가 허용하는 page 최댓값 */
const MAX_PAGE = 50

export const bookKeys = {
  all: ['books'] as const,
  search: (query: string, target?: SearchTarget) => [...bookKeys.all, 'search', { query, target }] as const,
}

/** 페이지당 10개씩, 스크롤이 끝에 닿으면 다음 페이지를 불러온다. */
export function useBookSearch(query: string, target?: SearchTarget) {
  return useInfiniteQuery({
    queryKey: bookKeys.search(query, target),
    queryFn: ({ pageParam, signal }) =>
      searchBooks({ query, target, page: pageParam, size: PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.meta.is_end || lastPageParam >= MAX_PAGE ? undefined : lastPageParam + 1,
    enabled: query.trim().length > 0,
    select: (data) => ({
      books: data.pages.flatMap((page) => page.documents),
      totalCount: data.pages[0]?.meta.total_count ?? 0,
    }),
  })
}
