# 커피 로그

원두, 장비, 레시피와 실제 추출 결과를 기록하는 개인용 웹 앱입니다. React와 Vite로 만들었으며 Supabase 계정으로 PC와 휴대폰의 데이터를 동기화할 수 있습니다.

## 주요 기능

- 싱글 원두 및 블렌드 등록과 목록 관리
- 드리퍼, 필터, 그라인더 관리
- 레시피 등록, 수정, 삭제
- 추출 기록 등록, 수정, 삭제
- 저장한 레시피를 추출 기록에 적용
- 추출 방식, 원두, 별점 기준 기록 필터
- 추출 시간 및 푸어링 시간 자동 포맷
- 전체 데이터 JSON 백업 및 복원
- 이메일 회원가입, 로그인 및 로그아웃
- Supabase를 통한 기기 간 데이터 동기화

## 로컬 실행

Node.js와 npm이 설치된 환경에서 다음 명령을 실행합니다.

```bash
npm install
npm run dev
```

프로덕션 빌드와 코드 검사는 다음 명령으로 실행합니다.

```bash
npm run lint
npm run build
```

## 데이터 저장과 백업

Supabase가 설정된 환경에서는 로그인한 사용자의 데이터가 Supabase에 저장되고 브라우저의 `localStorage`에도 사용자별 캐시로 보관됩니다. 처음 로그인할 때 기존 localStorage 기록과 서버 기록을 병합하므로 배포 전 사용하던 데이터도 이어서 사용할 수 있습니다.

Supabase 환경변수가 없는 개발 환경에서는 기존처럼 localStorage만 사용합니다.

화면 상단의 **JSON 백업** 버튼으로 모든 데이터를 파일로 내려받을 수 있습니다. **JSON 복원**은 현재 데이터를 선택한 백업 파일의 내용으로 교체하므로, 복원 전에 필요한 최신 데이터를 먼저 백업하는 것을 권장합니다.

## 배포

Vercel에서 이 GitHub 저장소를 가져오면 Vite 프로젝트로 배포할 수 있습니다.

- Build Command: `npm run build`
- Output Directory: `dist`

## Supabase 준비

Supabase 프로젝트의 **Connect** 화면에서 Project URL과 Publishable Key를 확인한 뒤 `.env.example`을 복사해 `.env.local`을 만듭니다.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`.env.local`은 Git에 커밋하지 않습니다. 브라우저 앱에는 Publishable Key만 사용하고 `service_role` 키는 절대 넣지 않습니다.

데이터 테이블과 사용자별 접근 정책은 `supabase/migrations`의 SQL 파일에 정의되어 있습니다. Supabase SQL Editor에서 해당 파일의 내용을 실행하면 로그인한 사용자가 자신의 데이터만 관리할 수 있는 테이블이 생성됩니다.

## 기술 스택

- React 19
- Vite 8
- CSS
- Web Storage API (`localStorage`)
- Supabase JavaScript Client

## 향후 계획

- 동기화 상태 및 오류 처리 개선
- 비밀번호 재설정 기능
- 기록 검색과 통계 기능
