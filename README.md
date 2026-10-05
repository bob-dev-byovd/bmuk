# Driver exploit pipeline for BYOVD

Windows 커널 드라이버 연구를 소개하는 한국어 정적 웹사이트입니다. 블랙·네오그린 디자인과 가벼운 스크롤 모션을 유지하면서, 요청한 순서로 구성했습니다.

헤더·푸터의 브랜드 이름은 **BMUK**이며, 헤더 로고는 중앙 이미지와 같은 네오그린 4칸 윈도우 모양입니다. 연구 제목의 **BYOVD**와 중앙 이미지의 애니메이션은 그대로 유지합니다.

1. 프로젝트 제목
2. Pipeline Overview — SYS → DrvTriage → 다섯 분류 → 분류별 후속 검토, 도구 내부 3단계와 평가
3. Reports — 제보일 기준 시간순 목록
4. Our Team — 김태우·심준호·안유정·황연우
5. Contact Us

전체 구조도와 도구 내부 구조를 구분했습니다. 위쪽 구조도는 SYS 파일이 DrvTriage를 거쳐 PRIMITIVE·UNCLEARED·CONDITIONAL·UNREADABLE·OUT으로 나뉘고, 각각 다른 후속 검토로 이어지는 흐름입니다. 아래 DrvTriage 영역은 Acquisition → Analysis → Classify의 내부 단계입니다. 분류 이후의 작업까지 도구가 자동 실행한다는 뜻은 아니며, OUT은 현재 범위에서 검토를 종료하되 제외 근거를 남깁니다.

독립된 핵심 아이디어 섹션은 Classify의 설명 영역으로 통합했습니다. 각 단계에 마우스를 올리거나 버튼을 선택하면 설명이 펼쳐집니다. Acquisition에는 수집·추출 방법, Analysis에는 PE Parsing·Disassemble 소개, Classify에는 기존 핵심 아이디어와 다섯 분류를 담았습니다. 연구 배경·구현 설명·참고 문헌도 Classify 안에 보존했으며, 평가 표·해석의 한계는 평가 결과의 펼침 영역에 있습니다.

## 현재 내용과 공개 범위

- 연구 설명과 측정값은 제공된 보고서를 요약한 것입니다. 사이트 제작 과정에서 분석 도구나 VM 실험을 재실행하지 않았습니다.
- 평가 집합은 **3,389건**으로 통일했습니다. 82.1%는 알려진 x64 취약 표본 중 후속 분석 대상으로 남은 비율이며 탐지 정확도가 아닙니다.
- 전체 분석 약 48분과 기존 사실을 재사용한 재분류 약 0.2초는 다른 작업입니다.
- 분류 우선·분류 내부 정렬 설계로 설명을 통일했습니다. UNREADABLE은 재분석 대상이며, OUT은 모든 환경에서 안전하거나 로드가 불가능하다는 뜻이 아닙니다.
- 팀원별 이름 아래에 제공된 역할과 이메일을 표시합니다. 이메일을 선택하면 메일 작성 앱으로 연결되며, 개인 소개·개인 페이지 링크는 비워 두었습니다.
- Reports는 총 12건을 제보일이 오래된 순으로 보여줍니다. 기존 상세 설명·벤더 마스킹·제보일은 유지합니다. 드라이버명·버전·제보처와 원래 벤더명은 공개 데이터에 저장하지 않습니다.
- Reports의 마지막 열은 **상태**이며, 모든 제보를 **PENDING**으로 표시합니다. 제보 상태와 DrvTriage 분류는 별개입니다. 파이프라인의 다섯 분류와 기존 3,389건의 평가 집계는 변경하지 않습니다.
- 하단 Contact Us의 팀 공용 연락처는 입력 전 안내를 유지합니다. 팀원별 이메일은 Our Team에 표시하며, 하단의 연구·협업 제안 문장은 제거했습니다.
- 프로젝트 저장소는 비공개이므로 링크 접근에 권한이 필요합니다. 저장소 권한이나 공개 설정은 변경하지 않았습니다.

