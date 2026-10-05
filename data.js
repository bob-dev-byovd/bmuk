// 사이트 본문, 팀원, 제보 기록, 연락처를 이 파일에서 수정하세요.
// 공개 데이터입니다. 미공개 취약점 세부정보나 공개가 허용되지 않은 연락처는 넣지 마세요.
// 수치는 제공된 연구보고서 기준이며 실험을 재실행한 결과가 아닙니다.
// results.datasets[].counts는 classes 배열과 같은 순서입니다.
export const siteData = {
  name: "BMUK",
  year: "2026",
  title: "Driver exploit pipeline for BYOVD",
  description:
    "Windows 커널 드라이버의 정적 분석 결과를 다음 검토 작업으로 연결하는 연구. 다섯 가지 분류, 판단 근거와 3,389건의 평가 결과를 소개합니다.",
  repository: "https://github.com/bob-dev-byovd/DrvTriage",
  hero: {
    eyebrow: "BOB EXPLOIT DEV",
    title: "Driver exploit",
    accent: "BYOVD",
    line: "pipeline for",
    subtitle:
      "Windows kernel driver triage and automated classification by follow-up workflow.",
  },
  overview: {
    lead: "서명은 출처와 무결성의 근거이지, 취약점이 없다는 보증은 아닙니다.",
    paragraphs: [
      {
        text: "랜섬웨어 공격에서는 암호화에 앞서 보안 제품을 무력화하는 EDR Killer가 사용되기도 합니다. 취약한 정상 서명 드라이버를 악용하는 BYOVD는 그 방법 중 하나입니다. ESET이 2026년 3월 발표한 약 90종의 도구 조사에서는 54종이 BYOVD를 사용했습니다.",
        sources: ["eset"],
      },
      {
        text: "하지만 위험한 기능을 찾는 것만으로는 검토 대상을 정하기 어렵습니다. 드라이버가 로드될 조건, 통신 대상의 생성, 호출자의 접근 권한, 요청 처리 경로는 각각 다른 근거로 확인해야 합니다.",
        sources: ["signing"],
      },
      {
        text: "이 연구는 이 조건들을 하나의 위험도 점수로 합치지 않고, 확인한 사실과 남은 질문을 분리해 드라이버별 검토 목록을 만드는 데 집중합니다.",
        sources: [],
      },
    ],
    question:
      "“위험한 기능이 있는가”에서 한 걸음 더.\n“무엇이 확인됐고, 무엇을 더 확인해야 하는가?”",
    scope:
      "평가 전제 · 주 평가 환경은 x64 Windows입니다. 관리자 권한 확보 이후의 위협 상황을 가정하되, 드라이버 로드 조건과 비특권 사용자 모드의 접근 조건은 별도로 검토합니다.",
  },
  idea: {
    title: "후속 작업에 따른 분류 기준",
    description:
      "드라이버 분석 결과가 산출하는 것은 구조적 사실의 집합이며, 이를 분석가 혹은 후속 작업이 처리할 수 있는 형태로 정리하는 것이 분류의 목적이다. 따라서 무엇을 기준으로 나눌 것인가가 먼저 결정되어야 한다.",
    caution:
      "분류는 취약점 판정이 아니라 검토의 출발점입니다. 미확인은 안전함이 아니며, 정적 경로가 있다고 실제 입력의 영향까지 입증된 것은 아닙니다.",
  },
  classes: [
    {
      id: "PRIMITIVE",
      title: "위험 기능 후보에 연결된 경로",
      description:
        "복원된 요청 처리 경로에서 위험 기능 후보로의 연결을 확인했습니다.",
      next: "경로와 입력 영향 정밀 검토",
      workflow: ["경로 정밀 검토", "입력 영향 확인"],
      rationale:
        "유저 모드의 요청 처리 경로가 위험 기능 후보로 이어지는 경우입니다. 도달 여부와 도달했을 때의 영향을 나누어 살피며, 실제 입력의 영향과 취약점 성립 여부는 후속 정밀 검토에서 확인합니다.",
    },
    {
      id: "UNCLEARED",
      title: "통신 표면은 확인, 위험은 미확정",
      description:
        "통신 단서는 있지만 위험 기능 후보로 이어지는 경로를 확인하지 못했습니다.",
      next: "요청 처리 코드 추가 검토",
      workflow: ["요청 처리 검토", "추가 분석"],
      rationale:
        "통신 표면은 확인했지만 위험 기능 후보로 이어지는 경로는 확인하지 못한 경우입니다. 안전하다는 뜻은 아닙니다. 요청 처리 코드의 수동 검토나 Fuzzing 등으로 메모리 관련 결함과 미복원 경로를 추가 검토합니다.",
    },
    {
      id: "CONDITIONAL",
      title: "접근 전에 확인할 전제조건",
      description:
        "장치 인스턴스나 설치 구성, 하위 드라이버 스택을 확인해야 합니다.",
      next: "배포 패키지·설치 환경 확인",
      workflow: ["설치 조건 확인", "접근 조건 검토"],
      rationale:
        "통신 표면의 단서가 있어도 장치 인스턴스, 설치 구성이나 하위 드라이버 스택 같은 접근 전제가 해결되지 않은 경우입니다. 위험 기능의 존재만으로 우선순위를 정하지 않고, 배포 환경과 진입 조건부터 확인합니다.",
    },
    {
      id: "UNREADABLE",
      title: "구조를 충분히 읽지 못한 상태",
      description: "분석에 필요한 구조나 경로를 충분히 복원하지 못했습니다.",
      next: "판독 실패 원인 보완·재분석",
      workflow: ["판독 원인 보완", "재분석"],
      rationale:
        "난독화·패킹, 지원하지 않는 구조 또는 함수·경로 복원 실패 등으로 판단에 필요한 근거를 충분히 읽지 못한 경우입니다. 대상을 안전하다고 배제하지 않고, 실패 원인에 따라 분석기를 개선하거나 수동 분석 후 재분석합니다.",
    },
    {
      id: "OUT",
      title: "현재 평가 범위의 제외 대상",
      description:
        "아키텍처, 정책 또는 확인된 통신 표면 부재 등 제외 근거를 보존합니다.",
      next: "제외 사유 보존",
      workflow: ["제외 근거 보존", "현재 검토 종료"],
      rationale:
        "아키텍처, 서명·차단 조건 또는 확인된 통신 표면 부재 등 현재 평가 범위에서 제외할 근거가 있는 경우입니다. 판독 실패와 구분해 제외 사유를 보존하고 현재 검토를 종료합니다. 모든 환경에서 안전하다는 의미는 아닙니다.",
    },
  ],
  implementation: {
    intro:
      "산출물은 파일 또는 디렉터리를 입력받는 Python CLI입니다. 분류 이름만 보여주지 않고, 판단 근거와 미확정 정보, 후속 검토 목록을 함께 남깁니다.",
    stages: [
      {
        title: "구조와 통신 경로 복원",
        text: "pefile로 PE 구조와 아키텍처를 확인하고, Capstone으로 코드를 해석합니다. WDM 요청 디스패치, KMDF I/O 큐 콜백, 미니필터 통신 포트 등 지원하는 구조에서 요청 처리 경로를 복원합니다.",
      },
      {
        title: "기능 후보와 실행 조건 분리",
        text: "커널 API와 명령어 수준의 기능 후보를 복원된 경로와 함께 검토합니다. 서명 검증, 대상 시스템의 정책, 취약 드라이버 차단목록은 별도의 증거로 기록하고 장치·설치 의존성도 구분합니다.",
      },
      {
        title: "근거를 저장하고 분류 규칙 적용",
        text: "추출한 구조적 사실을 데이터베이스에 보존한 뒤 분류합니다. 사실 추출과 분류 규칙을 분리해, 기준이 바뀌어도 기존 결과로 다시 판단할 수 있습니다. 핵심 파이프라인은 규칙 기반이며 LLM 호출이 필요하지 않습니다.",
      },
    ],
    ranking:
      "PRIMITIVE는 기능 후보의 영향 범위와 경로의 확실성을, CONDITIONAL은 조건 확인 후 검토할 가치와 통신 표면을, UNCLEARED는 확인된 입력 표면을 참고합니다. UNREADABLE은 공통 실패 원인을 해결했을 때 재분석할 수 있는 대상 수를 기준으로 정렬합니다. 서로 다른 분류를 하나의 합산 점수로 비교하지 않습니다.",
    notes: [
      {
        title: "지원 범위와 판독 한계",
        text: "WDM·KMDF·미니필터의 구조를 분석 대상으로 삼되 모든 구현을 복원한다고 보장하지 않습니다. x86은 주 평가 환경인 x64 Windows의 범위 밖으로 구분하고, ARM64는 현재 명령어 해석 미지원 사유를 남겨 재분석 대상으로 유지합니다.",
      },
      {
        title: "서명 증거와 환경 정보",
        text: "임베디드 서명이 없다고 배포 패키지 전체를 미서명으로 단정하지 않습니다. CAT 파일 등 추가 증거가 없거나 Windows 정책·설정이 알려지지 않은 경우, 확인 가능한 범위와 정책 의존 상태를 남깁니다.",
        sources: ["signing", "policy"],
      },
      {
        title: "관련 연구와의 연결",
        text: "DriverBuddy와 IOCTLance는 드라이버 구조와 위험 기능을 검토하는 관련 도구입니다. 이 연구는 정적 분석으로 얻은 사실에 로드·설치 조건과 판독 한계를 더해, 서로 다른 후속 작업을 구분하는 데 초점을 둡니다.",
        sources: ["driverbuddy", "ioctlance"],
      },
    ],
    stack: "PYTHON CLI  /  PEFILE + CAPSTONE  /  DATABASE  /  UNIT TESTS",
  },
  results: {
    intro:
      "DrvTriage가 분석 근거에 따라 다섯 가지로 분류하고, 각 분류에 맞는 후속 작업을 안내합니다.",
    selectionDescription:
      "Microsoft Update Catalog와 벤더 배포본을 분류해, 우선 검토할 대상과 분석기 개선 후 다시 볼 대상을 나눴습니다. 이 수치는 새로 발견한 취약점의 수가 아닙니다.",
    provenance:
      "수치 출처: 제공된 연구보고서. 이 페이지 제작 과정에서 분석·VM 실험을 재실행하지 않았습니다. 성능과 로드 결과는 실험 환경에 의존하며, 상세 환경 정보는 제공 자료에 포함되지 않았습니다.",
    analysisMinutes: 48,
    reclassificationSeconds: 0.2,
    datasets: [
      {
        name: "LOLDrivers",
        exploration: false,
        counts: [969, 42, 32, 211, 737],
      },
      {
        name: "Microsoft Update Catalog",
        exploration: true,
        counts: [0, 33, 142, 487, 450],
      },
      {
        name: "소프트웨어 벤더 배포본",
        exploration: true,
        counts: [71, 9, 7, 59, 140],
      },
    ],
    positiveControl: [
      {
        label: "취약 라벨 전체",
        total: 1684,
        retained: 1037,
      },
      {
        label: "그중 x64 하위집합",
        total: 1256,
        retained: 1031,
      },
    ],
    vm: [
      {
        class: "PRIMITIVE",
        total: 71,
        loaded: 63,
        devices: 58,
      },
      {
        class: "UNCLEARED",
        total: 42,
        loaded: 39,
        devices: 28,
      },
      {
        class: "CONDITIONAL",
        total: 149,
        loaded: 145,
        devices: 0,
      },
      {
        class: "UNREADABLE",
        total: 546,
        loaded: 409,
        devices: 138,
      },
      {
        class: "OUT",
        total: 590,
        loaded: 48,
        devices: 23,
      },
    ],
  },
  limitations: [
    {
      title: "정적 경로는 취약점의 증명이 아닙니다.",
      text: "복원된 그래프의 연결은 실제로 실행 가능한 입력이나 비특권 호출자의 접근을 보장하지 않습니다. 분류 결과를 취약점 확정이나 악용 가능성의 증거로 읽지 않습니다.",
    },
    {
      title: "로드 여부는 파일만으로 결정되지 않습니다.",
      text: "서명 방식, Windows 정책, 차단목록과 설치 구성은 함께 작용합니다. SYS 단일 파일로 확인할 수 없는 조건은 미확정으로 남기며, 특정 VM의 관측을 다른 환경에 일반화하지 않습니다.",
    },
    {
      title: "읽지 못한 대상도 연구의 일부입니다.",
      text: "UNREADABLE은 재분석 목록이며, UNCLEARED는 안전 판정이 아닙니다. 미복원 경로와 지원하지 않는 구조를 구분해 기록하고, 분석기 개선과 수동 검토로 이어갑니다.",
    },
  ],
  closing:
    "이 연구의 성과는 하나의 점수가 아니라, 근거와 다음 작업이 함께 남는 검토 목록입니다.",
  sources: [
    {
      id: "project",
      label: "프로젝트 저장소",
      shortLabel: "프로젝트",
      url: "https://github.com/bob-dev-byovd/DrvTriage",
      note: "bob-dev-byovd/DrvTriage · 비공개 저장소, 접근 권한 필요",
    },
    {
      id: "eset",
      label: "ESET · What are EDR killers?",
      shortLabel: "ESET 연구",
      url: "https://www.eset.com/blog/en/business-topics/threat-landscape/what-are-edr-killers/",
      note: "EDR Killer와 BYOVD의 관계, 2026년 3월 조사 집계",
    },
    {
      id: "signing",
      label: "Microsoft · Digital Signatures",
      shortLabel: "Microsoft 서명 문서",
      url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/install/digital-signatures",
      note: "디지털 서명의 출처·무결성 검증과 임베디드·카탈로그 서명",
    },
    {
      id: "policy",
      label: "Microsoft · Driver Signing Policy",
      shortLabel: "Microsoft 정책 문서",
      url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/install/kernel-mode-code-signing-policy--windows-vista-and-later-",
      note: "Windows 드라이버 서명 정책 · 실제 판정에는 대상 버전과 현행 정책 확인 필요",
    },
    {
      id: "driverbuddy",
      label: "NCC Group · DriverBuddy",
      shortLabel: "DriverBuddy",
      url: "https://github.com/nccgroup/DriverBuddy",
      note: "Windows 드라이버 역공학을 지원하는 관련 정적 분석 도구",
    },
    {
      id: "ioctlance",
      label: "IOCTLance",
      shortLabel: "IOCTLance",
      url: "https://github.com/zeze-zeze/ioctlance",
      note: "Windows 드라이버의 위험 동작을 분석하는 관련 연구",
    },
  ],
  team: [
    {
      name: "김태우",
      role: "PM | Lead",
      email: "dlaha171@gmail.com",
      bio: "",
      link: "",
    },
    {
      name: "심준호",
      role: "STRATEGY | Threat Intel",
      email: "lucas0712@naver.com",
      bio: "",
      link: "",
    },
    {
      name: "안유정",
      role: "TECH | Reversing",
      email: "yujeong_0720@naver.com",
      bio: "",
      link: "",
    },
    {
      name: "황연우",
      role: "TECH | Pwnable",
      email: "yeonwoo040323@gmail.com",
      bio: "",
      link: "",
    },
  ],
  tool: {
    name: "DrvTriage",
    eyebrow: "INSIDE THE TOOL / PYTHON CLI",
    description:
      "파일 또는 디렉터리를 입력하면 드라이버의 구조와 조건을 분석하고, 분류별 검토 목록을 만듭니다. 판단 근거는 데이터베이스에 남겨 분류 규칙을 다시 적용할 수 있습니다.",
    flow: [
      {
        id: "acquisition",
        title: "Acquisition",
        label: "수집 · 추출",
        notes: [
          {
            title: "Collection",
            text: "Microsoft Update Catalog, WinGet 데이터베이스와 소프트웨어 벤더 배포본에서 드라이버를 수집합니다. LOLDrivers 표본은 알려진 사례를 점검하는 비교 집합으로 구분합니다.",
          },
          {
            title: "Extraction",
            text: "배포 패키지와 설치 파일에서 SYS 파일을 추출해 분석 입력으로 정리합니다. 수집원 정보를 보존하고, 파일 또는 디렉터리 단위로 분석기에 전달합니다.",
          },
        ],
      },
      {
        id: "analysis",
        title: "Analysis",
        label: "PE Parsing · Disassemble",
        notes: [
          {
            title: "PE Parsing",
            text: "pefile로 PE 헤더, 아키텍처와 임포트를 읽어 드라이버의 구조를 확인합니다. 정적으로 확인할 수 있는 제외 근거와 추가 분석이 필요한 단서를 구분합니다.",
          },
          {
            title: "Disassemble",
            text: "Capstone으로 명령어를 해석하고 함수·호출 관계와 요청 처리 경로를 복원합니다. WDM·KMDF·미니필터의 구조를 살피며, 복원하지 못한 경로는 판독 한계로 기록합니다.",
          },
        ],
      },
      {
        id: "classify",
        title: "Classify",
        label: "분류 · 근거 · 후속 작업",
      },
    ],
  },
  disclosures: [
    // 벤더명은 이미 가린 값만 저장합니다. 식별 정보는 공개 소스에 넣지 않습니다.
    // status는 제보 진행 상태입니다. 현재 모든 제보는 PENDING으로 표시합니다.
    // reportedAt은 제보일이며 YYYY-MM-DD 형식으로 기록합니다.
    {
      vendor: "D***",
      description:
        "객체 타입 혼동(Object Type Confusion) 의심으로 인한 Kernel DoS",
      status: "PENDING",
      reportedAt: "2026-09-05",
    },
    {
      vendor: "B**************",
      description:
        "필터 통신 포트 요청의 권한·대상 검증 미흡으로 임의 프로세스 및 PPL 종료",
      status: "PENDING",
      reportedAt: "2026-09-08",
    },
    {
      vendor: "H******",
      description:
        "물리 주소 검증 없는 읽기·쓰기 IOCTL로 임의 물리 메모리 접근 및 SYSTEM 권한 상승",
      status: "PENDING",
      reportedAt: "2026-09-15",
    },
    {
      vendor: "O**********************",
      description:
        "FILE_ANY_ACCESS IOCTL로 임의 물리 메모리를 쓰기 가능하게 매핑하여 SYSTEM 권한 상승",
      status: "PENDING",
      reportedAt: "2026-09-19",
    },
    {
      vendor: "S************",
      description:
        "프로세스 종료 IOCTL의 인가 누락으로 일반 사용자가 PPL·Defender 프로세스 종료 가능",
      status: "PENDING",
      reportedAt: "2026-09-20",
    },
    {
      vendor: "N************************",
      description:
        "operation 인덱스 미검증과 사용자 객체 포인터 신뢰로 커널 주소 노출·임의 커널 호출 및 SYSTEM 권한 상승",
      status: "PENDING",
      reportedAt: "2026-09-21",
    },
    {
      vendor: "I**************************",
      description:
        "사용자 callback/context를 신뢰해 커널 주소 노출·임의 커널 읽기/쓰기 및 SYSTEM 권한 상승",
      status: "PENDING",
      reportedAt: "2026-09-22",
    },
    {
      vendor: "A*****",
      description: "임의 드라이버의 IOCTL dispatch callback 비활성화",
      status: "PENDING",
      reportedAt: "2026-10-02",
    },
    {
      vendor: "n*******",
      description: "포인터 역참조로 인한 Kernel DoS",
      status: "PENDING",
      reportedAt: "2026-10-02",
    },
    {
      vendor: "C*******",
      description: "PCI 설정 오용으로 인한 Kernel DoS",
      status: "PENDING",
      reportedAt: "2026-10-03",
    },
    {
      vendor: "C**************************",
      description:
        "파일 시스템 콜백 인가 누락으로 비특권 사용자의 SYSTEM 프로세스 I/O 무력화",
      status: "PENDING",
      reportedAt: "2026-10-04",
    },
    {
      vendor: "K*****",
      description: "임의 커널 읽기/쓰기 및 권한 상승",
      status: "PENDING",
      reportedAt: "2026-10-05",
    },
  ],
  contact: {
    email: "",
    links: [],
    emptyMessage: "이메일과 팀 연락 채널은 입력 예정입니다.",
  },
};
