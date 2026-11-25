import { useEffect, useRef } from 'react'

interface Options {
  enabled: boolean
  onLoadMore: () => void
  rootMargin?: string
}

/** 목록 끝의 감시 요소(sentinel)가 화면에 들어오면 onLoadMore를 부른다. */
export function useInfiniteScroll<T extends Element>({ enabled, onLoadMore, rootMargin = '200px' }: Options) {
  const sentinelRef = useRef<T>(null)
  const onLoadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  })

  useEffect(() => {
    const node = sentinelRef.current
    if (!enabled || !node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMoreRef.current()
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, rootMargin])

  return sentinelRef
}
