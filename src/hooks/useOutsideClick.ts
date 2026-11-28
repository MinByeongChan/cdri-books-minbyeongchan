import { useEffect, type RefObject } from 'react'

export type DismissEvent = PointerEvent | KeyboardEvent

/**
 * ref 바깥을 누르거나 ESC를 누르면 handler를 부른다. 팝업·드롭다운 닫기에 쓴다.
 * handler는 원인 이벤트를 받는다. ESC로 닫을 때만 포커스를 되돌리는 식으로 구분할 수 있다.
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  handler: (event: DismissEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler(event)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler(event)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [ref, handler, enabled])
}
