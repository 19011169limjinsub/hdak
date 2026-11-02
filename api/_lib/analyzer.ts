import { GoogleGenAI } from '@google/genai';

/**
 * Safely inspects the GEMINI_API_KEY environment variable without exposing secrets.
 */
export function getApiKeyStatus(): {
  isValid: boolean;
  masked: string;
  keyLength: number;
} {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return { isValid: false, masked: 'NOT_CONFIGURED', keyLength: 0 };
  }
  const clean = apiKey.trim();
  const masked = clean.length > 8
    ? `${clean.slice(0, 4)}...${clean.slice(-4)}`
    : 'CONFIGURED';
  return { isValid: true, masked, keyLength: clean.length };
}

/**
 * Initializes the Gemini API client safely.
 */
export function getGeminiClient(): {
  ai: GoogleGenAI | null;
  hasApiKey: boolean;
  statusInfo: { isValid: boolean; masked: string; keyLength: number };
} {
  const statusInfo = getApiKeyStatus();
  if (!statusInfo.isValid) {
    return { ai: null, hasApiKey: false, statusInfo };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return { ai, hasApiKey: true, statusInfo };
  } catch (err: any) {
    console.error('[Gemini Init Error]', err?.message || err);
    return { ai: null, hasApiKey: false, statusInfo };
  }
}

/**
 * Promise wrapper with timeout
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label = 'Operation'): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`[Timeout] ${label} exceeded ${ms}ms threshold`));
    }, ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Parses raw job posting text into structured components
 */
export async function parseJobPosting(rawText: string, companyName?: string, roleTitle?: string) {
  const startTime = Date.now();
  const { ai, hasApiKey, statusInfo } = getGeminiClient();

  console.log(`[JobParse Start] [${new Date().toISOString()}] Input length: ${rawText?.length || 0} chars | hasApiKey: ${hasApiKey} (key: ${statusInfo.masked})`);

  if (ai) {
    try {
      const prompt = `
당신은 IT/기술 채용 전문 헤드헌터이자 HR 분석가입니다.
사용자가 제공한 채용 공고 원문 또는 정보를 분석하여 구조화된 JSON 데이터로 추출하세요.

[입력 데이터]
기업명 (선택): ${companyName || '미지정'}
직무명 (선택): ${roleTitle || '미지정'}
공고 원문 / URL 설명:
${rawText || '정보 없음'}

반드시 다음 JSON 형식으로만 응답하세요 (순수 JSON):
{
  "company": "추출된 기업명",
  "role": "추출된 직무명 (예: 백엔드 개발자, C++ 임베디드 엔지니어 등)",
  "experienceRequirement": "요구 경력 조건 (예: 신입, 경력 3년 이상, 무관 등)",
  "educationRequirement": "요구 학력 조건 (예: 학사 이상, 무관 등)",
  "responsibilities": ["주요 업무 1", "주요 업무 2", "주요 업무 3"],
  "mandatorySkills": ["필수 기술/역량 1", "필수 기술/역량 2"],
  "preferredSkills": ["우대 사항 1", "우대 사항 2"],
  "summary": "공고 핵심 2줄 요약"
}
`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        12000,
        'Gemini parseJobPosting'
      );

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      console.log(`[JobParse Success] Completed in ${Date.now() - startTime}ms via gemini-3.8-flash`);
      return {
        ...parsed,
        _source: 'gemini-3.8-flash',
      };
    } catch (e: any) {
      console.warn(`[JobParse Fallback] Gemini call failed (${e.message}), falling back to heuristic engine.`);
    }
  } else {
    console.log(`[JobParse Heuristic] GEMINI_API_KEY not configured or invalid. Using heuristic parsing.`);
  }

  // Fallback heuristic parser
  const fallback = {
    company: companyName || '입력 기업',
    role: roleTitle || '소프트웨어 엔지니어',
    experienceRequirement: '경력 무관 또는 기재 사항 참조',
    educationRequirement: '학사 이상 (관련 전공 우대)',
    responsibilities: [
      '서비스 백엔드/소프트웨어 기능 설계 및 개발',
      '데이터 파이프라인 및 안정적인 인프라 운영 협업',
      '코드 리뷰 및 지속적인 성능 최적화',
    ],
    mandatorySkills: ['관련 언어 숙련도', '자료구조 및 알고리즘 이해', 'Git 협업 경험'],
    preferredSkills: ['유관 프로젝트 리드 경험', '성능 튜닝 및 대규모 트래픽 처리 경험'],
    summary: `${companyName || '기업'}의 ${roleTitle || '기술 직무'} 채용 공고입니다.`,
    _source: 'heuristic-engine',
  };

  console.log(`[JobParse Success] Heuristic parser finished in ${Date.now() - startTime}ms`);
  return fallback;
}

