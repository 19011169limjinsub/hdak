export type SkillCategory = 'language' | 'framework' | 'database' | 'infra' | 'domain' | 'tools' | 'other';
export type SkillProficiency = '초급' | '중급' | '고급';

export interface UserSkill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillProficiency;
  experienceMonths?: number;
}

export interface UserProject {
  id: string;
  title: string;
  role: string;
  duration: string;
  techStack: string[];
  description: string;
  keyAchievements: string[];
}

export interface UserCareer {
  id: string;
  company: string;
  role: string;
  period: string;
  type: '정규직' | '인턴' | '계약직' | '프리랜서';
  description: string;
}

export interface UserCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  score?: string;
}

export interface UserActivity {
  id: string;
  title: string;
  category: '수상' | '해커톤' | '부트캠프' | '오픈소스' | '동아리' | '기타';
  period: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  targetJob: string;
  education: {
    school: string;
    degree: string;
    major: string;
    gpa?: string;
    status: '졸업' | '졸업예정' | '재학' | '휴학' | '기타';
  };
  skills: UserSkill[];
  projects: UserProject[];
  careers: UserCareer[];
  certificates: UserCertificate[];
  activities: UserActivity[];
  freeIntro: string;
  updatedAt: string;
}

export interface JobPosting {
  id: string;
  company: string;
  role: string;
  rawText: string;
  url?: string;
  experienceRequirement: string;
  educationRequirement: string;
  responsibilities: string[];
  mandatorySkills: string[];
  preferredSkills: string[];
  summary?: string;
}

export interface MatchMetric {
  score: number;
  label: string;
  details: string;
  satisfied?: boolean;
  satisfiedRatio?: string;
}

export interface SkillGapItem {
  skillName: string;
  category: string;
  status: '충족' | '보완 필요' | '관련 경험 부족' | '학습 권장';
  userLevel?: string;
  requiredLevel?: string;
  learningDirection: string;
  projectIdea: string;
}

export interface StrategicRecommendation {
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionItem: string;
}

export interface EstimatedCompetitiveness {
  level: string;
  summary: string;
  positiveFactors: string[];
  limitingFactors: string[];
  disclaimer: string;
}

export interface AnalysisResult {
  id: string;
  userProfileId: string;
  jobPosting: JobPosting;
  jobFitScore: number;
  scoreRationale: string;
  matchBreakdown: {
    techStackMatch: MatchMetric;
    projectExperienceMatch: MatchMetric;
    jobRelevance: MatchMetric;
    mandatoryRequirements: MatchMetric;
    preferredRequirements: MatchMetric;
  };
  estimatedCompetitiveness: EstimatedCompetitiveness;
  skillsGapAnalysis: SkillGapItem[];
  strengths: string[];
  weaknesses: string[];
  strategicRecommendations: StrategicRecommendation[];
  interviewPrepQuestions: string[];
  createdAt: string;
  source: string;
}

export type ActivePage = 'dashboard' | 'profile' | 'job-input' | 'analyzing' | 'result' | 'history' | 'compare';
export type AppTheme = 'light' | 'dark';
