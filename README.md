# CERTICOS BOOKS

카카오 「다음 책 검색」 API로 책을 찾고, 마음에 드는 책을 찜해 두는 도서 검색 서비스입니다.
CERTICOS 프론트엔드 사전과제로 만들었고, 화면은 Figma 시안을 기준으로 구현했습니다.

- 디자인: Figma `CERTICOS BOOKS`
- API: [카카오 다음 검색 – 책](https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book)

<br />

## 실행 방법

Node.js 20 이상과 pnpm이 필요합니다.

```bash
pnpm install
```

`.env.example`을 복사해서 `.env`를 만들고, 카카오 REST API 키를 넣습니다.
`.env`는 `.gitignore`에 들어 있어서 저장소에 올라가지 않습니다.

```bash
cp .env.example .env
# VITE_KAKAO_REST_API_KEY=발급받은_REST_API_키
```

```bash
pnpm dev        # 개발 서버 (http://localhost:5173)
pnpm build      # 타입 검사 + 프로덕션 빌드
pnpm test:run   # 테스트
pnpm lint       # oxlint
```

<br />

## 기술 스택

| 구분 | 선택 | 이유 |
| --- | --- | --- |
| UI | React 19, TypeScript | 과제 필수 스택 |
| 서버 상태 | TanStack Query v5 | 과제 필수 스택. `useInfiniteQuery`로 페이지네이션·캐시·요청 취소를 한 번에 처리 |
| 라우팅 | React Router | 검색 화면 / 내가 찜한 책 화면 분리, 검색 조건을 URL에 보관 |
| 스타일 | CSS Modules + CSS 변수 | 런타임 비용이 없고, Figma 토큰을 CSS 변수로 그대로 옮기기 쉬움 |
| 빌드 | Vite | 빠른 개발 서버, 코드 스플리팅 기본 지원 |
| 테스트 | Vitest, Testing Library | Vite 설정을 그대로 쓰고, 사용자 동작 기준으로 테스트 작성 |
| 린트 | oxlint | Vite 템플릿 기본값 |

클라이언트 상태(검색 기록, 찜 목록)는 별도 상태 관리 라이브러리를 쓰지 않았습니다.
두 값 모두 "localStorage에 저장되는 배열 하나"라서, `useSyncExternalStore` 기반의 작은 스토어(`src/lib/createPersistentStore.ts`, 약 70줄)로 충분하다고 판단했습니다.

<br />

## 구현 기능

### 1. 도서 검색 (전체 검색)
- 검색어를 입력하고 Enter를 누르면 검색합니다. 한 번에 10개씩 불러옵니다.
- 목록 끝에 닿으면 다음 10개를 이어서 불러옵니다(무한 스크롤). API의 `is_end`가 `true`가 되면 멈춥니다.
- 검색 결과 총 건수를 보여주고, 검색어가 없거나 결과가 0건이면 "검색된 결과가 없습니다." 화면을 보여줍니다.

### 2. 검색 기록
- 검색창에 포커스하면 최근 검색어가 펼쳐집니다. 누르면 그 검색어로 다시 검색하고, X로 지울 수 있습니다.
- 최대 8개까지 저장합니다. 9번째가 들어오면 가장 오래된 기록부터 지웁니다. 같은 검색어는 중복 없이 맨 앞으로 옮깁니다.
- localStorage에 저장해서 브라우저를 다시 열어도 남아 있습니다.

### 3. 상세 검색
- "상세검색" 버튼을 누르면 버튼 아래에 팝업이 뜹니다. 제목 / 저자명 / 출판사 중 하나를 고르고 검색어를 넣습니다.
- "검색하기"를 누르면 팝업이 닫히고 API의 `target` 파라미터(`title` / `person` / `publisher`)로 검색합니다.
- 전체 검색과 상세 검색은 함께 쓸 수 없습니다.
  - 상세 검색을 하면 전체 검색창이 비워집니다.
  - 전체 검색을 하면 상세 검색 조건이 초기화됩니다.

### 4. 상세보기 (아코디언)
- "상세보기"를 누르면 그 줄이 그 자리에서 펼쳐지고, 큰 표지·책 소개·원가·할인가를 보여줍니다.
- 할인가가 없으면(`sale_price === -1`) 할인가 줄을 숨기고, 원가에 취소선도 긋지 않습니다.
- "구매하기"를 누르면 새 탭에서 책 상세 페이지(API가 주는 `url`, 다음 책)가 열립니다.

### 5. 찜하기 / 내가 찜한 책
- 표지 위 하트를 누르면 찜하고, 다시 누르면 해제합니다.
- 찜하기를 누른 시점의 책 데이터를 그대로 저장합니다. 그래서 이후 API 결과와 내용이 다를 수 있습니다(기획서 명시 사항).
- "내가 찜한 책" 화면에서 찜한 순서(최근 순)대로 10개씩 보여줍니다. 브라우저를 다시 열어도 유지됩니다.

