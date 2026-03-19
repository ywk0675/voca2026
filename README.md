# VocabMon

학생이 Google 로그인으로 접속하고, 각자의 별/레벨/몬스터 진화 상태가 Supabase에 저장되는 Vite + React + PWA 프로젝트입니다.

## 1. 로컬 실행

```bash
npm install
npm run dev
```

`.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## 2. Supabase 설정

1. Supabase에서 새 프로젝트를 만듭니다.
2. Authentication > Providers > Google 을 활성화합니다.
3. Google Cloud Console에서 OAuth Client를 만들고 아래 Redirect URL을 등록합니다.
4. Supabase SQL Editor에서 [20260319_init.sql](C:\projects\vocabmon\supabase\migrations\20260319_init.sql) 파일 내용을 실행합니다.

필수 Redirect URL:

- `http://localhost:5173`
- `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
- `https://YOUR-VERCEL-DOMAIN.vercel.app`

권장 Site URL:

- 개발 중: `http://localhost:5173`
- 배포 후: `https://YOUR-VERCEL-DOMAIN.vercel.app`

생성되는 테이블:

- `profiles`: 사용자 기본 정보
- `monsters`: 몬스터/코인/연속 출석 등 1인 1행 상태
- `progress`: 유닛/스테이지별 별 저장

## 3. Vercel 배포

1. GitHub에 이 저장소를 올립니다.
2. Vercel에서 저장소를 Import 합니다.
3. Build Command는 `npm run build`, Output Directory는 `dist`를 사용합니다.
4. Environment Variables에 아래를 추가합니다.

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

5. Vercel 배포 도메인을 Supabase Auth Redirect URL과 Google OAuth Authorized redirect / origin에 모두 추가합니다.

## 4. PWA

- `vite-plugin-pwa`가 설정되어 있습니다.
- 매니페스트는 [vite.config.js](C:\projects\vocabmon\vite.config.js)에서 관리합니다.
- 아이콘은 [public/icons/icon-192.svg](C:\projects\vocabmon\public\icons\icon-192.svg), [public/icons/icon-512.svg](C:\projects\vocabmon\public\icons\icon-512.svg)를 사용합니다.

## 5. 현재 구조

- [src/App.jsx](C:\projects\vocabmon\src\App.jsx): 세션 분기와 앱 진입점
- [src/components/Auth.jsx](C:\projects\vocabmon\src\components\Auth.jsx): Google 로그인 화면
- [src/components/VocabMon.jsx](C:\projects\vocabmon\src\components\VocabMon.jsx): 메인 게임 컴포넌트
- [src/hooks/useProgress.js](C:\projects\vocabmon\src\hooks\useProgress.js): 로컬 + Supabase 진행상황 동기화
- [src/lib/supabase.js](C:\projects\vocabmon\src\lib\supabase.js): Supabase 클라이언트
