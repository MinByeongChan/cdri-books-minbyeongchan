import { useCallback, useId, useRef, useState } from 'react'
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

/** 검색 조건 선택 드롭다운. Figma대로 현재 선택된 항목은 목록에서 빼고 보여준다. */
export function TargetSelect({ value, onChange }: TargetSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const close = useCallback(() => setOpen(false), [])
  useOutsideClick(rootRef, close, open)

  const selected = TARGET_OPTIONS.find((option) => option.value === value) ?? TARGET_OPTIONS[0]!
  const others = TARGET_OPTIONS.filter((option) => option.value !== value)

  return (
    <div ref={rootRef} className={styles.select}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`검색 조건: ${selected.label}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected.label}
        <img src={arrowIcon} alt="" width={20} height={20} className={cx(styles.arrow, open && styles.arrowOpen)} />
      </button>
      {open && (
        <ul id={listId} role="listbox" className={styles.options}>
          {others.map((option) => (
            <li key={option.value} role="option" aria-selected={false}>
              <button
                type="button"
                className={styles.option}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
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