<br />

## 폴더 구조

```
src
├── api/                 # 카카오 API 호출과 응답 타입
│   ├── kakaoBook.ts
│   └── types.ts
├── components/
│   ├── common/          # 도메인을 모르는 공통 UI: Button, Header, NoData, SearchCountText
│   ├── book/            # 책 목록 관련: BookList, BookListItem, BookThumbnail, LikeButton
│   └── search/          # 검색 관련: SearchBox, SearchHistory, DetailSearchPopup, TargetSelect
├── hooks/               # useBookSearch(React Query), useBookSearchState(URL), useInfiniteScroll, useOutsideClick
├── lib/                 # createPersistentStore (localStorage + useSyncExternalStore)
├── stores/              # 검색 기록, 찜 목록 스토어
├── pages/               # SearchPage, WishlistPage
├── styles/tokens.css    # Figma 디자인 토큰(색상, 타이포그래피)
├── utils/               # 가격 포맷, 할인 여부 등 순수 함수
└── assets/              # Figma에서 내려받은 아이콘·이미지
```

<br />

## 평가 기준별 설명

### UI 구현력 및 디자인 완성도 (재사용 가능한 컴포넌트 설계)

**Figma 기준으로 맞췄습니다.**
- Figma `Style` 프레임의 색상과 타이포그래피(Title1~3, Body1~2, Caption 등)를 `src/styles/tokens.css`에 CSS 변수로 옮겼고, 컴포넌트는 이 변수만 씁니다.
- 아이콘과 이미지는 Figma에서 받은 원본 에셋을 그대로 씁니다.
- 1920px 기준으로 브라우저에서 주요 요소의 위치와 크기를 직접 재서 시안과 비교했습니다.
  - 목록 한 줄(960×100)과 펼친 상세(960×344): 표지, 제목, 가격, 버튼 위치
  - 검색 기록 펼침(480×153)
  - 상세 검색 팝업(360×160): 버튼 아래 15px, 가로 가운데 정렬

**컴포넌트는 역할별로 나눴습니다.**
- `Button` / `LinkButton`: `variant`(primary·light·outline)와 `size`(md·sm)만으로 화면의 모든 버튼을 표현합니다. 구매하기는 새 탭 이동이라 의미상 `<a>`인 `LinkButton`으로 만들었습니다.
- `BookList`: 데이터를 어디서 가져오는지 모릅니다. 검색 결과(API)와 찜 목록(localStorage)이 같은 컴포넌트를 씁니다.
- `BookThumbnail`: 목록(48×68)과 상세(210×280)에서 `size`만 바꿔서 씁니다. 찜 버튼도 여기에 포함됩니다.
- `SearchCountText`, `NoData`: 문구만 props로 바꿔서 검색 화면과 찜 화면에서 같이 씁니다.

**접근성도 챙겼습니다.**
- 상세보기 버튼에 `aria-expanded`/`aria-controls`, 찜 버튼에 `aria-pressed`를 달았습니다.
- 팝업은 `role="dialog"`이고, 바깥 클릭이나 ESC로 닫힙니다.
- 아이콘만 있는 버튼에는 `aria-label`을 달았습니다.

### 코드 가독성 및 유지보수성
- **화면과 로직을 분리했습니다.** API 호출은 `api/`, 서버 상태는 `hooks/useBookSearch`, URL 상태는 `hooks/useBookSearchState`, 로컬 저장 상태는 `stores/`에 두었습니다. 페이지 컴포넌트는 이것들을 조합만 합니다.
- **규칙은 순수 함수로 뽑았습니다.** "검색 기록 최대 8개, 중복 제거"(`addHistory`), "할인가가 -1이면 할인 없음"(`hasDiscount`) 같은 규칙을 순수 함수로 분리해서 단위 테스트를 붙였습니다.
- **타입을 API 응답에 맞췄습니다.** API 응답 타입(`Book`, `BookSearchResponse`)을 정의했고, 검색 조건 `target`은 문자열 대신 유니언 타입(`'title' | 'person' | 'publisher'`)으로 다룹니다.
- **테스트는 사용자 동작 기준으로 썼습니다.** `SearchPage.test.tsx`에서 검색, 상세보기, 할인가 미노출, 찜 토글, 상세 검색, API 오류를 확인합니다. 단위 테스트를 합쳐 15개입니다.

### 상태 관리 및 API 연동

