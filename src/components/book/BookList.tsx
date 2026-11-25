import type { Book } from '@/api/types'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { getBookId } from '@/utils/book'
import { BookListItem } from './BookListItem'
import styles from './BookList.module.css'

interface BookListProps {
  books: Book[]
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

/** 책 목록 + 무한 스크롤. 데이터를 어디서 가져오는지는 모른다(검색 결과/찜 목록 공용). */
export function BookList({ books, hasMore = false, isLoadingMore = false, onLoadMore }: BookListProps) {
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    enabled: hasMore && !isLoadingMore && Boolean(onLoadMore),
    onLoadMore: () => onLoadMore?.(),
  })

  return (
    <>
      <ul className={styles.list}>
        {books.map((book) => (
          <BookListItem key={getBookId(book)} book={book} />
        ))}
      </ul>
      {hasMore && <div ref={sentinelRef} className={styles.sentinel} aria-hidden />}
      {isLoadingMore && (
        <p className={styles.loading} role="status">
          불러오는 중…
        </p>
      )}
    </>
  )
}
