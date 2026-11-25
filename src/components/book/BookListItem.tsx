import { memo, useId, useState } from 'react'
import type { Book } from '@/api/types'
import chevron from '@/assets/icons/chevron.svg'
import { Button, LinkButton } from '@/components/common/Button'
import { formatAuthors, formatPrice, getDisplayPrice, hasDiscount } from '@/utils/book'
import { cx } from '@/utils/cx'
import { BookThumbnail } from './BookThumbnail'
import styles from './BookListItem.module.css'

interface BookListItemProps {
  book: Book
}

/**
 * 도서 목록의 한 줄. "상세보기"를 누르면 같은 자리에서 아코디언처럼 펼쳐진다.
 * 펼침 상태는 줄마다 따로 가진다(여러 줄을 동시에 펼칠 수 있다).
 */
export const BookListItem = memo(function BookListItem({ book }: BookListItemProps) {
  const [expanded, setExpanded] = useState(false)
  const detailId = useId()

  const toggleButton = (
    <Button
      variant="light"
      className={styles.detailButton}
      aria-expanded={expanded}
      aria-controls={detailId}
      onClick={() => setExpanded((prev) => !prev)}
    >
      상세보기
      <img
        src={chevron}
        alt=""
        width={8}
        height={14}
        className={cx(styles.chevron, expanded && styles.chevronUp)}
      />
    </Button>
  )

  const buyButton = (wide: boolean) => (
    <LinkButton
      href={book.url}
      target="_blank"
      rel="noopener noreferrer"
      className={wide ? styles.buyButtonWide : styles.buyButton}
    >
      구매하기
    </LinkButton>
  )

  if (!expanded) {
    return (
      <li className={styles.item}>
        <div className={styles.summary}>
          <BookThumbnail book={book} size="sm" />
          <div className={styles.info}>
            <h3 className={styles.title}>{book.title}</h3>
            <span className={styles.author}>{formatAuthors(book.authors)}</span>
          </div>
          <strong className={styles.price}>{formatPrice(getDisplayPrice(book))}</strong>
          <div className={styles.actions}>
            {buyButton(false)}
            {toggleButton}
          </div>
        </div>
      </li>
    )
  }

  const discounted = hasDiscount(book)

  return (
    <li className={styles.item}>
      <div className={styles.detail} id={detailId}>
        <BookThumbnail book={book} size="lg" />
        <div className={styles.detailBody}>
          <div className={styles.detailHeading}>
            <h3 className={styles.detailTitle}>{book.title}</h3>
            <span className={styles.detailAuthor}>{formatAuthors(book.authors)}</span>
          </div>
          <h4 className={styles.introLabel}>책 소개</h4>
          <p className={styles.intro}>{book.contents || '책 소개가 없습니다.'}</p>
        </div>
        <div className={styles.detailSide}>
          {toggleButton}
          <div className={styles.purchase}>
            <dl className={styles.prices}>
              <div className={styles.priceRow}>
                <dt>원가</dt>
                <dd className={cx(styles.originalPrice, discounted && styles.strike)}>
                  {formatPrice(book.price)}
                </dd>
              </div>
              {discounted && (
                <div className={styles.priceRow}>
                  <dt>할인가</dt>
                  <dd className={styles.salePrice}>{formatPrice(book.sale_price)}</dd>
                </div>
              )}
            </dl>
            {buyButton(true)}
          </div>
        </div>
      </div>
    </li>
  )
})
