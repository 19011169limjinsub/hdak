import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Trash2,
  GitCompare,
  ArrowRight,
  Search,
  FileSearch,
} from 'lucide-react';
import { AnalysisResult } from '../types';

export const HistoryPage: React.FC = () => {
  const {
    analysisResults,
    setCurrentResult,
    deleteHistoryItem,
    clearHistory,
    setActivePage,
    compareIds,
    toggleCompareId,
    theme,
  } = useApp();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = analysisResults.filter(
    (item) =>
      item.jobPosting.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jobPosting.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenResult = (item: AnalysisResult) => {
    setCurrentResult(item);
    setActivePage('result');
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
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
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>분석 이력 보관함</span>
          </div>
          <h1
            className={`text-2xl md:text-3xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            직무 적합도 분석 기록 ({analysisResults.length}건)
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            지금까지 AI로 분석한 채용 공고와 적합도 결과를 다시 확인하고, 2개 공고를 선택하여 비교할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {compareIds.length > 0 && (
            <button
              onClick={() => setActivePage('compare')}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/25"
            >
              <GitCompare className="w-4 h-4" />
              <span>선택 공고 비교 ({compareIds.length}/2)</span>
            </button>
          )}

          {analysisResults.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('모든 분석 기록을 삭제하시겠습니까?')) {
                  clearHistory();
                }
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                isDark
                  ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-slate-800'
                  : 'text-slate-600 hover:text-red-600 hover:bg-red-50 border-slate-200'
              }`}
            >
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      {analysisResults.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="기업명 또는 직무명으로 검색..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 shadow-2xs ${
              isDark
                ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500'
                : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      )}

      {/* History List or Empty */}
      {filtered.length === 0 ? (
        <div
          className={`p-12 text-center rounded-3xl border space-y-4 ${
            isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
              isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <History className="w-7 h-7" />
          </div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {searchQuery ? '검색 결과와 일치하는 분석 기록이 없습니다.' : '아직 저장된 분석 기록이 없습니다.'}
          </h3>
          <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            채용 공고를 입력하여 첫 직무 적합도 분석을 실행해보세요. 분석된 모든 결과는 이곳에 안전하게 보관됩니다.
          </p>
          <button
            onClick={() => setActivePage('job-input')}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 mx-auto transition-all shadow-md shadow-indigo-600/25"
          >
            <FileSearch className="w-4 h-4" />
            <span>채용 공고 분석 시작</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isCompared = compareIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                  isDark
                    ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Score badge */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-lg shrink-0 border ${
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
                    <span className="text-[10px] font-normal text-slate-400 -mt-1">점</span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          isDark
                            ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                            : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                        }`}
                      >
                        {item.jobPosting.company}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                          isDark
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.estimatedCompetitiveness.level}
                      </span>
                      <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenResult(item)}
                      className={`font-bold text-base transition-colors cursor-pointer line-clamp-1 ${
                        isDark ? 'text-white hover:text-indigo-300' : 'text-slate-900 hover:text-indigo-600'
                      }`}
                    >
                      {item.jobPosting.role}
                    </h3>

                    <p className={`text-xs line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.scoreRationale}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={`flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 justify-between md:justify-end ${
                    isDark ? 'border-slate-800/60' : 'border-slate-100'
                  }`}
                >
                  <button
                    onClick={() => toggleCompareId(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCompared
                        ? 'bg-purple-600 text-white'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-purple-600/30 border border-slate-700'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>{isCompared ? '비교함 담김' : '비교 선택'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenResult(item)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition-all shadow-2xs"
                  >
                    <span>상세 리포트</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                        : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title="기록 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
