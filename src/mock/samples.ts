import { UserProfile, JobPosting } from '../types';

export const SAMPLE_PROFILES: UserProfile[] = [
  {
    id: 'sample-profile-1',
    name: '이준혁',
    targetJob: 'C++ / C# 제어 및 스마트팩토리 소프트웨어 엔지니어',
    education: {
      school: '한국공학대학교',
      degree: '학사',
      major: '기계제어공학 / 컴퓨터공학 복수전공',
      gpa: '3.85 / 4.5',
      status: '졸업',
    },
    skills: [
      { id: 's1', name: 'C++', category: 'language', level: '고급', experienceMonths: 36 },
      { id: 's2', name: 'C#', category: 'language', level: '중급', experienceMonths: 24 },
      { id: 's3', name: 'Python', category: 'language', level: '중급', experienceMonths: 18 },
      { id: 's4', name: 'Linux', category: 'infra', level: '중급', experienceMonths: 20 },
      { id: 's5', name: 'Git', category: 'tools', level: '중급', experienceMonths: 30 },
      { id: 's6', name: 'SQL (SQLite)', category: 'database', level: '초급', experienceMonths: 12 },
      { id: 's7', name: 'TCP/IP Socket', category: 'domain', level: '중급', experienceMonths: 18 },
    ],
    projects: [
      {
        id: 'p1',
        title: '산업용 4축 모션 제어 및 실시간 상태 모니터링 시스템',
        role: 'C++ 코어 알고리즘 및 통신 엔진 구현 (기여도 70%)',
        duration: '2025.03 ~ 2025.09 (6개월)',
        techStack: ['C++', 'Qt', 'TCP/IP', 'SQLite', 'Multithreading'],
        description: '공장 자동화 라인의 다축 모터 제어를 위한 실시간 패킷 송수신 프로그램 및 시각화 GUI 개발.',
        keyAchievements: [
          'Ring Buffer 구조 적용으로 통신 지연시간 15ms -> 2ms로 대폭 단축',
          '멀티스레드 기반 비동기 큐 설계로 센서 데이터 유실률 0% 달성',
          'Qt를 활용하여 초당 60fps 센서 궤적 실시간 렌더링 대시보드 구축',
        ],
      },
      {
        id: 'p2',
        title: 'C# .NET WPF 기반 장비 진단 및 로그 분석기',
        role: '클라이언트 UI 설계 및 데이터 파서 모듈 개발',
        duration: '2025.10 ~ 2025.12 (3개월)',
        techStack: ['C#', '.NET', 'WPF', 'MVVM Pattern'],
        description: '제조 장비에서 출력되는 대용량 바이너리/텍스트 로그를 실시간으로 파싱하여 에러율을 진단하는 툴 개발.',
        keyAchievements: [
          '대용량 500MB 로그 파일 메모리 맵 기반 처리로 로딩 속도 4배 향상',
          'MVVM 디자인 패턴을 철저히 적용하여 유지보수성 및 단위 테스트 커버리지 80% 확보',
        ],
      },
    ],
    careers: [
      {
        id: 'c1',
        company: '(주)스마트모션텍',
        role: 'SW 연구개발팀 인턴',
        period: '2025.07 ~ 2025.09 (3개월)',
        type: '인턴',
        description: '반도체 이송 모듈 제어 소프트웨어 유지보수 및 회귀 테스트 자동화 스크립트 작성',
      },
    ],
    certificates: [
      { id: 'cert1', name: '정보처리기사', issuer: '한국산업인력공단', date: '2025.06' },
      { id: 'cert2', name: 'TOEIC', issuer: 'ETS', date: '2025.08', score: '840점' },
    ],
    activities: [
      {
        id: 'act1',
        title: '전국 스마트팩토리 창의설계 경진대회',
        category: '수상',
        period: '2025.11',
        description: '최우수상 (한국기계산업진흥회장상) 수상 - PLC 연동 모터제어 알고리즘 부문',
      },
    ],
    freeIntro:
      '메모리 관리와 멀티스레딩 최적화에 강점을 가진 C++/C# 소프트웨어 엔지니어입니다. 실시간 통신 지연 최소화와 고신뢰성 제어 로직 구현에 깊은 흥미를 느끼며, 하드웨어와 소프트웨어가 유기적으로 만나는 스마트팩토리/임베디드 제어 분야에서 최고의 전문성을 쌓고자 합니다.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-profile-2',
    name: '김서연',
    targetJob: '백엔드 / 클라우드 인프라 개발자',
    education: {
      school: '성균관대학교',
      degree: '학사',
      major: '소프트웨어학과',
      gpa: '4.02 / 4.5',
      status: '졸업예정',
    },
    skills: [
      { id: 's21', name: 'Java', category: 'language', level: '고급', experienceMonths: 30 },
      { id: 's22', name: 'Spring Boot', category: 'framework', level: '중급', experienceMonths: 24 },
      { id: 's23', name: 'MySQL', category: 'database', level: '중급', experienceMonths: 20 },
      { id: 's24', name: 'Redis', category: 'database', level: '중급', experienceMonths: 14 },
      { id: 's25', name: 'Docker', category: 'infra', level: '중급', experienceMonths: 16 },
      { id: 's26', name: 'AWS (EC2/S3/RDS)', category: 'infra', level: '초급', experienceMonths: 12 },
      { id: 's27', name: 'Git', category: 'tools', level: '고급', experienceMonths: 36 },
    ],
    projects: [
      {
        id: 'p21',
        title: '대규모 티켓팅 동시성 제어 및 주문 처리 분산 서버',
        role: '백엔드 아키텍처 설계 및 결제 파이프라인 개발 (팀장)',
        duration: '2025.04 ~ 2025.08 (5개월)',
        techStack: ['Java', 'Spring Boot', 'Redis', 'MySQL', 'Docker', 'AWS'],
        description: '순간 트래픽 집중 환경에서 좌석 중복 예매를 방지하는 락(Distributed Lock) 기반 예매 시스템.',
        keyAchievements: [
          'Redisson 분산 락 도입으로 1,000 TPS 동시 요청 환경에서 좌석 중복 결제 0건 검증',
          'Redis 캐시 레이어 설계로 읽기 쿼리 DB 부하 65% 감소',
          'JMeter 부하 테스트를 통한 병목 구간 식별 및 커넥션 풀 튜닝',
        ],
      },
      {
        id: 'p22',
        title: '피트니스 기록 및 실시간 랭킹 커뮤니티 API',
        role: 'RESTful API 서버 구축 및 CI/CD 파이프라인 자동화',
        duration: '2025.09 ~ 2025.11 (3개월)',
        techStack: ['Java', 'Spring Data JPA', 'MySQL', 'GitHub Actions', 'Docker'],
        description: '유저 운동 기록 추적 및 주간 랭킹 산출 백엔드 서비스.',
        keyAchievements: [
          'Spring Batch와 스케줄러를 활용한 자정 집계 쿼리 최적화',
          'GitHub Actions를 통한 자동 테스트 및 AWS EC2 무중단 배포 파이프라인 구축',
        ],
      },
    ],
    careers: [],
    certificates: [
      { id: 'cert21', name: 'SQLD (SQL개발자)', issuer: '한국데이터산업진흥원', date: '2025.04' },
      { id: 'cert22', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025.09' },
    ],
    activities: [
      {
        id: 'act21',
        title: '우아한테크코스 백엔드 프리코스',
        category: '부트캠프',
        period: '2025.10 ~ 2025.11',
        description: '클린 코드, 객체지향 원칙(SOLID), 단위 테스트(JUnit5) 중심의 집중 미션 완주',
      },
    ],
    freeIntro:
      '안정적인 대용량 트래픽 처리와 무결한 비즈니스 로직 설계를 지향하는 백엔드 개발자입니다. 분산 락, 캐싱 전략, 쿼리 튜닝에 깊은 관심을 가지고 실증적인 부하 테스트를 통해 신뢰성 높은 서비스를 구축합니다.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-profile-3',
    name: '박민우',
    targetJob: '프론트엔드 / 웹 애플리케이션 개발자',
    education: {
      school: '건국대학교',
      degree: '학사',
      major: '소프트웨어학과',
      gpa: '3.91 / 4.5',
      status: '졸업',
    },
    skills: [
      { id: 's31', name: 'TypeScript', category: 'language', level: '고급', experienceMonths: 30 },
      { id: 's32', name: 'React', category: 'framework', level: '고급', experienceMonths: 36 },
      { id: 's33', name: 'Next.js', category: 'framework', level: '중급', experienceMonths: 18 },
      { id: 's34', name: 'Tailwind CSS', category: 'framework', level: '고급', experienceMonths: 24 },
      { id: 's35', name: 'Zustand / Redux', category: 'tools', level: '중급', experienceMonths: 24 },
      { id: 's36', name: 'HTML5 / CSS3', category: 'language', level: '고급', experienceMonths: 40 },
    ],
    projects: [
      {
        id: 'p31',
        title: '실시간 협업 웹 캔버스 & 다이어그램 도구 (FlowCraft)',
        role: '프론트엔드 총괄 아키텍처 및 렌더링 최적화',
        duration: '2025.02 ~ 2025.07 (6개월)',
        techStack: ['React', 'TypeScript', 'Canvas API', 'Tailwind CSS', 'WebSockets'],
        description: '팀원들이 웹 상에서 실시간으로 플로우차트를 공동 편집할 수 있는 SaaS 솔루션.',
        keyAchievements: [
          '가상화(Virtualization) 기법으로 5,000개 노드 렌더링 시 60fps 유지',
          'Lighthouse 웹 바이탈 Performance 점수 96점 달성',
          '디자인 시스템 컴포넌트 30종 모듈화로 개발 속도 50% 단축',
        ],
      },
    ],
    careers: [
      {
        id: 'c31',
        company: '(주)스타트업랩',
        role: '프론트엔드 인턴',
        period: '2025.08 ~ 2025.11 (4개월)',
        type: '인턴',
        description: 'B2B 대시보드 컴포넌트 개발 및 웹 접근성 표준 준수 작업',
      },
    ],
    certificates: [
      { id: 'cert31', name: '정보처리기사', issuer: '한국산업인력공단', date: '2025.06' },
    ],
    activities: [],
    freeIntro:
      '사용자 경험(UX)과 성능 최적화에 진심인 프론트엔드 개발자입니다. 복잡한 상태 관리와 대규모 렌더링 환경에서도 매끄러운 60fps 인터랙션을 제공하는 인터페이스를 구현합니다.',
    updatedAt: new Date().toISOString(),
  },
];

export const SAMPLE_JOB_POSTINGS: JobPosting[] = [
  {
    id: 'job-sample-1',
    company: '현대자동차 / 모빌리티 솔루션스',
    role: '스마트팩토리 제어 소프트웨어 C++/C# 개발자 (신입/경력)',
    experienceRequirement: '신입 또는 관련 경력 3년 이하',
    educationRequirement: '학사 이상 (컴퓨터공학, 제어계측, 전자공학 등 유관 전공)',
    responsibilities: [
      '스마트 제조 라인 및 물류 자동화 설비 제어 소프트웨어 설계 및 개발',
      '설비-상위 시스템(MES/SCADA) 간 실시간 통신 프로토콜 구현 및 데이터 수집',
      'C++/C# 기반 고신뢰성 제어 로직 개발 및 멀티스레드 성능 최적화',
      '현장 설비 셋업 시운전 및 이상 징후 트러블슈팅',
    ],
    mandatorySkills: [
      'C++ 또는 C# 프로그래밍 언어에 대한 깊은 이해 및 객체지향 설계 역량',
      '멀티스레딩 환경 동기화 및 메모리 관리 지식',
      '자료구조, 알고리즘 및 TCP/IP 소켓 통신 기본기',
      'Git을 활용한 코드 버전 관리 및 협업 역량',
    ],
    preferredSkills: [
      '산업용 통신 프로토콜(Modbus, EtherCAT, OPC-UA 등) 개발 및 연동 경험',
      'PLC(Melsec, Siemens 등) 및 모션 컨트롤러 제어 프로젝트 경험',
      'Qt 또는 WPF 기반 데스크톱 GUI 개발 경험',
      'SQLite 등 경량 데이터베이스 연동 및 대용량 실시간 로깅 경험',
    ],
    rawText: `[현대자동차 / 모빌리티] 스마트팩토리 제어 소프트웨어 C++/C# 개발자 모집

■ 담당 업무
- 차세대 스마트팩토리 생산 설비 실시간 제어 소프트웨어 개발
- 공정 장비 및 다축 모션 제어 알고리즘 구현
- MES/SCADA와 연동하는 실시간 산업용 네트워크 통신 모듈 구축
- 장비 상태 진단 및 로그 수집 GUI 프로그램 개발

■ 지원 자격 (필수)
- 학사 이상 (컴퓨터공학, 제어계측, 전자공학 등)
- C++ 또는 C# 중 최소 1개 이상 언어 숙련자
- 멀티스레딩, 자료구조, TCP/IP 소켓 프로그래밍 이해

■ 우대 사항
- PLC 및 산업용 통신(Modbus, EtherCAT, OPC-UA) 프로젝트 경험자
- Qt, WPF 등 UI 프레임워크 경험자
- 모션 제어 라이브러리 및 실시간 OS(RTOS/Linux) 환경 경험자`,
    summary: '차세대 스마트팩토리 공정 제어 및 실시간 통신 시스템을 구축하는 C++/C# 엔지니어 포지션입니다.',
  },
  {
    id: 'job-sample-2',
    company: '네이버클라우드 (NAVER Cloud)',
    role: '클라우드 플랫폼 백엔드 분산 시스템 엔지니어',
    experienceRequirement: '신입 또는 1~3년차 주니어',
    educationRequirement: '학사 이상 (전공 무관, CS 기본 지식 보유자)',
    responsibilities: [
      '네이버 클라우드 글로벌 플랫폼의 대규모 트래픽 분산 백엔드 API 설계 및 개발',
      '안정적인 데이터 저장소(RDBMS, NoSQL, Cache) 아키텍처 수립 및 쿼리 최적화',
      '클라우드 리소스 오케스트레이션 및 이벤트 기반 비동기 메시지 파이프라인 구축',
      '장애 대응 및 실시간 모니터링 메트릭 기반 성능 튜닝',
    ],
    mandatorySkills: [
      'Java 또는 Kotlin 기반의 서버 애플리케이션 개발 역량 (Spring Boot)',
      '관계형 데이터베이스(MySQL, PostgreSQL) 모델링 및 트랜잭션 격리수준 이해',
      'RESTful API 설계 표준 및 HTTP 프로토콜에 대한 명확한 이해',
      '분산 환경에서의 동시성 제어 및 동기/비동기 처리 개념',
    ],
    preferredSkills: [
      'Redis 등 인메모리 캐시를 활용한 대규모 트래픽 분산 처리 경험',
      'Docker 및 컨테이너 오케스트레이션(Kubernetes) 환경 경험',
      'Kafka, RabbitMQ 등 메시지 브로커를 활용한 이벤트 기반 아키텍처 구축 경험',
      'AWS, GCP, NCP 등 퍼블릭 클라우드 인프라 활용 및 자동화 배포 파이프라인 경험',
    ],
    rawText: `[네이버클라우드] 클라우드 플랫폼 백엔드 분산 시스템 엔지니어 채용

■ 주요 업무
- 네이버클라우드 코어 서비스 백엔드 API 및 분산 플랫폼 개발
- 대규모 트래픽 처리 및 무중단 고가용성 아키텍처 설계
- 마이크로서비스 간 통신 최적화 및 비동기 이벤트 스트림 구축

■ 지원 자격
- Java 또는 Kotlin 기반 객체지향 설계 및 개발 역량
- Spring Boot 프레임워크 실무 또는 심도 깊은 프로젝트 경험
- RDBMS(MySQL) 기본 지식 및 SQL 튜닝 이해
- 동시성 이슈 및 분산 락, 멀티스레드 처리에 대한 이해

■ 우대 사항
- Redis, Kafka 등 분산 인프라 컴포넌트 실전 적용 경험
- Docker/Kubernetes 기반 서비스 운영 경험
- 클라우드 네이티브 아키텍처(MSA) 구축 경험
- SQLD 또는 AWS/Cloud 관련 자격증 보유자`,
    summary: '초대형 트래픽을 처리하는 글로벌 클라우드 코어 플랫폼 백엔드 분산 시스템 개발 포지션입니다.',
  },
  {
    id: 'job-sample-3',
    company: '토스 (Viva Republica)',
    role: 'Frontend Developer (금융 플랫폼 코어 서비스)',
    experienceRequirement: '신입 / 경력 무관',
    educationRequirement: '학력 무관 (실무 개발 역량 중심 평가)',
    responsibilities: [
      '2,000만 사용자가 매일 사용하는 토스 웹 서비스 및 앱 내 웹뷰 프론트엔드 개발',
      '복잡한 금융 데이터와 비동기 상태를 매끄럽게 처리하는 인터페이스 구축',
      '웹 바이탈(Core Web Vitals) 성능 지표 분석 및 브라우저 렌더링 최적화',
      '사내 디자인 시스템 및 공통 라이브러리 고도화 기여',
    ],
    mandatorySkills: [
      'TypeScript와 React에 대한 깊이 있는 원리 이해 및 실무 역량',
      '브라우저 렌더링 메커니즘과 프레임 드랍(Layout Thrashing) 방지 최적화 지식',
      '웹 표준, 반응형 웹, 웹 접근성에 대한 올바른 구현 경험',
      '컴포넌트 단위 테스트 및 클린 코드 작성 역량',
    ],
    preferredSkills: [
      'Next.js 등 SSR/SSG 환경에서의 성능 및 SEO 최적화 경험',
      '캔버스(Canvas API) 또는 복잡한 인터랙티브 데이터 시각화 라이브러리 사용 경험',
      '사내 오픈소스 디자인 시스템 구축 또는 컴포넌트 라이브러리 배포 경험',
      '모바일 웹뷰 환경에서의 하이브리드 통신 및 브릿지 연동 경험',
    ],
    rawText: `[토스] Frontend Developer (금융 플랫폼)

■ 직무 소개
토스 유저가 가장 신뢰하는 금융 인터페이스를 만듭니다. 복잡한 금융 로직을 직관적이고 군더더기 없는 UI로 풀어내며, 0.1초의 지연도 용납하지 않는 극강의 사용자 경험을 지향합니다.

■ 주요 업무
- 토스 웹뷰 및 웹 서비스 전반의 프론트엔드 설계 및 구현
- 복잡한 사용자 폼과 상태 동기화 관리
- 번들 사이즈 및 로딩 성능 극대화

■ 자격 요건
- React, TypeScript 기반의 개발 숙련도
- 브라우저 동작 원리와 이벤트 루프에 대한 정확한 이해
- 코드 리뷰를 통한 동료와의 원활한 협업 역량

■ 우대 사항
- 디자인 시스템 설계 및 모듈화 경험
- Canvas / WebGL 또는 대규모 렌더링 가상화 경험
- Lighthouse 점수 90점 이상 달성 등 실제 성능 튜닝 경험`,
    summary: '최고의 모바일 금융 UX와 60fps 렌더링 성능을 만들어갈 프론트엔드 엔지니어 포지션입니다.',
  },
  {
    id: 'job-sample-4',
    company: 'LG CNS / AI & Data Platform',
    role: '스마트물류 AI & 데이터 파이프라인 엔지니어',
    experienceRequirement: '신입 또는 1~2년차',
    educationRequirement: '학사 이상 (컴퓨터/수학/산업공학 등 유관 전공)',
    responsibilities: [
      '물류 자동화 센터의 실시간 물동량 예측 AI 모델 서빙 및 데이터 파이프라인 개발',
      '센서 및 설비에서 쏟아지는 대용량 시계열 데이터 수집 및 정제 시스템 구축',
      'REST API 및 비동기 배치 작업을 통한 상위 WMS 시스템 연동',
    ],
    mandatorySkills: [
      'Python 프로그래밍 및 객체지향 설계 숙련도',
      'SQL 쿼리 작성 및 RDBMS 데이터 모델링 역량',
      'RESTful API 프레임워크(FastAPI, Django, Flask 중 1개) 활용 역량',
      '기초적인 통계 및 머신러닝 데이터 전처리 지식',
    ],
    preferredSkills: [
      'Docker 컨테이너 기반 개발 및 배포 환경 경험',
      '물류/스마트팩토리 도메인 지식 또는 최적화 알고리즘 관심',
      'Kafka, Airflow 등 데이터 오케스트레이션 도구 경험',
      '정보처리기사, 데이터분석기사 자격증 보유자',
    ],
    rawText: `[LG CNS] 스마트물류 AI & 데이터 파이프라인 엔지니어 모집

■ 역할
차세대 메가물류센터의 자동화 로봇 및 분류 설비에서 수집되는 초당 수만 건의 센서 데이터를 실시간 처리하고 최적 경로 배정 알고리즘을 연동하는 데이터 엔지니어링 포지션입니다.

■ 자격 요건
- Python 기반 백엔드 및 데이터 핸들링 역량
- SQL 쿼리 최적화 및 데이터베이스 스키마 이해
- 자료구조 및 알고리즘 구현 능력

■ 우대 조건
- Docker 컨테이너 배포 경험
- Apache Airflow 또는 시계열 데이터베이스 경험
- 데이터분석기사 또는 SQLD 보유자`,
    summary: '차세대 메가물류센터의 지능형 제어와 데이터 스트림을 담당할 AI/데이터 엔지니어 채용입니다.',
  },
];
