import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { SearchTarget } from '@/api/types'
import closeIcon from '@/assets/icons/close-small.svg'
import { Button } from '@/components/common/Button'
import { TargetSelect } from './TargetSelect'
import styles from './DetailSearchPopup.module.css'

interface DetailSearchPopupProps {
  initialQuery: string
  initialTarget?: SearchTarget
  onSearch: (query: string, target: SearchTarget) => void
  onClose: () => void
}

/**
 * 상세 검색 팝업. 열릴 때마다 현재 URL의 상세 검색 조건으로 시작한다.
 * 그래서 전체 검색을 하고 나면(target이 사라지면) 다음에 열 때 조건이 초기화돼 있다.
 * 바깥 클릭/ESC로 닫기는 열기 버튼까지 감싼 부모(SearchBox)가 맡는다.
 */
export function DetailSearchPopup({ initialQuery, initialTarget = 'title', onSearch, onClose }: DetailSearchPopupProps) {
  const [target, setTarget] = useState<SearchTarget>(initialTarget)
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      inputRef.current?.focus()
      return
    }
    onSearch(trimmed, target)
  }

  return (
    <dialog open className={styles.popup} aria-label="상세 검색">
      <Button variant="ghost" className={styles.close} aria-label="상세 검색 닫기" onClick={onClose}>
        <img src={closeIcon} alt="" width={11.67} height={11.67} />
      </Button>
      <form onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <TargetSelect value={target} onChange={setTarget} />
          <label htmlFor={inputId} className="sr-only">
            상세 검색어
          </label>
          <input
            id={inputId}
            ref={inputRef}
            className={styles.input}
            placeholder="검색어 입력"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button type="submit" size="sm" className={styles.submit}>
          검색하기
        </Button>
      </form>
    </dialog>
  )
}
