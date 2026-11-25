import closeIcon from '@/assets/icons/close.svg'
import styles from './SearchHistory.module.css'

interface SearchHistoryProps {
  items: string[]
  onSelect: (keyword: string) => void
  onRemove: (keyword: string) => void
}

export function SearchHistory({ items, onSelect, onRemove }: SearchHistoryProps) {
  return (
    <ul className={styles.history} aria-label="최근 검색어">
      {items.map((keyword) => (
        <li key={keyword} className={styles.item}>
          <button type="button" className={styles.keyword} onClick={() => onSelect(keyword)}>
            {keyword}
          </button>
          <button
            type="button"
            className={styles.remove}
            aria-label={`${keyword} 검색 기록 삭제`}
            onClick={() => onRemove(keyword)}
          >
            <img src={closeIcon} alt="" width={24} height={24} />
          </button>
        </li>
      ))}
    </ul>
  )
}
