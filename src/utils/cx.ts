/** falsy 값을 걸러내고 className을 합친다. */
export const cx = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(' ')
