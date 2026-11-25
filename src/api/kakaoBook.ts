import type { BookSearchParams, BookSearchResponse } from './types'

const BOOK_SEARCH_URL = 'https://dapi.kakao.com/v3/search/book'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getApiKey(): string {
  const key = import.meta.env.VITE_KAKAO_REST_API_KEY
  if (!key) {
    throw new ApiError(0, 'VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다. .env 파일을 확인해 주세요.')
  }
  return key
}

/**
 * 다음 책 검색 API
 * @see https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book
 */
export async function searchBooks(
  { query, target, sort = 'accuracy', page = 1, size = 10 }: BookSearchParams,
  signal?: AbortSignal,
): Promise<BookSearchResponse> {
  const params = new URLSearchParams({
    query,
    sort,
    page: String(page),
    size: String(size),
  })
  if (target) params.set('target', target)

  const response = await fetch(`${BOOK_SEARCH_URL}?${params}`, {
    headers: { Authorization: `KakaoAK ${getApiKey()}` },
    signal,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(response.status, body?.message ?? '도서 검색 중 오류가 발생했습니다.')
  }

  return response.json() as Promise<BookSearchResponse>
}
