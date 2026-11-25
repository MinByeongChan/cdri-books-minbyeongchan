import { NavLink } from 'react-router'
import { cx } from '@/utils/cx'
import styles from './Header.module.css'

const NAV_ITEMS = [
  { to: '/', label: '도서 검색' },
  { to: '/wishlist', label: '내가 찜한 책' },
] as const

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <NavLink to="/">CERTICOS BOOKS</NavLink>
      </h1>
      <nav className={styles.nav} aria-label="주요 메뉴">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => cx(styles.navItem, isActive && styles.active)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
