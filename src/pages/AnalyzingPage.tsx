import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Brain, Cpu, Database, CheckCircle2, Loader2 } from 'lucide-react';

export const AnalyzingPage: React.FC = () => {
  const { analyzingStep, analyzingStepMessage, profile, jobPosting, theme } = useApp();
  const isDark = theme === 'dark';

  const steps = [
    {
      id: 1,
      title: '스펙 데이터 벡터화 & 역량 매핑',
      desc: `${profile.name}님의 보유 기술(${profile.skills.length}개)과 프로젝트 경험 구조화`,
      icon: Database,
    },
    {
      id: 2,
      title: '채용 공고 요구조건 심층 분해',
      desc: `${jobPosting.company}의 필수 자격(${jobPosting.mandatorySkills.length}개) 및 우대 사항 분석`,
      icon: Cpu,
    },
    {
      id: 3,
      title: '직무 적합도 & 경험 일치 매트릭스 계산',
      desc: '담당 역할, 기여도, 사용 기술스택 간의 도메인 연관성 교차 검증',
      icon: Brain,
    },
    {
      id: 4,
      title: 'Gemini AI 정밀 추론 & 역량 갭 도출',
      desc: '예상 경쟁력 지표 산출, 약점 보완을 위한 맞춤형 학습 방향 생성',
      icon: Sparkles,
    },
  ];

  return (
    <div className="py-12 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      {/* Central Pulsing Animated Orb */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-44 h-44 rounded-full bg-indigo-500/10 animate-ping" />
        <div className="absolute w-36 h-36 rounded-full bg-purple-500/20 animate-pulse" />

        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <Brain className="w-12 h-12 text-white animate-pulse" />
        </div>
      </div>

      {/* Main Title & Status */}
      <div className="space-y-2">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
            isDark
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
          }`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>AI 심층 직무 분석 진행 중...</span>
        </div>
        <h2
          className={`text-2xl md:text-3xl font-black ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {jobPosting.company} 직무 적합도를 정밀 분석하고 있습니다
        </h2>
        <p className={`text-xs md:text-sm font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {analyzingStepMessage}
        </p>
      </div>

      {/* Step Progression List */}
      <div
        className={`w-full max-w-xl rounded-3xl p-6 text-left space-y-3.5 border transition-all ${
          isDark
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {steps.map((st) => {
          const isDone = analyzingStep > st.id;
          const isCurrent = analyzingStep === st.id;
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                isCurrent
                  ? isDark
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-indigo-50 border-indigo-300 shadow-2xs'
                  : isDone
                  ? isDark
                    ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-transparent border-transparent opacity-40'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDone
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-100 text-emerald-700'
                    : isDark
                    ? 'bg-slate-800 text-slate-500'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent
                        ? isDark
                          ? 'text-white'
                          : 'text-indigo-900'
                        : isDone
                        ? isDark
                          ? 'text-slate-300'
                          : 'text-slate-800'
                        : isDark
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.title}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-indigo-600 animate-pulse">
                      진행 중...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-bold text-emerald-600">완료</span>
                  )}
                </div>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`text-[11px] flex items-center gap-2 ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Gemini AI 모델이 기술 스택, 프로젝트 도메인, 자격 요건을 다각도로 교차 검증하고 있습니다.</span>
      </div>
    </div>
  );
};