현재 프로젝트 저장소는 [DrvTriage](https://github.com/bob-dev-byovd/DrvTriage)입니다. 기존 연구 설계는 당시 static-analyzer의 커밋 4f1ad6ae10956f7833f867696dfc695a627e0460을 참고했습니다. 이번 개편의 상세 설명과 집계는 새로 제공된 보고서를 우선했습니다. 외부 자료는 사이트 내 해당 설명과 참고 문헌에 연결했습니다.

## 실행

Node.js 20 이상에서 별도 패키지 설치 없이 실행합니다.

    npm run dev

http://localhost:5173 에서 확인합니다. 파일을 수정한 뒤 새로고침하세요. 기본 서버는 로컬 컴퓨터에서만 접근 가능합니다.

포트가 사용 중이라면 다른 포트를 지정합니다.

    npm run dev -- --port 5174

## 글자와 정보 수정

대부분의 본문은 **data.js**에서 수정합니다.

| 항목                     | 내용                                   |
| ------------------------ | -------------------------------------- |
| name, title, description | 브랜드, 브라우저 제목, 검색 설명       |
| hero                     | 첫 화면 제목·BOB EXPLOIT DEV·영문 부제 |
| team                     | 팀원의 이름·역할·이메일·소개·링크      |
| overview, idea, classes  | 연구 배경과 다섯 가지 분류·후속 흐름   |
| implementation           | 분석 방법·범위·정렬 기준               |
| tool                     | 도구 이름·설명·3단계 파이프라인        |
| results                  | 보고서 수치와 평가 데이터              |
| limitations              | 결과 해석의 한계                       |
| disclosures              | 가린 벤더명·핵심 취약점·상태·제보일    |
| contact                  | 이메일과 연락 채널                     |
| sources                  | 참고 자료                              |

팀원 정보의 형태:

    {
      name: "김태우",
      role: "PM | Lead",  // 실제 담당 역할
      email: "dlaha171@gmail.com",  // 공개용 이메일, 역할 아래에 표시
      bio: "",   // 짧은 소개, 생략 가능
      link: ""   // HTTP(S) 개인 링크, 생략 가능
    }

제보 정보는 **disclosures**의 **vendor, description, status, reportedAt**에서 수정합니다. vendor에는 첫 글자와 나머지 별표만 저장하세요. 브라우저에서 원래 이름을 감추는 방식이 아니므로, 원래 이름·드라이버명·버전·제보처를 별도 속성이나 주석에 넣지 마세요. status에는 제보 진행 상태를 입력합니다. 현재 12건은 모두 **PENDING**이며, DrvTriage의 분류값을 넣지 않습니다.

reportedAt에는 **2026-09-21**처럼 제보일을 입력하세요. 화면에는 **2026.09.21**로 표시하고 오래된 날짜부터 자동 정렬합니다. 날짜가 같은 항목끼리는 배열에 작성한 순서를 유지합니다. 월과 일은 두 자리로 입력하며, 기존 상세 설명을 짧은 일정 메모로 대체하지 마세요.

contact.email에 실제 이메일을 입력하거나 contact.links 배열에 채널을 추가하면 연락 링크가 표시됩니다.

    { label: "채널 이름", url: "https://..." }

아무 값도 없으면 입력 예정 안내가 유지됩니다. 팀원·제보 정보와 연락처를 채운 뒤에는 index.html의 임시 안내 문구도 함께 확인하세요.

섹션 제목, 메뉴, 팀·제보 소개와 표 아래 해설은 **index.html**, 색상·간격·글자 크기는 **styles.css**에서 수정합니다.

Acquisition과 Analysis의 짧은 설명은 **tool.flow[].notes**에서 수정합니다. Classify의 상세 설명은 **idea, classes, overview, implementation, sources**에 있습니다. tool.flow의 id는 HTML 설명 영역과 연결되므로 제목만 바꿀 때는 그대로 유지하세요.

전체 구조도에서 각 분류 뒤에 이어지는 두 단계는 **classes[].workflow**에서 수정합니다. 박스를 펼쳤을 때의 상세 설명은 **classes[].rationale**, 후속 작업은 **classes[].next**입니다. **tool.name**을 수정하면 구조도의 중심 노드와 내부 파이프라인의 도구 이름에 함께 반영됩니다.

### 평가 수치를 바꿀 때

- results.datasets[].counts는 classes 배열과 같은 순서입니다: PRIMITIVE, UNCLEARED, CONDITIONAL, UNREADABLE, OUT.
- 전체 건수, 분류 비율, 신규 탐색 집합의 세 그룹, VM 비율은 데이터에서 계산합니다.
- 디바이스 생성률의 분모는 전체 대상 수가 아니라 **로드 성공 수**입니다.
- 양성 대조군의 첫 항목은 전체 취약 표본, 두 번째는 x64 하위집합입니다.
- 보고서 수치가 변경되면 index.html의 고정 해설 수치와 회귀 테스트 기준값도 함께 갱신하세요.
- 구체적인 VM 설정과 성능 측정 환경은 제공되지 않아 추정해 넣지 않았습니다.

이 사이트에는 관리자 화면, 개인정보 수집 폼, 백엔드가 없습니다. data.js는 브라우저에 전달되므로 미공개 취약점 세부정보나 비밀 정보를 넣지 마세요. 빈 식별자나 펼침 영역은 접근 제어 수단이 아닙니다.

## 동작과 접근성

- HTML/CSS로 구성한 네오그린 Windows 비주얼: 네 패널의 조립 등장, 부유, 포인터 방향에 따른 3D 기울기와 반사광
- 스크롤에 따른 Windows 패널의 분리·회전·크기 변화와 제목의 레이어별 이동
- 섹션 제목의 마스크 등장, 팀원·제보 행의 순차 등장, 성과 숫자의 순차 공개
- 팀원·도구·제보 영역의 hover 상승·포인터 하이라이트와 링크 반응
- 분류 행의 스크롤 강조선과 도구의 입력→분석→출력 단계별 진행 표시
- Acquisition → Analysis → Classify를 가로로 연결한 번호 노드·화살표, 순차 등장과 스크롤에 따른 연결선 그리기, 왼쪽에서 오른쪽으로 흐르는 빛과 노드 파동
- 전체 구조도의 분기 연결선, 순차 등장·흐르는 빛·DrvTriage 노드 발광과 분류별 hover 강조. 좁은 화면에서는 입력 노드를 위로 배치해 다섯 갈래 흐름을 보존합니다.
- 클래스 박스는 hover 시 높이가 늘어나며 판단 이유와 후속 작업을 보여줍니다. 포인터가 펼쳐진 설명을 포함한 박스 밖으로 나가면 원래 크기로 접힙니다. 모바일 탭·키보드 Enter/Space로 연 설명은 버튼 재선택이나 Esc로 닫으며, 하나씩 열립니다. 모션 끄기와 시스템 모션 줄이기에서는 즉시 펼쳐지고 접힙니다.
- 파이프라인 단계별 hover 설명, 모바일 탭·키보드 Enter/Space 지원. 읽는 중에는 열린 설명을 유지하고, 닫기 버튼·Esc로 닫을 수 있습니다.
- 신규 탐색 집합 비율 막대의 등장 효과
- 현재 섹션 표시와 상단 읽기 진행 표시
- 키보드로 열 수 있는 기본 HTML details와 좌우 스크롤 표
- 첫 화면과 하단의 모션 끄기/켜기, 선택 저장 및 운영체제 모션 줄이기 우선 적용

외부 애니메이션 라이브러리를 쓰지 않습니다. 스크롤·포인터·크기 변경 때만 JavaScript 프레임을 예약합니다. Windows의 부유 효과와 파이프라인의 빛·파동만 CSS로 반복하며 해당 영역이 보이지 않거나 탭이 숨겨지면 일시 정지합니다. 모션을 끄면 부유·호버 이동·스크롤 변형을 중단하고 펼친 내용은 애니메이션 없이 보여줍니다. 단계 설명의 열기·닫기는 그대로 작동합니다. 터치 기기에서는 포인터 기울기를 적용하지 않습니다. 실제 숫자는 바꾸지 않으며 스크롤을 가로채지 않습니다.

Windows 로고의 원래 패널 모양과 애니메이션은 유지합니다. 첫 화면의 컨테이너 경계에서는 자르지 않고, 좁은 데스크톱·태블릿 폭에서는 위치만 안쪽으로 옮겨 회전·분리 시에도 여유를 확보했습니다. BYOVD 위 간격은 제목의 다른 두 줄과 별도로 조정합니다. Pipeline Overview는 한 줄 제목 아래에 소개 문단을 두며, 단계 버튼은 모바일에서도 가로 순서를 유지합니다.

JavaScript를 사용하지 않으면 주요 제목과 설명, 프로젝트 링크는 남으며 동적 목록에 대한 안내가 표시됩니다. 글꼴은 Google Fonts를 이용하고, 연결되지 않으면 시스템 글꼴로 표시합니다.

## 확인과 빌드

    npm test
    npm run build
    npm run preview

npm test는 보고서의 집계·분모·VM 표 일관성과 페이지 순서를 검사합니다. 드라이버를 실행하거나 취약점을 검증하는 테스트가 아닙니다.

빌드는 dist/에 정적 파일을 생성합니다. 미리보기 주소는 http://localhost:4173 입니다. 소스를 바꾼 뒤에는 다시 빌드하세요.

## GitHub Pages 배포

배포 저장소는 [bob-dev-byovd/bmuk](https://github.com/bob-dev-byovd/bmuk)이며, 사이트 주소는 [BMUK](https://bob-dev-byovd.github.io/bmuk/)입니다.

GitHub Pages가 **main에 push할 때마다** 저장소 루트의 정적 파일을 공개 배포합니다. 루트의 `index.html`이 시작 페이지이며, `.nojekyll`로 별도의 Jekyll 변환 없이 HTML·CSS·JavaScript를 그대로 제공합니다. 서버나 패키지 설치는 필요하지 않습니다.

배포 설정은 저장소 **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root)**입니다. 다른 저장소로 옮길 때도 이 설정이 필요합니다. [GitHub 공식 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

수정 후 업로드하는 예시:

    npm test
    npm run build
    git add data.js index.html styles.css app.js
    git commit -m "Update site content"
    git push origin main

변경한 파일만 골라 추가하세요. `dist/`, `node_modules/`, `.env` 파일은 저장소에 올리지 않습니다. 별도 토큰이나 비밀키를 소스에 넣을 필요가 없습니다. 배포 상태는 저장소의 **Actions → pages build and deployment** 또는 **Settings → Pages**에서 확인합니다.

테스트는 자동 배포의 필수 통과 조건이 아니므로 push 전에 `npm test`로 확인하세요. `npm run build`는 로컬 미리보기와 Framer 파일 생성용이며, GitHub Pages는 `dist/`가 아닌 루트 파일을 사용합니다. 루트의 소스·문서·테스트도 공개 대상이므로 비공개 파일을 커밋하지 마세요.

이 사이트와 저장소는 공개됩니다. 팀원 이메일과 Reports도 포함되므로 새 내용을 추가하기 전에 공개 범위를 확인하세요. 연구 도구의 비공개 저장소 링크는 웹사이트 배포 저장소와 별개이며 변경하지 않습니다.

## Framer에서 사용하기

Framer 계정이나 프로젝트가 연결되어 있지 않아 Framer 캔버스에 직접 저장하거나 게시하지 않았습니다. 빌드 시 다음 파일을 함께 만듭니다.

- **dist/framer-embed.html**: CSS, JavaScript, Windows 비주얼을 포함한 단일 HTML 페이지.
- **dist/framer-snippet.html**: 위 페이지를 iframe으로 감싼 Embed용 HTML.

Framer의 Embed에 snippet 파일 내용을 넣거나 호스팅한 페이지의 URL을 연결할 수 있습니다. iframe 안에서 페이지가 스크롤되므로 Embed를 화면 너비·높이에 맞추세요. 현재 Windows 비주얼은 HTML/CSS로 그리므로 별도 이미지 다운로드가 없습니다. [Framer 공식 안내](https://www.framer.com/help/articles/how-to-add-an-iframe-or-embed-script/)를 참고하세요.

이 방식은 Framer 디자인 레이어나 CMS로 자동 변환되지 않습니다. 소스를 수정하고 다시 빌드해 교체해야 합니다. 로컬 HTML 동작과 실제 Framer 프로젝트 내 동작은 별개이므로 게시 전에 Framer에서 다시 확인하세요.

## 파일 구성

    index.html          페이지 구조·섹션 제목·고정 해설
    styles.css          디자인·반응형·모션
    app.js              데이터 표시·집계·접근성·스크롤 효과
    data.js             팀원·연구·평가·제보·연락처
    assets/             기존 메인 비주얼과 출처
    scripts/serve.mjs   로컬 정적 서버
    scripts/build.mjs   빌드·Framer용 HTML 생성
    tests/              보고서 데이터와 구성 회귀 검사
    .nojekyll           GitHub Pages에서 원본 정적 파일 사용
    dist/               자동 생성 빌드 결과

초기 디자인 참고: [우리 오늘부터 0-day?](https://today-0day.framer.website/). 참고 사이트의 이름·이미지·연구 실적은 사용하지 않았습니다. 현재 Windows 비주얼은 네 패널을 코드로 구성한 스타일화된 표현이며, Microsoft의 후원이나 제휴를 나타내지 않습니다. 기존 매듭 이미지는 사용하지 않고 원본만 보관합니다. [비주얼 정보](assets/README.md).
