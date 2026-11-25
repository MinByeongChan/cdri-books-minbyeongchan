import { memo } from 'react'
import type { Book } from '@/api/types'
import likeFill from '@/assets/icons/like-fill.svg'
import likeLine from '@/assets/icons/like-line.svg'
import likeSmallOff from '@/assets/icons/like-small-off.svg'
import likeSmallOn from '@/assets/icons/like-small-on.svg'
import { useIsWished, wishlistActions } from '@/stores/wishlistStore'
import { getBookId } from '@/utils/book'
import { cx } from '@/utils/cx'
import styles from './LikeButton.module.css'

const ICONS = {
  sm: { on: likeSmallOn, off: likeSmallOff, px: 16 },
  md: { on: likeFill, off: likeLine, px: 24 },
} as const

interface LikeButtonProps {
  book: Book
  size?: keyof typeof ICONS
  className?: string
}

/** 책 표지 위의 하트 버튼. 누르면 찜 목록에 넣거나 뺀다. */
export const LikeButton = memo(function LikeButton({ book, size = 'md', className }: LikeButtonProps) {
  const isWished = useIsWished(getBookId(book))
  const icon = ICONS[size]

  return (
    <button
      type="button"
      className={cx(styles.likeButton, className)}
      aria-pressed={isWished}
      aria-label={isWished ? `${book.title} 찜 해제` : `${book.title} 찜하기`}
      onClick={(event) => {
        event.stopPropagation()
        wishlistActions.toggle(book)
      }}
    >
      <img src={isWished ? icon.on : icon.off} alt="" width={icon.px} height={icon.px} />
    </button>
  )
})
