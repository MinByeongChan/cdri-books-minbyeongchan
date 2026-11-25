import { BookList } from '@/components/book/BookList'
import { NoData } from '@/components/common/NoData'
import { SearchCountText } from '@/components/common/SearchCountText'
import { SearchBox } from '@/components/search/SearchBox'
import { useBookSearch } from '@/hooks/useBookSearch'
import { useBookSearchState } from '@/hooks/useBookSearchState'
import styles from './Page.module.css'

export default function SearchPage() {
  const { query, target, searchAll, searchDetail } = useBookSearchState()
  const { data, isPending, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useBookSearch(query, target)

  const hasQuery = query.length > 0
  const books = data?.books ?? []

  const renderResult = () => {
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
    if (books.length === 0) return <NoData />
    return (
      <BookList
        books={books}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    )
  }

  return (
    <div className={styles.page}>
      <SearchBox query={query} target={target} onSearch={searchAll} onDetailSearch={searchDetail} />
      <div className={styles.count}>
        <SearchCountText label="도서 검색 결과" count={hasQuery ? (data?.totalCount ?? 0) : 0} />
      </div>
      {renderResult()}
    </div>
  )
}
