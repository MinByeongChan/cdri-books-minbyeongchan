import { useSyncExternalStore } from 'react'

type Listener = () => void

export interface PersistentStore<T> {
  getSnapshot: () => T
  setState: (updater: T | ((prev: T) => T)) => void
  subscribe: (listener: Listener) => () => void
}

/**
 * localStorage에 저장되는 아주 작은 외부 스토어.
 * - 브라우저를 다시 열어도 상태가 유지된다.
 * - 다른 탭에서 바뀐 값도 storage 이벤트로 받아온다.
 * - useSyncExternalStore로 구독하므로 이 값을 쓰는 컴포넌트만 다시 렌더링된다.
 */
export function createPersistentStore<T>(key: string, initialValue: T): PersistentStore<T> {
  const listeners = new Set<Listener>()

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initialValue : (JSON.parse(raw) as T)
    } catch {
      return initialValue
    }
  }

  let state = read()

  const emit = () => listeners.forEach((listener) => listener())

  const setState: PersistentStore<T>['setState'] = (updater) => {
    state = typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // 저장 공간이 없거나 접근이 막힌 환경(시크릿 모드 등)에서도 메모리 상태로는 동작한다.
    }
    emit()
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return
    state = read()
    emit()
  }

  const subscribe = (listener: Listener) => {
    if (listeners.size === 0) window.addEventListener('storage', onStorage)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) window.removeEventListener('storage', onStorage)
    }
  }

  return { getSnapshot: () => state, setState, subscribe }
}

export function useStore<T, S = T>(store: PersistentStore<T>, selector?: (state: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => {
    const snapshot = store.getSnapshot()
    return (selector ? selector(snapshot) : snapshot) as S
  })
}
