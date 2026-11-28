import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { useSearchHistoryStore } from '@/stores/searchHistoryStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { createBook, createResponse } from '@/test/fixtures'
import SearchPage from './SearchPage'

const fetchMock = vi.fn()

function renderPage(initialEntry = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const lastRequestUrl = () => new URL(fetchMock.mock.calls.at(-1)![0] as string)

beforeEach(() => {
  vi.stubEnv('VITE_KAKAO_REST_API_KEY', 'test-key')
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify(createResponse([createBook()], true, 21)), { status: 200 }),
  )
  useSearchHistoryStore.setState({ history: [] })
  useWishlistStore.setState({ books: [] })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  fetchMock.mockReset()
})

describe('SearchPage', () => {
  it('처음에는 검색 결과 없음 화면을 보여주고 API를 부르지 않는다', () => {
    renderPage()
    expect(screen.getByText('검색된 결과가 없습니다.')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('Enter로 검색하면 결과와 총 건수를 보여주고 검색 기록에 남긴다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByRole('searchbox'), '하루키{Enter}')

    expect(await screen.findByRole('heading', { name: '노르웨이의 숲' })).toBeInTheDocument()
    expect(screen.getByText('21')).toBeInTheDocument()
    expect(lastRequestUrl().searchParams.get('query')).toBe('하루키')
    expect(lastRequestUrl().searchParams.get('size')).toBe('10')
    expect(lastRequestUrl().searchParams.has('target')).toBe(false)
    expect(useSearchHistoryStore.getState().history).toEqual(['하루키'])
  })

  it('상세보기를 누르면 펼쳐져 책 소개와 원가/할인가를 보여준다', async () => {
    const user = userEvent.setup()
    renderPage('/?query=하루키')

    await user.click(await screen.findByRole('button', { name: /상세보기/ }))

    expect(screen.getByText('책 소개')).toBeInTheDocument()
    expect(screen.getByText('16,000원')).toBeInTheDocument()
    expect(screen.getByText('14,400원')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /상세보기/ })).toHaveAttribute('aria-expanded', 'true')
  })

  it('할인가가 없으면 할인가 줄을 보여주지 않는다', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(createResponse([createBook({ sale_price: -1 })])), { status: 200 }),
    )
    const user = userEvent.setup()
    renderPage('/?query=하루키')

    await user.click(await screen.findByRole('button', { name: /상세보기/ }))
    expect(screen.queryByText('할인가')).not.toBeInTheDocument()
  })

  it('하트를 누르면 찜 목록에 넣고, 다시 누르면 뺀다', async () => {
    const user = userEvent.setup()
    renderPage('/?query=하루키')

    await user.click(await screen.findByRole('button', { name: '노르웨이의 숲 찜하기' }))
    expect(useWishlistStore.getState().books).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: '노르웨이의 숲 찜 해제' }))
    expect(useWishlistStore.getState().books).toHaveLength(0)
  })

  it('상세 검색은 target을 붙여 검색하고 전체 검색창을 비운다', async () => {
    const user = userEvent.setup()
    renderPage('/?query=하루키')
    await screen.findByRole('heading', { name: '노르웨이의 숲' })

    await user.click(screen.getByRole('button', { name: '상세검색' }))
    const dialog = screen.getByRole('dialog', { name: '상세 검색' })
    await user.click(within(dialog).getByRole('button', { name: '검색 조건: 제목' }))
    await user.click(within(dialog).getByRole('button', { name: '출판사' }))
    await user.type(within(dialog).getByPlaceholderText('검색어 입력'), '민음사')
    await user.click(within(dialog).getByRole('button', { name: '검색하기' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(lastRequestUrl().searchParams.get('target')).toBe('publisher')
    expect(lastRequestUrl().searchParams.get('query')).toBe('민음사')
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('API 오류가 나면 오류 메시지를 보여준다', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: 'wrong appKey' }), { status: 401 }),
    )
    renderPage('/?query=하루키')
    expect(await screen.findByRole('alert')).toHaveTextContent('wrong appKey')
  })
})
