import styles from './SearchCountText.module.css'

interface SearchCountTextProps {
  label: string
  count: number
}

const countFormatter = new Intl.NumberFormat('ko-KR')

export function SearchCountText({ label, count }: SearchCountTextProps) {
  return (
    <p className={styles.countText}>
      <span>{label}</span>
      <span>
        총 <em className={styles.count}>{countFormatter.format(count)}</em>건
      </span>
    </p>
  )
}
