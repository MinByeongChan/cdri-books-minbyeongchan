import { createBook } from '@/test/fixtures'
import { useWishlistStore } from './wishlistStore'

const STORAGE_KEY = 'cdri-books:wishlist'

beforeEach(() => {
  localStorage.clear()
  useWishlistStore.setState({ books: [] })
})

describe('wishlistStore', () => {
  it('toggle로 찜하고, 같은 책을 다시 toggle하면 뺀다', () => {
    const book = createBook()
    useWishlistStore.getState().toggle(book)
    expect(useWishlistStore.getState().books).toEqual([book])

    useWishlistStore.getState().toggle(book)
    expect(useWishlistStore.getState().books).toEqual([])
  })

  it('최근에 찜한 책이 앞에 온다', () => {
    const first = createBook({ isbn: '1', title: '첫 번째' })
    const second = createBook({ isbn: '2', title: '두 번째' })
    useWishlistStore.getState().toggle(first)
    useWishlistStore.getState().toggle(second)
    expect(useWishlistStore.getState().books.map((book) => book.title)).toEqual(['두 번째', '첫 번째'])
  })

  it('찜 목록을 localStorage에 저장한다(액션 함수는 저장하지 않는다)', () => {
    useWishlistStore.getState().toggle(createBook())
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.state.books).toHaveLength(1)
    expect(saved.state).not.toHaveProperty('toggle')
  })

  it('다른 탭에서 바뀐 값을 storage 이벤트로 다시 읽어 온다', async () => {
    const book = createBook()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { books: [book] }, version: 0 }))
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
    await vi.waitFor(() => expect(useWishlistStore.getState().books).toEqual([book]))
  })
})
