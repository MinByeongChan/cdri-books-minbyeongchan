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

  const toggle = () => setExpanded((prev) => !prev)

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
            <BuyButton url={book.url} title={book.title} />
            <DetailToggleButton title={book.title} expanded={expanded} controls={detailId} onToggle={toggle} />
          </div>
        </div>
      </li>
    )
  }

  const discounted = hasDiscount(book)

  return (
    <li className={styles.item}>
      <section className={styles.detail} id={detailId} aria-label={`${book.title} 상세 정보`}>
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
          <DetailToggleButton title={book.title} expanded={expanded} controls={detailId} onToggle={toggle} />
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
            <BuyButton url={book.url} title={book.title} wide />
          </div>
        </div>
      </section>
    </li>
  )
})

interface DetailToggleButtonProps {
  /** 스크린 리더가 어느 책의 버튼인지 알 수 있게 접근 가능한 이름 앞에 붙인다 */
  title: string
  expanded: boolean
  /** 펼쳐지는 상세 영역의 id (aria-controls) */
  controls: string
  onToggle: () => void
}

/** "상세보기" 버튼. 펼침 여부에 따라 화살표 방향이 바뀐다. */
function DetailToggleButton({ title, expanded, controls, onToggle }: DetailToggleButtonProps) {
  return (
    <Button
      variant="light"
      className={styles.detailButton}
      aria-expanded={expanded}
      aria-controls={expanded ? controls : undefined}
      aria-label={`${title} 상세보기`}
      onClick={onToggle}
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
}

interface BuyButtonProps {
  url: string
  title: string
  /** 펼친 상세에서 쓰는 넓은 버튼(240px). 기본은 목록용(115px) */
  wide?: boolean
}

/** 책 상세 페이지를 새 탭으로 여는 "구매하기" 버튼 */
function BuyButton({ url, title, wide = false }: BuyButtonProps) {
  return (
    <LinkButton
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={wide ? styles.buyButtonWide : styles.buyButton}
      aria-label={`${title} 구매하기 (새 탭에서 열림)`}
    >
      구매하기
    </LinkButton>
  )
}
