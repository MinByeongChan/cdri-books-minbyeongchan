import type { SearchTarget } from '@/api/types'
import { BookList } from '@/components/book/BookList'
import { NoData } from '@/components/common/NoData'
import { SearchCountText } from '@/components/common/SearchCountText'
import { SearchBox } from '@/components/search/SearchBox'
import { useBookSearch } from '@/hooks/useBookSearch'
import { useBookSearchState } from '@/hooks/useBookSearchState'
import styles from './Page.module.css'

export default function SearchPage() {
  const { query, target, searchAll, searchDetail } = useBookSearchState()

  return (
    <div className={styles.page}>
      <SearchBox query={query} target={target} onSearch={searchAll} onDetailSearch={searchDetail} />
      <SearchResult query={query} target={target} />
    </div>
  )
}

interface SearchResultProps {
  query: string
  target?: SearchTarget
}

/** 검색 조건으로 API를 불러와 건수와 결과 영역을 그린다. */
function SearchResult({ query, target }: SearchResultProps) {
  const result = useBookSearch(query, target)
  const hasQuery = query.length > 0

  return (
    <>
      <div className={styles.count}>
        <SearchCountText label="도서 검색 결과" count={hasQuery ? (result.data?.totalCount ?? 0) : 0} />
      </div>
      <SearchResultBody hasQuery={hasQuery} result={result} />
    </>
  )
}

interface SearchResultBodyProps {
  hasQuery: boolean
  result: ReturnType<typeof useBookSearch>
}

/** 검색 상태(검색 전·로딩·오류·0건·결과)에 따라 보여줄 화면을 고른다. */
function SearchResultBody({ hasQuery, result }: SearchResultBodyProps) {
  const { data, isPending, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = result

  if (!hasQuery) return <NoData />

  if (isPending) {
    return (
      <p className={styles.status} role="status">
        검색 중…
      </p>
    )
  }

  if (isError) {
    return (
      <p className={styles.error} role="alert">
        {error.message}
      </p>
    )
  }

  if (data.books.length === 0) return <NoData />

  return (
    <BookList
      books={data.books}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={fetchNextPage}
    />
  )
}
