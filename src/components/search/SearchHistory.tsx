import closeIcon from '@/assets/icons/close.svg'
import { Button } from '@/components/common/Button'
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
          <Button variant="ghost" className={styles.keyword} onClick={() => onSelect(keyword)}>
            {keyword}
          </Button>
          <Button
            variant="ghost"
            className={styles.remove}
            aria-label={`${keyword} 검색 기록 삭제`}
            onClick={() => onRemove(keyword)}
          >
            <img src={closeIcon} alt="" width={24} height={24} />
          </Button>
        </li>
      ))}
    </ul>
  )
}
