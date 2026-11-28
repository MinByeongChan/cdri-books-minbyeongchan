import { useState } from 'react'
import { BookList } from '@/components/book/BookList'
import { NoData } from '@/components/common/NoData'
import { SearchCountText } from '@/components/common/SearchCountText'
import { PAGE_SIZE } from '@/hooks/useBookSearch'
import { useWishlistStore } from '@/stores/wishlistStore'
import styles from './Page.module.css'

export default function WishlistPage() {
  const wishlist = useWishlistStore((state) => state.books)
  // 찜 목록은 로컬에 다 있지만, 검색 결과와 같은 방식으로 10개씩 이어서 보여준다.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>내가 찜한 책</h2>
      <div className={styles.count}>
        <SearchCountText label="찜한 책" count={wishlist.length} />
      </div>
      {wishlist.length === 0 ? (
        <NoData message="찜한 책이 없습니다." />
      ) : (
        <BookList
          books={wishlist.slice(0, visibleCount)}
          hasMore={visibleCount < wishlist.length}
          onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
        />
      )}
    </div>
  )
}