| 상태 | 위치 | 이유 |
| --- | --- | --- |
| 검색 결과 | TanStack Query (`useInfiniteQuery`) | 서버 데이터. 캐시, 페이지 누적, 중복 요청 제거를 라이브러리에 맡김 |
| 검색어·검색 조건 | URL 쿼리스트링 (`?query=&target=`) | 새로고침, 뒤로가기, 링크 공유 시에도 같은 결과를 보여줌 |
| 검색 기록, 찜 목록 | localStorage 스토어 | 브라우저를 다시 열어도 유지해야 함 |
| 팝업 열림, 입력 중인 값, 펼침 여부 | 컴포넌트 `useState` | 그 컴포넌트만 아는 UI 상태 |

- 쿼리 키는 `['books', 'search', { query, target }]`입니다. 같은 검색어라도 전체 검색과 상세 검색은 다른 캐시로 구분합니다.
- `staleTime`을 5분으로 두어서, 같은 검색어를 다시 검색하거나 뒤로가기로 돌아오면 API를 다시 부르지 않습니다.
- React Query가 주는 `AbortSignal`을 `fetch`에 넘깁니다. 검색어를 빠르게 바꾸면 이전 요청이 취소됩니다.
- API 오류(잘못된 키 등)는 응답의 `message`를 화면에 보여줍니다. 키가 없으면 요청 전에 안내 문구를 띄웁니다.

### 성능 최적화
- **리렌더링 범위를 줄였습니다.**
  - 찜 상태는 `useSyncExternalStore` + 셀렉터(`useIsWished(bookId)`)로 책 한 권 단위로 구독합니다. 하트 하나를 눌러도 그 책의 버튼만 다시 그려집니다.
  - `BookListItem`과 `LikeButton`은 `memo`로 감쌌습니다. 무한 스크롤로 다음 페이지가 붙어도 기존 줄은 다시 그려지지 않습니다.
- **네트워크 요청을 줄였습니다.**
  - 무한 스크롤은 스크롤 이벤트 대신 `IntersectionObserver`를 씁니다. 목록 끝 200px 전에 미리 불러옵니다.
  - 응답 캐시(`staleTime`)와 요청 취소(`AbortSignal`)로 불필요한 요청을 막습니다.
  - `dapi.kakao.com`에 `preconnect`를 걸어 첫 요청을 앞당깁니다.
- **에셋과 번들을 가볍게 했습니다.**
  - 표지 이미지에 `loading="lazy"`, `decoding="async"`, 고정 `width/height`를 주어 화면 밖 이미지는 늦게 받고, 레이아웃이 흔들리지 않게 했습니다.
  - "내가 찜한 책" 화면은 `React.lazy`로 번들을 분리했습니다.
  - 빈 화면 아이콘은 Figma 원본(840×859, 530KB)을 실제 표시 크기의 2배(160px, 18KB)로 줄였습니다.
  - CSS Modules를 써서 스타일 런타임 비용이 없습니다.

<br />

## 시안에 없어서 직접 정한 것

유의사항에 따라, 시안에 적혀 있지 않은 부분은 아래처럼 판단했습니다.

- **구매하기 링크**: Figma에 "다음 책"과 "네이버 책" 두 버전의 설명이 있습니다. 과제 API(카카오)가 주는 `url`이 다음 책 상세 페이지라서 그쪽으로 연결했습니다.
- **페이지네이션 방식**: 같은 이유로 두 버전이 있습니다. 최신 설명에 있는 무한 스크롤을 택했습니다.
- **목록의 가격**: 할인가가 있으면 할인가, 없으면 정가를 보여줍니다.
- **여러 줄 펼치기**: 상세보기는 줄마다 따로 펼쳐집니다(여러 권을 동시에 비교할 수 있게).
- **찜 화면 문구**: 시안의 건수 라벨은 "도서 검색 결과"인데, 찜 화면에서는 "찜한 책 총 N건", 빈 화면은 "찜한 책이 없습니다."로 바꿨습니다.
- **빈 검색어**: 공백만 입력하고 Enter를 누르면 검색하지 않습니다.
- **표지 이미지가 없는 책**: 회색 박스를 보여줍니다.
- **목록 너비**: 시안이 1920px 기준이라, 본문은 960px 고정에 가운데 정렬로 만들었습니다. 모바일 대응은 범위에서 뺐습니다.

<br />

## 알려진 한계

- `VITE_`로 시작하는 환경 변수는 빌드 결과물에 포함되어 브라우저에서 볼 수 있습니다. `.env`로 저장소 노출은 막았지만, 실제 서비스라면 API 키를 서버(BFF나 프록시)에 두고 프론트는 그 서버를 호출해야 합니다.
- 카카오 API는 `page` 최대 50까지만 허용합니다. 결과가 500건을 넘으면 500건까지만 불러옵니다.
