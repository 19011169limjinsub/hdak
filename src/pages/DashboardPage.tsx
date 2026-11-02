import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  Briefcase,
  History,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Layers,
  Award,
  Zap,
  Target,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { SAMPLE_JOB_POSTINGS } from '../mock/samples';

export const DashboardPage: React.FC = () => {
  const {
    setActivePage,
    profile,
    profileCompletionPercentage,
    analysisResults,
    setCurrentResult,
    runAnalysis,
    theme,
  } = useApp();

  const isDark = theme === 'dark';
  const recentAnalyses = analysisResults.slice(0, 3);
  const latestResult = analysisResults[0] || null;

  const handleQuickRun = (jobIndex: number) => {
    const job = SAMPLE_JOB_POSTINGS[jobIndex];
    runAnalysis(job);
  };

  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <section
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-12 transition-all duration-200 ${
          isDark
            ? 'border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 shadow-2xl'
            : 'border-slate-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 shadow-sm'
        }`}
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
              isDark
                ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                : 'border-indigo-200 bg-indigo-50/80 text-indigo-700 shadow-2xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI 기반 정밀 채용 공고 & 스펙 교차 검증</span>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            지원하기 전에, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              나의 경쟁력을 먼저 확인하세요.
            </span>
          </h1>

          <p
            className={`text-base md:text-lg leading-relaxed font-normal ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            AI가 당신의 역량과 기업의 요구 사항을 분석하여 더 현명한 취업 전략을 제시합니다.
            단순 검색을 넘어 직무 적합도 점수, 예상 합격 지표, 부족한 역량 개선 로드맵까지 한눈에 확인하세요.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('job-input')}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Briefcase className="w-4 h-4" />
              <span>직무 적합도 분석 시작</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('profile')}
              className={`px-5 py-3.5 rounded-2xl font-bold text-sm border flex items-center gap-2 transition-all ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700 hover:border-slate-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>내 스펙 등록 / 수정</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid: Spec Status & Recent Job Fit Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: User Spec Registered Status */}
        <div
          className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                내 스펙 등록 상태
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                작성 완료
              </span>
            </div>

            <h3
              className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span>{profile.name}</span>
              <span
                className={`text-xs font-normal ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                님
              </span>
            </h3>
            <p
              className={`text-xs mt-1 line-clamp-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {profile.targetJob}
            </p>

            {/* Spec completion bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  스펙 완성도
                </span>
                <span className="font-bold text-indigo-600 font-mono">
                  {profileCompletionPercentage}%
                </span>
              </div>
              <div
                className={`w-full h-2 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-800' : 'bg-slate-100'
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700"
                  style={{ width: `${profileCompletionPercentage}%` }}
                />
              </div>
            </div>

            {/* Quick Spec Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-5 text-center">
              <div
                className={`p-2.5 rounded-2xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <p
                  className={`text-lg font-black font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {profile.skills.length}
                </p>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  보유 기술
                </p>
              </div>
              <div
                className={`p-2.5 rounded-2xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <p
                  className={`text-lg font-black font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {profile.projects.length}
                </p>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  프로젝트
                </p>
              </div>
              <div
                className={`p-2.5 rounded-2xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <p
                  className={`text-lg font-black font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {profile.certificates.length + profile.activities.length}
                </p>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  자격/활동
                </p>
              </div>
            </div>
          </div>

          <div
            className={`pt-5 mt-4 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-slate-800/60 text-slate-500' : 'border-slate-100 text-slate-400'
            }`}
          >
            <span>최종 수정: {new Date(profile.updatedAt).toLocaleDateString()}</span>
            <button
              onClick={() => setActivePage('profile')}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline"
            >
              스펙 상세 보기
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Latest Analysis Job Fit Score (or Empty State) */}
        <div
          className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                최근 분석한 직무 적합도
              </span>
              {latestResult && (
                <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {new Date(latestResult.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {latestResult ? (
              <div className="flex flex-col items-center">
                <ScoreGauge score={latestResult.jobFitScore} size={150} strokeWidth={11} />
                <div className="text-center mt-3">
                  <h4
                    className={`font-bold text-sm ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {latestResult.jobPosting.company}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 line-clamp-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {latestResult.jobPosting.role}
                  </p>
                  <p className="text-xs text-indigo-600 mt-1 font-bold">
                    예상 경쟁력: {latestResult.estimatedCompetitiveness.level}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div
                  className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
                    isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Target className="w-6 h-6" />
                </div>
                <h4
                  className={`font-bold text-sm ${
                    isDark ? 'text-slate-300' : 'text-slate-800'
                  }`}
                >
                  아직 분석 내역이 없습니다
                </h4>
                <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  공고를 입력하고 내 역량이 얼마나 부합하는지 1분 만에 AI로 확인해보세요.
                </p>
              </div>
            )}
          </div>

          <div className={`pt-4 mt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            {latestResult ? (
              <button
                onClick={() => {
                  setCurrentResult(latestResult);
                  setActivePage('result');
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  isDark
                    ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}
              >
                <span>최근 분석 리포트 열람</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleQuickRun(0)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>샘플 공고로 첫 분석 실행</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Employment Readiness Status */}
        <div
          className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                취업 준비 현황 요약
              </span>
            </div>

            <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              핵심 보유 기술 스택
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill.id}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium border flex items-center gap-1 ${
                    isDark
                      ? 'bg-slate-850 text-slate-200 border-slate-700/60'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] text-indigo-600 font-bold font-mono">
                    {skill.level}
                  </span>
                </span>
              ))}
              {profile.skills.length > 6 && (
                <span
                  className={`px-2 py-1 rounded-xl text-xs font-medium border ${
                    isDark
                      ? 'bg-slate-900 text-slate-400 border-slate-800'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  +{profile.skills.length - 6}개
                </span>
              )}
            </div>

            <div className="mt-5 space-y-2">
              <h4
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                대표 프로젝트
              </h4>
              {profile.projects[0] ? (
                <div
                  className={`p-3 rounded-2xl border text-xs ${
                    isDark
                      ? 'bg-slate-950/70 border-slate-800/80'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <p
                    className={`font-bold line-clamp-1 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {profile.projects[0].title}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 line-clamp-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {profile.projects[0].role}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">등록된 프로젝트가 없습니다.</p>
              )}
            </div>
          </div>

          <div className={`pt-4 mt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            <button
              onClick={() => setActivePage('profile')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <span>스펙 정보 업데이트</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Test Presets: 4 Realistic Tech Job Postings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <span>원클릭 추천 공고로 10초 만에 분석 체험</span>
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              실제 테크 기업의 채용 공고 프리셋을 선택하여 내 스펙과의 직무 적합도를 즉시 확인해보세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_JOB_POSTINGS.map((job, idx) => (
            <div
              key={job.id}
              className={`rounded-3xl border p-5 transition-all flex flex-col justify-between group ${
                isDark
                  ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900/80'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                        : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                    }`}
                  >
                    {job.company.split('/')[0]}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {job.experienceRequirement}
                  </span>
                </div>
                <h3
                  className={`font-bold text-sm transition-colors line-clamp-2 ${
                    isDark
                      ? 'text-white group-hover:text-indigo-300'
                      : 'text-slate-900 group-hover:text-indigo-600'
                  }`}
                >
                  {job.role}
                </h3>
                <p
                  className={`text-xs mt-2 line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {job.summary}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {job.mandatorySkills.slice(0, 3).map((s, i) => (
                    <span
                      key={i}
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        isDark
                          ? 'bg-slate-850 text-slate-300 border-slate-800'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {s.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`mt-5 pt-3 border-t ${
                  isDark ? 'border-slate-800/60' : 'border-slate-100'
                }`}
              >
                <button
                  onClick={() => handleQuickRun(idx)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    isDark
                      ? 'bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white border-indigo-500/30 group-hover:border-indigo-500'
                      : 'bg-indigo-50 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white border-indigo-200 group-hover:border-indigo-600'
                  }`}
                >
                  <span>이 공고로 적합도 분석</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Analyses List */}
      {recentAnalyses.length > 0 && (
        <section
          className={`rounded-3xl border p-6 space-y-4 transition-all ${
            isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <History className="w-5 h-5 text-indigo-600" />
              <span>최근 분석 내역</span>
            </h2>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              전체 기록 보기 ({analysisResults.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
            {recentAnalyses.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentResult(item);
                  setActivePage('result');
                }}
                className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 rounded-2xl cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                      item.jobFitScore >= 80
                        ? isDark
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.jobFitScore >= 65
                        ? isDark
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : isDark
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <span>{item.jobFitScore}</span>
                    <span className="text-[9px] font-normal text-slate-400 -mt-0.5">점</span>
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-sm transition-colors ${
                        isDark ? 'text-white hover:text-indigo-300' : 'text-slate-900 hover:text-indigo-600'
                      }`}
                    >
                      {item.jobPosting.company} - {item.jobPosting.role}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 line-clamp-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {item.scoreRationale}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.estimatedCompetitiveness.level}
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div
          className={`p-5 rounded-3xl border space-y-2 transition-all ${
            isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            <Layers className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            보유 기술 & 프로젝트 정밀 대조
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            단순 키워드 일치가 아닌 프로젝트 기여도, 담당 역할, 구현 깊이를 채용 요건과 교차 분석합니다.
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border space-y-2 transition-all ${
            isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            객관적인 0~100점 적합도 산출
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            필수 요건, 우대 사항, 도메인 연관성을 분리하여 신뢰도 높은 예상 경쟁력 지표를 제공합니다.
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border space-y-2 transition-all ${
            isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <Award className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            실전 맞춤 역량 개선 로드맵
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            부족한 역량을 단기간에 증명할 수 있는 학습 방향과 포트폴리오 프로젝트 아이디어를 함께 제시합니다.
          </p>
        </div>
      </section>
    </div>
  );
};
