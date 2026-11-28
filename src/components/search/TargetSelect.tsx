import { useCallback, useId, useRef, useState, type KeyboardEvent } from 'react'
import type { SearchTarget } from '@/api/types'
import arrowIcon from '@/assets/icons/select-arrow.svg'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { cx } from '@/utils/cx'
import styles from './TargetSelect.module.css'

const TARGET_OPTIONS: ReadonlyArray<{ value: SearchTarget; label: string }> = [
  { value: 'title', label: '제목' },
  { value: 'person', label: '저자명' },
  { value: 'publisher', label: '출판사' },
]

interface TargetSelectProps {
  value: SearchTarget
  onChange: (value: SearchTarget) => void
}

/**
 * 검색 조건 선택 드롭다운. Figma대로 현재 선택된 항목은 목록에서 빼고 보여준다.
 * 접근성은 디스클로저 패턴(버튼 + aria-expanded로 여닫는 버튼 목록)을 따른다.
 */
export function TargetSelect({ value, onChange }: TargetSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  const close = useCallback(() => setOpen(false), [])
  useOutsideClick(rootRef, close, open)

  // 드롭다운이 열린 상태의 ESC는 드롭다운만 닫는다(바깥 상세 검색 팝업까지 닫히지 않게).
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !open) return
    event.stopPropagation()
    setOpen(false)
    triggerRef.current?.focus()
  }

  const select = (next: SearchTarget) => {
    onChange(next)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const selected = TARGET_OPTIONS.find((option) => option.value === value) ?? TARGET_OPTIONS[0]!
  const others = TARGET_OPTIONS.filter((option) => option.value !== value)

  return (
    <div ref={rootRef} className={styles.select}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`검색 조건: ${selected.label}`}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        {selected.label}
        <img src={arrowIcon} alt="" width={20} height={20} className={cx(styles.arrow, open && styles.arrowOpen)} />
      </button>
      {open && (
        <ul id={listId} className={styles.options}>
          {others.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={styles.option}
                onClick={() => select(option.value)}
                onKeyDown={handleKeyDown}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
