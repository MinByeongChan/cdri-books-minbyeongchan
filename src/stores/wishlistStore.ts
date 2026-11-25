import type { Book } from '@/api/types'
import { createPersistentStore, useStore } from '@/lib/createPersistentStore'
import { getBookId } from '@/utils/book'

/**
 * 찜한 책 목록. 찜하기를 누른 시점의 책 데이터를 그대로 저장한다.
 * (그래서 이후 API 결과와 내용이 다를 수 있다 — 기획서 명시 사항)
 * 최근에 찜한 책이 앞에 온다.
 */
export const wishlistStore = createPersistentStore<Book[]>('cdri-books:wishlist', [])

export const wishlistActions = {
  toggle: (book: Book) => {
    const id = getBookId(book)
    wishlistStore.setState((prev) =>
      prev.some((item) => getBookId(item) === id)
        ? prev.filter((item) => getBookId(item) !== id)
        : [book, ...prev],
    )
  },
}

export const useWishlist = () => useStore(wishlistStore)

/** 책 한 권의 찜 여부만 구독한다. 다른 책의 찜 상태가 바뀌어도 이 값이 같으면 리렌더링되지 않는다. */
export const useIsWished = (bookId: string) =>
  useStore(wishlistStore, (list) => list.some((item) => getBookId(item) === bookId))
