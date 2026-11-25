import { useEffect, type RefObject } from 'react'

/** ref 바깥을 누르거나 ESC를 누르면 handler를 부른다. 팝업·드롭다운 닫기에 쓴다. */
export function useOutsideClick(ref: RefObject<HTMLElement | null>, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [ref, handler, enabled])
}
