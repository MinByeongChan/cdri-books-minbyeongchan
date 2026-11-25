import type { Book } from '@/api/types'

/** ISBN이 비어 있는 책도 있어서 url을 보조 키로 쓴다. */
export const getBookId = (book: Pick<Book, 'isbn' | 'url'>) => book.isbn || book.url

export const hasDiscount = (book: Pick<Book, 'price' | 'sale_price'>) =>
  book.sale_price >= 0 && book.sale_price < book.price

/** 목록에 보여줄 가격: 할인가가 있으면 할인가, 없으면 정가 */
export const getDisplayPrice = (book: Pick<Book, 'price' | 'sale_price'>) =>
  hasDiscount(book) ? book.sale_price : book.price

const priceFormatter = new Intl.NumberFormat('ko-KR')

export const formatPrice = (price: number) => `${priceFormatter.format(price)}원`

export const formatAuthors = (authors: string[]) => authors.join(', ')
