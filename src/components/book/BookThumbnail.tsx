import type { Book } from '@/api/types'
import { cx } from '@/utils/cx'
import { LikeButton } from './LikeButton'
import styles from './BookThumbnail.module.css'

interface BookThumbnailProps {
  book: Book
  size: 'sm' | 'lg'
}

const DIMENSIONS = {
  sm: { width: 48, height: 68 },
  lg: { width: 210, height: 280 },
} as const

/** 책 표지 + 찜 버튼. 목록(sm)과 펼친 상세(lg)에서 크기만 바꿔 같이 쓴다. */
export function BookThumbnail({ book, size }: BookThumbnailProps) {
  const { width, height } = DIMENSIONS[size]

  return (
    <div className={cx(styles.thumbnail, styles[size])} style={{ width, height }}>
      {book.thumbnail ? (
        <img
          src={book.thumbnail}
          alt={`${book.title} 표지`}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={styles.image}
        />
      ) : (
        <div className={styles.placeholder} aria-label="표지 이미지 없음" />
      )}
      <LikeButton book={book} size={size === 'sm' ? 'sm' : 'md'} className={styles.like} />
    </div>
  )
}
