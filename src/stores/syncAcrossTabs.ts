/** persist 미들웨어가 붙은 스토어에서 이 함수가 쓰는 부분만 뽑은 타입 */
interface PersistedStore {
  persist: {
    getOptions: () => { name?: string }
    rehydrate: () => Promise<void> | void
  }
}

/**
 * persist 미들웨어는 다른 탭에서 바뀐 값을 자동으로 가져오지 않는다.
 * storage 이벤트로 같은 키가 바뀐 걸 알면 다시 읽어 온다.
 */
export function syncAcrossTabs(store: PersistedStore) {
  if (typeof window === 'undefined') return

  window.addEventListener('storage', (event) => {
    if (event.key === store.persist.getOptions().name) {
      void store.persist.rehydrate()
    }
  })
}
