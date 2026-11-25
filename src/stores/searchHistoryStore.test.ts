import { addHistory, MAX_SEARCH_HISTORY } from './searchHistoryStore'

describe('addHistory', () => {
  it('최근 검색어를 맨 앞에 넣는다', () => {
    expect(addHistory(['a', 'b'], 'c')).toEqual(['c', 'a', 'b'])
  })

  it('이미 있는 검색어는 중복 없이 맨 앞으로 옮긴다', () => {
    expect(addHistory(['a', 'b', 'c'], 'b')).toEqual(['b', 'a', 'c'])
  })

  it(`최대 ${MAX_SEARCH_HISTORY}개까지만 두고 가장 오래된 것부터 지운다`, () => {
    const history = ['8', '7', '6', '5', '4', '3', '2', '1']
    const next = addHistory(history, '9')
    expect(next).toHaveLength(MAX_SEARCH_HISTORY)
    expect(next[0]).toBe('9')
    expect(next).not.toContain('1')
  })

  it('공백뿐인 검색어는 저장하지 않고, 앞뒤 공백은 잘라 저장한다', () => {
    expect(addHistory(['a'], '   ')).toEqual(['a'])
    expect(addHistory([], '  하루키 ')).toEqual(['하루키'])
  })
})
