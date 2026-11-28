import type { AnchorHTMLAttributes, ComponentProps } from 'react'
import { cx } from '@/utils/cx'
import styles from './Button.module.css'

/** ghost: 배경·크기 없이 아이콘이나 글자만 있는 버튼(찜 하트, 닫기, 드롭다운 항목 등). 크기는 쓰는 쪽 className이 정한다. */
type Variant = 'primary' | 'light' | 'outline' | 'ghost'
type Size = 'md' | 'sm'

interface StyleProps {
  variant?: Variant
  size?: Size
}

const classNames = ({ variant = 'primary', size = 'md' }: StyleProps, className?: string) =>
  cx(styles.button, styles[variant], variant !== 'ghost' && styles[size], className)

/**
 * 프로젝트의 모든 버튼은 이 컴포넌트를 쓴다. type 기본값(button)과 포커스 표시가 한 곳에서 관리된다.
 * React 19부터 ref도 일반 prop이라 ComponentProps<'button'>에 포함된다(포커스 되돌리기에 사용). */
type ButtonProps = StyleProps & ComponentProps<'button'>

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={classNames({ variant, size }, className)} {...props} />
}

type LinkButtonProps = StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>

/** 외부 링크로 이동하는 버튼 모양의 a 태그 (예: 구매하기) */
export function LinkButton({ variant, size, className, children, ...props }: LinkButtonProps) {
  return (
    <a className={classNames({ variant, size }, className)} {...props}>
      {children}
    </a>
  )
}
