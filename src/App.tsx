import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import { Header } from '@/components/common/Header'
import SearchPage from '@/pages/SearchPage'

// 첫 화면에 필요 없는 찜 목록 페이지는 따로 번들로 나눠서 필요할 때 받는다.
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<SearchPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