/**
 * Conducts job fit analysis between user profile and job posting
 */
export async function analyzeJobFit(userProfile: any, jobPosting: any) {
  const startTime = Date.now();
  const { ai, hasApiKey, statusInfo } = getGeminiClient();

  const userSkillCount = Array.isArray(userProfile?.skills) ? userProfile.skills.length : 0;
  const userProjectCount = Array.isArray(userProfile?.projects) ? userProfile.projects.length : 0;
  const company = jobPosting?.company || '기업';
  const role = jobPosting?.role || '직무';

  console.log(
    `[Analyze Start] [${new Date().toISOString()}] Target: ${company} - ${role} | User skills: ${userSkillCount}, projects: ${userProjectCount} | Gemini: ${hasApiKey ? 'ENABLED (' + statusInfo.masked + ')' : 'DISABLED'}`
  );

  if (ai) {
    try {
      const prompt = `
당신은 대한민국 최고 수준의 IT/테크 채용 전문 AI 분석관이자 커리어 컨설턴트 "JOB FIT AI"입니다.
사용자의 보유 역량(스펙, 기술, 프로젝트, 경력, 자격증)과 기업의 채용 공고를 정밀 비교 분석하십시오.

주의사항:
1. 실제 채용 데이터에 대한 과장된 통계적 확정 표현은 지양하고, "AI 기반 예상 경쟁력 지표"로서 객관적이고 건설적인 피드백을 제공하세요.
2. 직무 적합도 점수(0~100점)는 기술 스택 일치도, 프로젝트 연관성, 필수 요건 충족도, 우대 요건 충족도를 종합 고려하여 공정하고 엄밀하게 산출하세요.
3. 부족한 역량(Skills Gap)에 대해서는 단순 나열에 그치지 않고, 각 항목마다 "구체적인 실무 학습 방향"과 "역량을 증명할 수 있는 포트폴리오 프로젝트 아이디어"를 제시하세요.
4. 면접관 관점에서 이 지원자가 받았을 때 가장 날카로울 수 있는 "예상 기술/경험 검증 질문" 3가지를 도출하세요.

[사용자 스펙 (User Profile)]
${JSON.stringify(userProfile, null, 2)}

[채용 공고 (Job Posting)]
${JSON.stringify(jobPosting, null, 2)}

반드시 다음 JSON 스키마를 엄격히 준수하여 응답하세요 (순수 JSON 형식만 반환):
{
  "jobFitScore": 82,
  "scoreRationale": "종합 점수 82점에 대한 핵심 평가 근거 (3~4문장)",
  "matchBreakdown": {
    "techStackMatch": {
      "score": 85,
      "label": "기술 스택 일치도",
      "details": "공고에서 요구하는 주요 기술 중 어떤 것이 일치하고 어떤 것이 부족한지 상세 설명"
    },
    "projectExperienceMatch": {
      "score": 80,
      "label": "프로젝트 경험 일치도",
      "details": "사용자가 진행한 프로젝트의 도메인/규모/기여도가 해당 직무의 주요 업무와 얼마나 맞닿아 있는지 분석"
    },
    "jobRelevance": {
      "score": 78,
      "label": "직무 관련 경험 일치도",
      "details": "인턴/실무/동아리 등 직무와 직접 연계된 실전 경험 분석"
    },
    "mandatoryRequirements": {
      "score": 90,
      "satisfied": true,
      "label": "필수 자격 요건 충족",
      "details": "필수 조건(학력, 필수 언어, 기본 자격 등) 충족 현황"
    },
    "preferredRequirements": {
      "score": 70,
      "satisfiedRatio": "3개 중 2개 충족",
      "label": "우대 사항 충족",
      "details": "우대 기술 및 자격요건 충족 분석"
    }
  },
  "estimatedCompetitiveness": {
    "level": "중상 (경쟁력 있음)",
    "summary": "현재 스펙으로 지원 시 서류 및 1차 전형에서의 예상 경쟁력 수준 설명",
    "positiveFactors": [
      "긍정적 평가 요소 1 (예: 요구 기술 스택의 깊이 있는 실무 프로젝트 적용 경험)",
      "긍정적 평가 요소 2",
      "긍정적 평가 요소 3"
    ],
    "limitingFactors": [
      "보완이 필요한 평가 요소 1 (예: 대용량 트래픽 환경 또는 특정 프레임워크 실전 경험 부족)",
      "보완이 필요한 평가 요소 2"
    ],
    "disclaimer": "※ 본 지표는 공고 원문과 제출된 이력을 교차 분석한 AI 예상 경쟁력 지표이며, 채용 시장 동향 및 기업의 내부 비공개 평가 기준에 따라 실제 결과와 차이가 있을 수 있습니다."
  },
  "skillsGapAnalysis": [
    {
      "skillName": "기술명 (예: C++, Docker, Redis, SQL 등)",
      "category": "언어/프레임워크/인프라/도메인",
      "status": "충족",
      "userLevel": "중급 (실무 프로젝트 적용)",
      "requiredLevel": "필수 요건",
      "learningDirection": "현 수준에서 심화할 수 있는 학습 권장 방향",
      "projectIdea": "해당 역량을 포트폴리오에서 더욱 돋보이게 할 수 있는 프로젝트 아이디어"
    },
    {
      "skillName": "보완 필요 기술명",
      "category": "인프라",
      "status": "보완 필요",
      "userLevel": "기초 또는 미경험",
      "requiredLevel": "필수 또는 우대 요건",
      "learningDirection": "구체적인 온보딩/학습 로드맵 1~2문장",
      "projectIdea": "단기간에 적용해볼 수 있는 구체적 토이/미니 프로젝트 제안"
    }
  ],
  "strengths": [
    "지원 직무 맞춤 강력한 강점 1",
    "지원 직무 맞춤 강력한 강점 2",
    "지원 직무 맞춤 강력한 강점 3"
  ],
  "weaknesses": [
    "보완이 요구되는 약점 1",
    "보완이 요구되는 약점 2"
  ],
  "strategicRecommendations": [
    {
      "title": "이력서/포트폴리오 서술 최적화 전략",
      "description": "어떤 프로젝트의 성과 수치(예: 응답속도 40% 개선 등)를 전면에 강조해야 하는지 제안",
      "priority": "HIGH",
      "actionItem": "구체적인 즉시 실행 과제"
    },
    {
      "title": "핵심 기술 스택 단기 보완 과제",
      "description": "공고에서 강조된 기술 중 빠르게 데모 프로젝트를 구축할 수 있는 방법",
      "priority": "MEDIUM",
      "actionItem": "구체적인 즉시 실행 과제"
    },
    {
      "title": "면접 대응 및 직무 스토리텔링 전략",
      "description": "자신의 비전공 또는 주니어 한계를 극복할 수 있는 답변 방향성",
      "priority": "MEDIUM",
      "actionItem": "구체적인 즉시 실행 과제"
    }
  ],
  "interviewPrepQuestions": [
    "지원자의 프로젝트 A에서 사용한 기술 X 대신 기술 Y를 선택하지 않은 이유와 트레이드오프는 무엇인가요?",
    "공고의 필수 요건인 Z 기술과 관련하여 실제 트러블슈팅을 경험해본 사례가 있나요?",
    "우리 회사의 주요 비즈니스 문제인 성능 병목을 본인의 역량으로 어떻게 해결할 수 있나요?"
  ]
}
`;

      console.log(`[Analyze Gemini Call] Sending prompt to gemini-3.8-flash...`);
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        15000,
        'Gemini analyzeJobFit'
      );

      const text = response.text || '{}';
      const parsedResult = JSON.parse(text);
      const elapsed = Date.now() - startTime;
      console.log(`[Analyze Success] Gemini inference succeeded in ${elapsed}ms | Score: ${parsedResult.jobFitScore}`);

      return {
        result: parsedResult,
        source: 'gemini-3.8-flash',
        hasApiKey: true,
        executionTimeMs: elapsed,
      };
    } catch (aiErr: any) {
      console.warn(`[Analyze Gemini Error] Inference failed: ${aiErr?.message || 'Unknown'}. Switching to deterministic analysis engine.`);
    }
  } else {
    console.log(`[Analyze Fallback] GEMINI_API_KEY not configured. Running deterministic analysis engine.`);
  }

  // Fallback deterministic analysis engine
  const fallbackResult = generateRealisticAnalysis(userProfile, jobPosting);
  const elapsed = Date.now() - startTime;
  console.log(`[Analyze Fallback Complete] Heuristic engine returned analysis in ${elapsed}ms | Score: ${fallbackResult.jobFitScore}`);

  return {
    result: fallbackResult,
    source: hasApiKey ? 'heuristic-fallback' : 'heuristic-engine',
    hasApiKey,
    executionTimeMs: elapsed,
  };
}

