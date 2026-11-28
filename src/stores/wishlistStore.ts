import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book } from '@/api/types'
import { getBookId } from '@/utils/book'
import { syncAcrossTabs } from './syncAcrossTabs'

interface WishlistState {
  /** 찜한 책. 최근에 찜한 책이 앞에 온다. */
  books: Book[]
  toggle: (book: Book) => void
}

/**
 * 찜 목록. 찜하기를 누른 시점의 책 데이터를 그대로 저장한다.
 * (그래서 이후 API 결과와 내용이 다를 수 있다 — 기획서 명시 사항)
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      books: [],
      toggle: (book) =>
        set((state) => {
          const id = getBookId(book)
          const wished = state.books.some((item) => getBookId(item) === id)
          return {
            books: wished ? state.books.filter((item) => getBookId(item) !== id) : [book, ...state.books],
          }
        }),
    }),
    {
      name: 'cdri-books:wishlist',
      partialize: (state) => ({ books: state.books }),
    },
  ),
)

syncAcrossTabs(useWishlistStore)

/** 책 한 권의 찜 여부만 구독한다. 다른 책의 찜 상태가 바뀌어도 이 값이 같으면 리렌더링되지 않는다. */
export const useIsWished = (bookId: string) =>
  useWishlistStore((state) => state.books.some((item) => getBookId(item) === bookId))
