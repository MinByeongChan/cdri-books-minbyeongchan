import bookIcon from '@/assets/images/icon-book.png'
import styles from './NoData.module.css'

interface NoDataProps {
  message?: string
}

export function NoData({ message = '검색된 결과가 없습니다.' }: NoDataProps) {
  return (
    <div className={styles.noData}>
      <img src={bookIcon} alt="" width={80} height={80} className={styles.icon} />
      <p className={styles.message}>{message}</p>
    </div>
  )
}
