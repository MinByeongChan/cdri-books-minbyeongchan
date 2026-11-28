import { useCallback, useId, useRef, useState, type FocusEvent, type FormEvent } from 'react'
import type { SearchTarget } from '@/api/types'
import searchIcon from '@/assets/icons/search.svg'
import { Button } from '@/components/common/Button'
import { useOutsideClick, type DismissEvent } from '@/hooks/useOutsideClick'
import { useSearchHistoryStore } from '@/stores/searchHistoryStore'
import { cx } from '@/utils/cx'
import { DetailSearchPopup } from './DetailSearchPopup'
import { SearchHistory } from './SearchHistory'
import styles from './SearchBox.module.css'

interface SearchBoxProps {
  query: string
  target?: SearchTarget
  onSearch: (query: string) => void
  onDetailSearch: (query: string, target: SearchTarget) => void
}

/**
 * 전체 검색창 + 검색 기록 + 상세 검색 버튼.
 * 전체 검색과 상세 검색은 함께 쓸 수 없어서, 상세 검색 중에는 전체 검색 입력창을 비운다.
 */
export function SearchBox({ query, target, onSearch, onDetailSearch }: SearchBoxProps) {
  const appliedKeyword = target ? '' : query
  const [keyword, setKeyword] = useState(appliedKeyword)
  const [prevApplied, setPrevApplied] = useState(appliedKeyword)
  const [isHistoryOpen, setHistoryOpen] = useState(false)
  const [isDetailOpen, setDetailOpen] = useState(false)

  // URL의 검색 조건이 바뀌면(뒤로가기, 상세 검색 등) 입력창도 맞춘다.
  if (prevApplied !== appliedKeyword) {
    setPrevApplied(appliedKeyword)
    setKeyword(appliedKeyword)
  }

  const history = useSearchHistoryStore((state) => state.history)
  const addHistory = useSearchHistoryStore((state) => state.add)
  const removeHistory = useSearchHistoryStore((state) => state.remove)
  const fieldRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const detailSlotRef = useRef<HTMLDivElement>(null)
  const detailButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const inputId = useId()

  const closeHistory = useCallback(() => setHistoryOpen(false), [])
  /** 바깥 클릭으로 닫을 때는 사용자가 누른 곳에 포커스를 두고, ESC·닫기 버튼일 때만 열기 버튼으로 돌려보낸다. */
  const closeDetail = useCallback((event?: DismissEvent) => {
    setDetailOpen(false)
    if (event?.type !== 'pointerdown') detailButtonRef.current?.focus()
  }, [])
  useOutsideClick(fieldRef, closeHistory, isHistoryOpen)
  useOutsideClick(detailSlotRef, closeDetail, isDetailOpen)

  const runSearch = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    addHistory(trimmed)
    setKeyword(trimmed)
    setHistoryOpen(false)
    inputRef.current?.blur()
    onSearch(trimmed)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    runSearch(keyword)
  }

  /** Tab으로 검색창·검색 기록 밖으로 나가면 검색 기록을 닫는다. */
  const handleFieldBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHistoryOpen(false)
  }

  const showHistory = isHistoryOpen && history.length > 0

  return (
    <section className={styles.searchBox} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.title}>
        도서 검색
      </h2>
      <div className={styles.row}>
        <div className={styles.fieldSlot} ref={fieldRef} onBlur={handleFieldBlur}>
          <form
            role="search"
            className={cx(styles.field, showHistory && styles.expanded)}
            onSubmit={handleSubmit}
          >
            <div className={styles.inputRow}>
              <img src={searchIcon} alt="" width={30} height={30} />
              <label htmlFor={inputId} className="sr-only">
                검색어
              </label>
              <input
                id={inputId}
                ref={inputRef}
                className={styles.input}
                type="search"
                placeholder="검색어를 입력하세요"
                autoComplete="off"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onFocus={() => setHistoryOpen(true)}
              />
            </div>
            {showHistory && (
              <SearchHistory
                items={history}
                onSelect={runSearch}
                onRemove={removeHistory}
              />
            )}
          </form>
        </div>

        <div className={styles.detailSlot} ref={detailSlotRef}>
          <Button
            ref={detailButtonRef}
            variant="outline"
            size="sm"
            aria-expanded={isDetailOpen}
            aria-haspopup="dialog"
            onClick={() => setDetailOpen((prev) => !prev)}
          >
            상세검색
          </Button>
          {isDetailOpen && (
            <DetailSearchPopup
              initialQuery={target ? query : ''}
              initialTarget={target}
              onClose={() => closeDetail()}
              onSearch={(detailQuery, detailTarget) => {
                setDetailOpen(false)
                onDetailSearch(detailQuery, detailTarget)
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
