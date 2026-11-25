/** 카카오 다음 책 검색 API 응답/요청 타입 */

export type SearchTarget = 'title' | 'person' | 'publisher' | 'isbn'

export type SearchSort = 'accuracy' | 'latest'

export interface BookSearchParams {
  query: string
  target?: SearchTarget
  sort?: SearchSort
  page?: number
  size?: number
}

export interface Book {
  title: string
  contents: string
  url: string
  isbn: string
  datetime: string
  authors: string[]
  publisher: string
  translators: string[]
  price: number
  /** 할인 가격. 할인 정보가 없으면 -1 */
  sale_price: number
  thumbnail: string
  status: string
}

export interface BookSearchMeta {
  total_count: number
  pageable_count: number
  is_end: boolean
}

export interface BookSearchResponse {
  meta: BookSearchMeta
  documents: Book[]
}
