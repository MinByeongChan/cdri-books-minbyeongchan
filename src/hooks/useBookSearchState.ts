import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { SearchTarget } from '@/api/types'

const TARGETS: SearchTarget[] = ['title', 'person', 'publisher']

const isTarget = (value: string | null): value is SearchTarget =>
  value !== null && (TARGETS as string[]).includes(value)

export interface BookSearchState {
  query: string
  /** 상세 검색일 때만 값이 있다. 전체 검색이면 undefined */
  target?: SearchTarget
}

/**
 * 검색 조건을 URL(?query=&target=)에 둔다.
 * 새로고침·뒤로가기·링크 공유를 해도 같은 결과를 보여줄 수 있다.
 */
export function useBookSearchState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const state = useMemo<BookSearchState>(() => {
    const target = searchParams.get('target')
    return {
      query: searchParams.get('query') ?? '',
      target: isTarget(target) ? target : undefined,
    }
  }, [searchParams])

  /** 전체 검색 — 상세 검색 조건(target)은 버린다. */
  const searchAll = useCallback(
    (query: string) => setSearchParams({ query: query.trim() }),
    [setSearchParams],
  )

  /** 상세 검색 — 전체 검색어는 target이 붙으면서 덮어쓴다. */
  const searchDetail = useCallback(
    (query: string, target: SearchTarget) => setSearchParams({ query: query.trim(), target }),
    [setSearchParams],
  )

  return { ...state, searchAll, searchDetail }
}