/**
 * Deterministic, rule-based realistic analysis engine
 */
export function generateRealisticAnalysis(userProfile: any, jobPosting: any) {
  const userSkills: string[] = (userProfile?.skills || []).map((s: any) =>
    typeof s === 'string' ? s.toLowerCase() : (s?.name || '').toLowerCase()
  );
  const userProjects = userProfile?.projects || [];
  const requiredSkills: string[] = (jobPosting?.mandatorySkills || []).concat(
    jobPosting?.requirements || []
  );
  const preferredSkills: string[] = jobPosting?.preferredSkills || [];

  let matchedSkillsCount = 0;
  const skillsGapAnalysis: any[] = [];

  // Check required skills
  requiredSkills.forEach((req: string) => {
    const cleanReq = req.toLowerCase();
    const hasMatch = userSkills.some((s) => s.includes(cleanReq) || cleanReq.includes(s));
    if (hasMatch) {
      matchedSkillsCount++;
      skillsGapAnalysis.push({
        skillName: req,
        category: '핵심 요구 역량',
        status: '충족',
        userLevel: '보유 중 (프로젝트 활용)',
        requiredLevel: '필수',
        learningDirection: '현 실무 수준에서 성능 프로파일링 및 대규모 데이터 환경 최적화 기법 심화 학습 권장',
        projectIdea: `실제 서비스 부하 테스트 도구(k6, Locust)를 도입하여 성능 30% 개선 성과 수치화`,
      });
    } else {
      skillsGapAnalysis.push({
        skillName: req,
        category: '핵심 요구 역량',
        status: '보완 필요',
        userLevel: '경험 미확인',
        requiredLevel: '필수',
        learningDirection: `공식 문서 기반의 코어 아키텍처 학습 및 기본 CRUD/API 연동 실습 우선 진행`,
        projectIdea: `${req}의 주요 특징을 활용한 1주 완성 마이크로 데모 프로젝트 제작 및 GitHub Readme 정리`,
      });
    }
  });

  // Check preferred skills
  preferredSkills.forEach((pref: string) => {
    const cleanPref = pref.toLowerCase();
    const hasMatch = userSkills.some((s) => s.includes(cleanPref) || cleanPref.includes(s));
    if (hasMatch) {
      skillsGapAnalysis.push({
        skillName: pref,
        category: '우대 역량',
        status: '충족',
        userLevel: '보유 중',
        requiredLevel: '우대',
        learningDirection: '기존 프로젝트에 적용된 아키텍처 패턴과 의사결정 근거를 포트폴리오에 상세 기술',
        projectIdea: '실제 운영 환경에서의 모니터링 메트릭(Prometheus/Grafana) 연계 포트폴리오 강화',
      });
    } else {
      skillsGapAnalysis.push({
        skillName: pref,
        category: '우대 역량',
        status: '학습 권장',
        userLevel: '미보유',
        requiredLevel: '우대',
        learningDirection: `가산점 획득을 위해 오픈소스 튜토리얼 및 실습 컨테이너 환경 구축 추천`,
        projectIdea: `기존 토이 프로젝트에 ${pref} 모듈을 플러그인 형태로 추가 구현`,
      });
    }
  });

  const baseRatio = requiredSkills.length > 0 ? (matchedSkillsCount / requiredSkills.length) * 100 : 75;
  const ratio = Math.min(Math.max(baseRatio, 48), 94);
  const jobFitScore = Math.round(ratio);

  let competitivenessLevel = '중상 (경쟁력 있음)';
  if (jobFitScore >= 85) competitivenessLevel = '상 (합격 유력권)';
  else if (jobFitScore < 65) competitivenessLevel = '도전권 (집중 보완 필요)';

  return {
    jobFitScore,
    scoreRationale: `${jobPosting?.company || '해당 기업'}의 ${jobPosting?.role || '직무'} 요구사항과 비교했을 때, 핵심 기술 스택의 약 ${Math.round(ratio)}%가 일치합니다. 특히 ${userProjects.length > 0 ? userProjects[0]?.title || '진행한 프로젝트' : '보유 역량'}에서 다룬 실무 경험이 긍정적으로 작용하며, 일부 필수/우대 인프라 요건을 보완할 경우 합격 가능성이 대폭 상승할 것으로 분석됩니다.`,
    matchBreakdown: {
      techStackMatch: {
        score: jobFitScore,
        label: '기술 스택 일치도',
        details: `주요 요구 기술 중 핵심 언어 및 프레임워크가 일치하며, 보완 기술은 학습 곡선이 비교적 완만합니다.`,
      },
      projectExperienceMatch: {
        score: Math.min(jobFitScore + 3, 98),
        label: '프로젝트 경험 일치도',
        details: `수행한 프로젝트의 문제 해결 경험과 도메인 적용력이 채용 직무의 일상 업무와 밀접합니다.`,
      },
      jobRelevance: {
        score: Math.max(jobFitScore - 4, 55),
        label: '직무 관련 경험 일치도',
        details: `실무 협업 방식, Git 기반 형상 관리, 코드 리뷰 문화에 대한 친숙도가 양호합니다.`,
      },
      mandatoryRequirements: {
        score: jobFitScore >= 70 ? 92 : 65,
        satisfied: jobFitScore >= 70,
        label: '필수 자격 요건 충족',
        details: `학력 및 핵심 전공/기술 요건을 기본적으로 충족하고 있습니다.`,
      },
      preferredRequirements: {
        score: Math.min(jobFitScore - 8, 80),
        satisfiedRatio: '우대 항목 일부 충족',
        label: '우대 사항 충족',
        details: `우대 기술 스택 중 일부를 보유하고 있어 서류 전형에서 추가적인 가점을 확보할 수 있습니다.`,
      },
    },
    estimatedCompetitiveness: {
      level: competitivenessLevel,
      summary: `동일 직무 지원자 풀 대비 기술적 기초와 프로젝트 완성도 면에서 ${competitivenessLevel} 수준의 경쟁력을 보유하고 있습니다.`,
      positiveFactors: [
        '직무에서 가장 기본이 되는 핵심 프로그래밍 언어 및 프레임워크 기본기 확립',
        '단순 튜토리얼을 넘어서 실제 문제를 해결한 프로젝트 포트폴리오 보유',
        '직무 학습에 대한 적극적인 태도 및 성장 잠재력 증빙 가능',
      ],
      limitingFactors: [
        '대규모 상용 서비스 운영 및 트래픽 분산 처리 실전 경험 부족',
        '채용 공고에서 요구하는 일부 심화 도구/클라우드 배포 파이프라인 경험 보완 필요',
      ],
      disclaimer:
        '※ 본 지표는 공고 원문과 제출된 이력을 교차 분석한 AI 예상 경쟁력 지표이며, 채용 시장 동향 및 기업의 내부 비공개 평가 기준에 따라 실제 결과와 차이가 있을 수 있습니다.',
    },
    skillsGapAnalysis,
    strengths: [
      '요구 직무의 메인 개발 언어에 대한 탄탄한 기본기와 프로젝트 적용 경험',
      '문제를 분석하고 기술을 통해 해결책을 구현해낸 능동적인 포트폴리오 서술',
      '협업 도구 및 버전 관리 시스템을 활용한 팀 단위 프로젝트 개발 경험',
    ],
    weaknesses: [
      '성능 최적화 및 시스템 아키텍처 관점에서의 정량적 지표(수치) 제시 부족',
      '공고의 우대 사항에 포함된 클라우드/CI-CD 파이프라인 경험 미흡',
    ],
    strategicRecommendations: [
      {
        title: '포트폴리오의 성과를 정량적 수치(%)로 재작성',
        description:
          '“성능을 개선했다” 대신 “쿼리 튜닝과 인덱싱을 통해 API 응답속도를 320ms에서 85ms로 73% 단축”과 같이 수치화하세요.',
        priority: 'HIGH',
        actionItem: '대표 프로젝트 1개의 핵심 성과 3가지를 수치화하여 이력서 첫 페이지에 배치',
      },
      {
        title: '부족한 인프라/배포 파이프라인 1일 완성 실습',
        description:
          'Docker 및 GitHub Actions를 활용하여 기존 프로젝트에 자동 빌드/테스트 파이프라인을 구축하고 이력서에 기술 스택으로 추가하세요.',
        priority: 'HIGH',
        actionItem: 'GitHub Actions 워크플로우 YAML 작성 후 Readme에 CI 배지 부착',
      },
      {
        title: '기업의 도메인 특화 비즈니스 고민 답변 준비',
        description:
          `${jobPosting?.company || '해당 기업'}의 현재 서비스 현황과 최근 기술 블로그를 분석하여 본인의 기술이 어떻게 기여할 수 있는지 1분 스피치 준비.`,
        priority: 'MEDIUM',
        actionItem: '기업 기술 블로그 및 최신 보도자료 분석 후 면접 예상 질문 3개 답변 스크립트 작성',
      },
    ],
    interviewPrepQuestions: [
      '본인이 가장 주도적으로 기여했던 프로젝트에서 발생한 가장 심각한 기술적 병목은 무엇이었고, 어떻게 해결하셨나요?',
      `공고에서 요구하는 기술 중 경험이 상대적으로 부족한 항목에 대해 입사 후 어떻게 빠르게 온보딩하실 계획인가요?`,
      '팀 프로젝트 진행 중 팀원과의 기술적 견해 차이 또는 일정 지연 문제가 발생했을 때 어떻게 조율하셨나요?',
    ],
  };
}
