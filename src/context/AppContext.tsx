import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, JobPosting, AnalysisResult, ActivePage } from '../types';
import { SAMPLE_PROFILES, SAMPLE_JOB_POSTINGS } from '../mock/samples';
import { safeApiCall } from '../utils/apiClient';

interface AppContextType {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  loadSampleProfile: (id: string) => void;
  resetProfileToDefault: () => void;
  
  jobPosting: JobPosting;
  setJobPosting: (j: JobPosting) => void;
  loadSampleJob: (id: string) => void;
  
  analysisResults: AnalysisResult[];
  currentResult: AnalysisResult | null;
  setCurrentResult: (r: AnalysisResult | null) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  
  compareIds: string[];
  toggleCompareId: (id: string) => void;
  clearCompareIds: () => void;
  
  isAnalyzing: boolean;
  analyzingStep: number;
  analyzingStepMessage: string;
  runAnalysis: (overrideJob?: JobPosting) => Promise<AnalysisResult | null>;
  
  hasApiKey: boolean;
  profileCompletionPercentage: number;

  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'jobfit_ai_profile_v1',
  JOB: 'jobfit_ai_job_v1',
  HISTORY: 'jobfit_ai_history_v1',
  THEME: 'jobfit_ai_theme_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load profile from localStorage or default to sample 1
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_PROFILES[0];
  });

  // Current job posting
  const [jobPosting, setJobPostingState] = useState<JobPosting>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOB);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_JOB_POSTINGS[0];
  });

  // Analysis history
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(1);
  const [analyzingStepMessage, setAnalyzingStepMessage] = useState('');
  const [hasApiKey, setHasApiKey] = useState(true);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'light'; // Default to clean modern white SaaS theme
  });

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, t);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  // Sync job posting to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOB, JSON.stringify(jobPosting));
    } catch (e) {
      console.error(e);
    }
  }, [jobPosting]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(analysisResults));
    } catch (e) {
      console.error(e);
    }
  }, [analysisResults]);

  // Sync theme class to document html/body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
    }
  }, [theme]);

  // Check backend health and API key on mount
  useEffect(() => {
    safeApiCall<{ hasApiKey?: boolean }>('/api/health')
      .then((res) => {
        setHasApiKey(Boolean(res.data?.hasApiKey ?? res.hasApiKey));
      })
      .catch((e) => {
        console.warn('Backend /api/health check notice:', e?.message || e);
        setHasApiKey(false);
      });
  }, []);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState({
      ...newProfile,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setProfileState((prev) => ({
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString(),
    }));
  };

  const loadSampleProfile = (id: string) => {
    const found = SAMPLE_PROFILES.find((p) => p.id === id);
    if (found) {
      setProfile(found);
    }
  };

  const resetProfileToDefault = () => {
    setProfile(SAMPLE_PROFILES[0]);
  };

  const setJobPosting = (newJob: JobPosting) => {
    setJobPostingState(newJob);
  };

  const loadSampleJob = (id: string) => {
    const found = SAMPLE_JOB_POSTINGS.find((j) => j.id === id);
    if (found) {
      setJobPosting(found);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setAnalysisResults((prev) => prev.filter((item) => item.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const clearHistory = () => {
    setAnalysisResults([]);
    setCurrentResult(null);
    setCompareIds([]);
  };

  const toggleCompareId = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // Keep the latest 2
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const clearCompareIds = () => {
    setCompareIds([]);
  };

  // Calculate profile completion score (0-100)
  const profileCompletionPercentage = React.useMemo(() => {
    let score = 0;
    if (profile.name?.trim()) score += 10;
    if (profile.targetJob?.trim()) score += 10;
    if (profile.education?.school?.trim()) score += 15;
    if (profile.skills?.length >= 3) score += 25;
    else if (profile.skills?.length > 0) score += 15;
    if (profile.projects?.length >= 2) score += 25;
    else if (profile.projects?.length === 1) score += 15;
    if (profile.certificates?.length > 0 || profile.careers?.length > 0) score += 10;
    if (profile.freeIntro?.trim().length > 30) score += 5;
    return Math.min(score, 100);
  }, [profile]);

  // Run Job Fit Analysis with animated multi-step progression
  const runAnalysis = async (overrideJob?: JobPosting): Promise<AnalysisResult | null> => {
    const targetJob = overrideJob || jobPosting;
    setIsAnalyzing(true);
    setActivePage('analyzing');
    setAnalyzingStep(1);
    setAnalyzingStepMessage('사용자 역량 데이터 구조화 및 기술 태그 벡터 매핑 중...');

    const stepTimer1 = setTimeout(() => {
      setAnalyzingStep(2);
      setAnalyzingStepMessage('채용 공고 요구조건(필수 역량, 우대 사항, 직무 요건) 심층 분석 중...');
    }, 1100);

    const stepTimer2 = setTimeout(() => {
      setAnalyzingStep(3);
      setAnalyzingStepMessage('스펙-직무 요구사항 간 적합도 매트릭스 및 도메인 연관성 계산 중...');
    }, 2400);

    const stepTimer3 = setTimeout(() => {
      setAnalyzingStep(4);
      setAnalyzingStepMessage('Gemini AI 직무 적합도 추론 및 부족 역량 개선 로드맵 생성 중...');
    }, 3800);

    try {
      const res = await safeApiCall<any>('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          jobPosting: targetJob,
        }),
      });

      const rawData = res.data;
      if (!rawData) {
        throw new Error('분석 결과 데이터를 수신하지 못했습니다.');
      }

      // Ensure minimal animation time for realistic experience (at least ~3.5s)
      await new Promise((resolve) => setTimeout(resolve, 3500));

      const finalResult: AnalysisResult = {
        id: 'analysis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        userProfileId: profile.id,
        jobPosting: targetJob,
        jobFitScore: rawData.jobFitScore ?? 75,
        scoreRationale: rawData.scoreRationale ?? '',
        matchBreakdown: rawData.matchBreakdown,
        estimatedCompetitiveness: rawData.estimatedCompetitiveness,
        skillsGapAnalysis: rawData.skillsGapAnalysis || [],
        strengths: rawData.strengths || [],
        weaknesses: rawData.weaknesses || [],
        strategicRecommendations: rawData.strategicRecommendations || [],
        interviewPrepQuestions: rawData.interviewPrepQuestions || [],
        createdAt: new Date().toISOString(),
        source: res.source || 'gemini-3.8-flash',
      };

      // Prepend to history
      setAnalysisResults((prev) => [finalResult, ...prev]);
      setCurrentResult(finalResult);
      setActivePage('result');
      return finalResult;
    } catch (err: any) {
      console.error('[Job Fit AI Analysis Error]:', err?.message || err);
      alert(
        `[AI 직무 적합도 분석 오류]\n\n` +
        (err?.message || '분석 중 오류가 발생했습니다. 다시 시도해주세요.')
      );
      setActivePage('job-input');
      return null;
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAnalyzing(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        loadSampleProfile,
        resetProfileToDefault,
        jobPosting,
        setJobPosting,
        loadSampleJob,
        analysisResults,
        currentResult,
        setCurrentResult,
        deleteHistoryItem,
        clearHistory,
        activePage,
        setActivePage,
        compareIds,
        toggleCompareId,
        clearCompareIds,
        isAnalyzing,
        analyzingStep,
        analyzingStepMessage,
        runAnalysis,
        hasApiKey,
        profileCompletionPercentage,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
