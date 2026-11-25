import { formatPrice, getBookId, getDisplayPrice, hasDiscount } from './book'

describe('book utils', () => {
  it('할인가가 -1이면 할인이 없는 것으로 본다', () => {
    expect(hasDiscount({ price: 16000, sale_price: -1 })).toBe(false)
    expect(getDisplayPrice({ price: 16000, sale_price: -1 })).toBe(16000)
  })

  it('할인가가 있으면 목록에는 할인가를 보여준다', () => {
    expect(hasDiscount({ price: 16000, sale_price: 13500 })).toBe(true)
    expect(getDisplayPrice({ price: 16000, sale_price: 13500 })).toBe(13500)
  })

  it('가격을 원 단위로 표기한다', () => {
    expect(formatPrice(13500)).toBe('13,500원')
  })

  it('ISBN이 없으면 url을 id로 쓴다', () => {
    expect(getBookId({ isbn: '', url: 'https://x' })).toBe('https://x')
    expect(getBookId({ isbn: '123 456', url: 'https://x' })).toBe('123 456')
  })
})
