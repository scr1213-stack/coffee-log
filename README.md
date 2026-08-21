# 커피 로그

원두, 장비, 레시피와 실제 추출 결과를 기록하는 개인용 웹 앱입니다. React와 Vite로 만들었으며 현재 데이터는 브라우저의 `localStorage`에 저장됩니다.

## 주요 기능

- 싱글 원두 및 블렌드 등록과 목록 관리
- 드리퍼, 필터, 그라인더 관리
- 레시피 등록, 수정, 삭제
- 추출 기록 등록, 수정, 삭제
- 저장한 레시피를 추출 기록에 적용
- 추출 방식, 원두, 별점 기준 기록 필터
- 추출 시간 및 푸어링 시간 자동 포맷
- 전체 데이터 JSON 백업 및 복원

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

현재 데이터는 접속한 브라우저의 `localStorage`에만 저장됩니다. 다른 PC나 휴대폰과 자동으로 동기화되지 않으며 브라우저 데이터를 삭제하면 함께 사라질 수 있습니다.

화면 상단의 **JSON 백업** 버튼으로 모든 데이터를 파일로 내려받을 수 있습니다. **JSON 복원**은 현재 데이터를 선택한 백업 파일의 내용으로 교체하므로, 복원 전에 필요한 최신 데이터를 먼저 백업하는 것을 권장합니다.

## 배포

Vercel에서 이 GitHub 저장소를 가져오면 Vite 프로젝트로 배포할 수 있습니다.

- Build Command: `npm run build`
- Output Directory: `dist`

## 기술 스택

- React 19
- Vite 8
- CSS
- Web Storage API (`localStorage`)

## 향후 계획

- Vercel 배포와 모바일 사용성 점검
- Supabase Auth 및 Database 연동
- PC와 휴대폰 간 데이터 동기화
