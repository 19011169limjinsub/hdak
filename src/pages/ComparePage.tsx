import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GitCompare,
  Award,
  Briefcase,
  X,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';

export const ComparePage: React.FC = () => {
  const {
    analysisResults,
    compareIds,
    toggleCompareId,
    clearCompareIds,
    setActivePage,
    setCurrentResult,
    theme,
  } = useApp();
  const isDark = theme === 'dark';

  const comparedItems = analysisResults.filter((item) => compareIds.includes(item.id));

  if (comparedItems.length < 2) {
    return (
      <div className="py-16 max-w-2xl mx-auto text-center space-y-6">
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto border ${
            isDark
              ? 'bg-purple-600/20 text-purple-400 border-purple-500/30'
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}
        >
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          비교할 공고를 2개 선택해주세요
        </h2>
        <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          동일한 내 스펙을 기준으로 서로 다른 기업의 직무 적합도를 나란히 비교하여 어느 곳에 지원하는 것이 더 유리한지 한눈에 확인할 수 있습니다.
        </p>

        {analysisResults.length >= 2 ? (
          <div
            className={`p-5 rounded-3xl border text-left space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h4 className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              비교함에 담을 공고를 선택하세요:
            </h4>
            <div className="space-y-2">
              {analysisResults.slice(0, 5).map((item) => {
                const isSelected = compareIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCompareId(item.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-purple-50 border-purple-400 text-purple-900 shadow-2xs'
                        : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs">{item.jobPosting.company}</span>
                      <span className={`text-xs ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.jobPosting.role}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {item.jobFitScore}점
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setActivePage('job-input')}
            className="px-6 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 mx-auto shadow-md shadow-indigo-600/25"
          >
            <Briefcase className="w-4 h-4" />
            <span>채용 공고 추가 분석하러 가기</span>
          </button>
        )}
      </div>
    );
  }

  const [itemA, itemB] = comparedItems;
  const scoreDiff = itemA.jobFitScore - itemB.jobFitScore;
  const higherItem = scoreDiff >= 0 ? itemA : itemB;

  const cardClass = `p-6 rounded-3xl border transition-all ${
    isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
  }`;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2 ${
              isDark
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>기업별 직무 적합도 비교</span>
          </div>
          <h1
            className={`text-2xl md:text-3xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {itemA.jobPosting.company} vs {itemB.jobPosting.company}
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            동일한 지원자 스펙 기준 두 기업 간 적합도 점수와 요구역량 충족도를 비교 분석합니다.
          </p>
        </div>

        <button
          onClick={clearCompareIds}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold border flex items-center gap-1.5 self-start md:self-auto transition-all ${
            isDark
              ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-2xs'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>비교 초기화</span>
        </button>
      </div>

      {/* AI Comparative Verdict Banner */}
      <div
        className={`p-6 rounded-3xl border space-y-2 ${
          isDark
            ? 'border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40'
            : 'border-purple-200 bg-gradient-to-r from-purple-50/70 via-white to-indigo-50/60 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          <h3
            className={`font-black text-base ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            AI 종합 비교 판정: 현재 스펙에서는{' '}
            <span className="text-purple-600 underline underline-offset-4">
              {higherItem.jobPosting.company} ({higherItem.jobPosting.role})
            </span>
            의 적합도가 {Math.abs(scoreDiff)}점 더 높습니다.
          </h3>
        </div>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {scoreDiff !== 0
            ? `${higherItem.jobPosting.company}은(는) 현재 지원자가 보유한 핵심 기술 스택과 프로젝트 성과가 요구사항에 직접 부합하는 반면, 상대 기업은 인프라 또는 추가 우대 사항에서의 보완이 요구됩니다.`
            : `두 기업 모두 유사한 적합도 점수를 보이고 있으며, 개인의 선호 도메인 및 성장 방향성에 따라 선택하는 것을 권장합니다.`}
        </p>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item A */}
        <div className={`${cardClass} space-y-6`}>
          <div
            className={`flex items-center justify-between border-b pb-4 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                    : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                }`}
              >
                {itemA.jobPosting.company}
              </span>
              <h3 className={`text-lg font-bold mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {itemA.jobPosting.role}
              </h3>
            </div>
            <button
              onClick={() => {
                setCurrentResult(itemA);
                setActivePage('result');
              }}
              className="text-xs text-indigo-600 hover:underline font-bold"
            >
              상세보기
            </button>
          </div>

          <div className="flex justify-center py-2">
            <ScoreGauge score={itemA.jobFitScore} size={170} strokeWidth={12} />
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="font-bold text-indigo-600">예상 경쟁력</span>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              {itemA.estimatedCompetitiveness.level}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              항목별 점수
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>기술 스택 일치</span>
                <span className="font-bold font-mono text-indigo-600">
                  {itemA.matchBreakdown.techStackMatch?.score ?? 0}점
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>프로젝트 일치</span>
                <span className="font-bold font-mono text-indigo-600">
                  {itemA.matchBreakdown.projectExperienceMatch?.score ?? 0}점
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>필수 요건 충족</span>
                <span className="font-bold text-emerald-600">
                  {itemA.matchBreakdown.mandatoryRequirements?.satisfied ? '충족' : '일부 미충족'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-600">주요 강점</h4>
            <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {itemA.strengths.slice(0, 2).map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Item B */}
        <div className={`${cardClass} space-y-6`}>
          <div
            className={`flex items-center justify-between border-b pb-4 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                    : 'text-purple-700 bg-purple-50 border-purple-200'
                }`}
              >
                {itemB.jobPosting.company}
              </span>
              <h3 className={`text-lg font-bold mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {itemB.jobPosting.role}
              </h3>
            </div>
            <button
              onClick={() => {
                setCurrentResult(itemB);
                setActivePage('result');
              }}
              className="text-xs text-purple-600 hover:underline font-bold"
            >
              상세보기
            </button>
          </div>

          <div className="flex justify-center py-2">
            <ScoreGauge score={itemB.jobFitScore} size={170} strokeWidth={12} />
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="font-bold text-purple-600">예상 경쟁력</span>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              {itemB.estimatedCompetitiveness.level}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              항목별 점수
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>기술 스택 일치</span>
                <span className="font-bold font-mono text-purple-600">
                  {itemB.matchBreakdown.techStackMatch?.score ?? 0}점
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>프로젝트 일치</span>
                <span className="font-bold font-mono text-purple-600">
                  {itemB.matchBreakdown.projectExperienceMatch?.score ?? 0}점
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>필수 요건 충족</span>
                <span className="font-bold text-emerald-600">
                  {itemB.matchBreakdown.mandatoryRequirements?.satisfied ? '충족' : '일부 미충족'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-600">주요 강점</h4>
            <ul className={`space-y-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {itemB.strengths.slice(0, 2).map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
