import type { Book, BookSearchResponse } from '@/api/types'

export const createBook = (overrides: Partial<Book> = {}): Book => ({
  title: '노르웨이의 숲',
  contents: '나를 언제까지나 잊지 마.',
  url: 'https://search.daum.net/search?w=bookpage&bookId=1',
  isbn: '8937434482 9788937434488',
  datetime: '2024-01-01T00:00:00.000+09:00',
  authors: ['무라카미 하루키'],
  publisher: '민음사',
  translators: ['양억관'],
  price: 16000,
  sale_price: 14400,
  thumbnail: '',
  status: '정상판매',
  ...overrides,
})

export const createResponse = (documents: Book[], isEnd = true, total = documents.length): BookSearchResponse => ({
  meta: { total_count: total, pageable_count: total, is_end: isEnd },
  documents,
})
