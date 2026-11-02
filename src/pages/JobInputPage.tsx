import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSearch,
  Sparkles,
  Link2,
  AlertCircle,
  ArrowRight,
  Zap,
  CheckCircle2,
  ListFilter,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { SAMPLE_JOB_POSTINGS } from '../mock/samples';
import { JobPosting } from '../types';
import { safeApiCall } from '../utils/apiClient';

export const JobInputPage: React.FC = () => {
  const { jobPosting, setJobPosting, runAnalysis, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'structured'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [urlNotice, setUrlNotice] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [formJob, setFormJob] = useState<JobPosting>(jobPosting);

  const handleSelectPreset = (preset: JobPosting) => {
    setFormJob(preset);
    setJobPosting(preset);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setUrlNotice(true);
    setFormJob((prev) => ({
      ...prev,
      url: urlInput,
      summary: `URL (${urlInput}) 공고 기반 분석`,
    }));
  };

  const handleAiExtract = async () => {
    if (!formJob.rawText.trim() && !formJob.role.trim() && !formJob.company.trim()) {
      alert('먼저 채용 공고 텍스트 또는 기업명/직무명을 입력해주세요.');
      return;
    }
    setIsParsing(true);
    try {
      const res = await safeApiCall<any>('/api/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: formJob.rawText,
          companyName: formJob.company,
          roleTitle: formJob.role,
        }),
      });

      const data = res.data;
      if (!data) {
        throw new Error('공고 추출 데이터를 수신하지 못했습니다.');
      }

      setFormJob((prev) => ({
        ...prev,
        company: data.company || prev.company,
        role: data.role || prev.role,
        experienceRequirement: data.experienceRequirement || prev.experienceRequirement,
        educationRequirement: data.educationRequirement || prev.educationRequirement,
        responsibilities: data.responsibilities || prev.responsibilities,
        mandatorySkills: data.mandatorySkills || prev.mandatorySkills,
        preferredSkills: data.preferredSkills || prev.preferredSkills,
        summary: data.summary || prev.summary,
      }));
      setActiveTab('structured');
    } catch (err: any) {
      console.error('[AI 공고 구조화 오류]:', err);
      alert(`[AI 공고 구조화 오류]\n\n${err?.message || '공고 분석 중 오류가 발생했습니다.'}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleStartAnalysis = async () => {
    setJobPosting(formJob);
    await runAnalysis(formJob);
  };

  const inputClass = isDark
    ? 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500'
    : 'w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs';

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className={`border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2 ${
            isDark
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>채용 공고 등록 및 분석</span>
        </div>
        <h1
          className={`text-2xl md:text-3xl font-black ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          분석하고 싶은 기업의 채용 공고를 입력하세요
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          채용 공고 원문 텍스트, URL, 또는 주요 요구사항을 등록하면 AI가 내 스펙과 정밀 대조하여 적합도를 분석합니다.
        </p>
      </div>

      {/* Preset Quick Select Bar */}
      <div
        className={`p-5 rounded-3xl border space-y-3 ${
          isDark
            ? 'border-indigo-500/30 bg-indigo-950/20'
            : 'border-indigo-100 bg-indigo-50/60 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold flex items-center gap-2 ${
              isDark ? 'text-indigo-300' : 'text-indigo-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            테스트용 추천 채용 공고 프리셋 (클릭 시 자동 로드)
          </span>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            4개 대표 기술 직무
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_JOB_POSTINGS.map((preset) => {
            const isSelected = formJob.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-indigo-600/30 border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-indigo-50 border-indigo-400 shadow-xs ring-2 ring-indigo-400/20'
                    : isDark
                    ? 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      isDark ? 'text-indigo-400' : 'text-indigo-600'
                    }`}
                  >
                    {preset.company.split('/')[0]}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <p
                  className={`text-xs font-bold line-clamp-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {preset.role}
                </p>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {preset.experienceRequirement}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Mode Selector */}
      <div
        className={`flex border-b gap-4 text-sm font-bold ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <button
          onClick={() => setActiveTab('text')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'text'
              ? isDark
                ? 'border-indigo-500 text-white font-bold'
                : 'border-indigo-600 text-indigo-600 font-bold'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>공고 원문 텍스트 직접 입력</span>
        </button>

        <button
          onClick={() => setActiveTab('url')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'url'
              ? isDark
                ? 'border-indigo-500 text-white font-bold'
                : 'border-indigo-600 text-indigo-600 font-bold'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>공고 URL 입력</span>
        </button>

        <button
          onClick={() => setActiveTab('structured')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'structured'
              ? isDark
                ? 'border-indigo-500 text-white font-bold'
                : 'border-indigo-600 text-indigo-600 font-bold'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>추출된 공고 요건 상세</span>
        </button>
      </div>

      {/* Tab 1: Text Direct Input */}
      {activeTab === 'text' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                기업명 *
              </label>
              <input
                type="text"
                value={formJob.company}
                onChange={(e) => setFormJob({ ...formJob, company: e.target.value })}
                placeholder="예: 현대자동차, 네이버클라우드, 토스"
                className={inputClass}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                모집 직무명 *
              </label>
              <input
                type="text"
                value={formJob.role}
                onChange={(e) => setFormJob({ ...formJob, role: e.target.value })}
                placeholder="예: 스마트팩토리 C++ 제어 소프트웨어 개발자"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className={`text-xs font-bold ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                채용 공고 본문 내용 (자격요건, 주요업무, 우대사항 등 복사 붙여넣기) *
              </label>
              <button
                type="button"
                onClick={handleAiExtract}
                disabled={isParsing}
                className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                  isDark
                    ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20'
                    : 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-2xs'
                } disabled:opacity-50`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isParsing ? 'AI 분석/추출 중...' : 'AI로 요건 자동 구조화'}</span>
              </button>
            </div>
            <textarea
              rows={10}
              value={formJob.rawText}
              onChange={(e) => setFormJob({ ...formJob, rawText: e.target.value })}
              placeholder="원티드, 잡코리아, 사람인, 기업 채용 페이지의 공고 본문을 복사해서 그대로 붙여넣으세요.&#10;&#10;예시:&#10;[담당 업무]&#10;- 스마트 제조 라인 제어 SW 설계&#10;[자격 요건]&#10;- C++ 또는 C# 숙련자, 멀티스레딩 지식 보유자&#10;[우대 사항]&#10;- PLC 및 산업용 통신 프로토콜 경험자"
              className={`${inputClass} leading-relaxed font-sans`}
            />
          </div>
        </div>
      )}

      {/* Tab 2: URL Input */}
      {activeTab === 'url' && (
        <div
          className={`p-6 rounded-3xl border space-y-5 ${
            isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div>
            <label
              className={`block text-xs font-bold mb-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              채용 공고 URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://career.example.com/jobs/12345"
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-xs"
              >
                URL 등록
              </button>
            </div>
          </div>

          {urlNotice && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isDark
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>외부 웹페이지 접근 안내</span>
              </div>
              <p className="leading-relaxed">
                일부 채용 플랫폼(원티드, 사람인 등)은 로그인 보안 또는 외부 스크래핑 제한이 걸려 있어 URL 직접 추출이 어려울 수 있습니다.
                정확하고 깊이 있는 직무 적합도 분석을 위해 <strong>[공고 원문 텍스트 직접 입력]</strong> 탭에서 공고 본문을 복사하여 붙여넣어 주시면 100% 완벽한 AI 분석이 가능합니다!
              </p>
              <button
                onClick={() => setActiveTab('text')}
                className="text-xs font-bold text-indigo-600 hover:underline pt-1 block"
              >
                &rarr; 본문 텍스트 붙여넣기 탭으로 이동하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Extracted Requirements Breakdown */}
      {activeTab === 'structured' && (
        <div className="space-y-6">
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formJob.company} - {formJob.role}
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                요구 경력: {formJob.experienceRequirement} | 학력: {formJob.educationRequirement}
              </p>
            </div>
            <button
              onClick={handleAiExtract}
              disabled={isParsing}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>재추출</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mandatory skills */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-xs'
              }`}
            >
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                필수 기술 및 자격 요건 ({formJob.mandatorySkills.length}개)
              </h4>
              <ul
                className={`space-y-2 text-xs ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {formJob.mandatorySkills.map((sk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-mono mt-0.5">•</span>
                    <span>{sk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preferred skills */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-xs'
              }`}
            >
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                우대 사항 ({formJob.preferredSkills.length}개)
              </h4>
              <ul
                className={`space-y-2 text-xs ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {formJob.preferredSkills.map((pref, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600 font-mono mt-0.5">•</span>
                    <span>{pref}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Responsibilities */}
          <div
            className={`p-5 rounded-3xl border space-y-3 ${
              isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-xs'
            }`}
          >
            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              주요 업무 (Responsibilities)
            </h4>
            <ul
              className={`space-y-1.5 text-xs ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {formJob.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-mono mt-0.5">✓</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Start Analysis CTA Box */}
      <div
        className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDark
            ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/60'
            : 'border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3
              className={`font-black text-base md:text-lg ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              준비가 완료되었습니다! 직무 적합도 AI 분석을 실행할까요?
            </h3>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            내 스펙(보유 기술, 프로젝트, 경험)과 공고 요구사항을 Gemini AI가 종합 평가하여 0~100점 점수 및 로드맵을 생성합니다.
          </p>
        </div>

        <button
          onClick={handleStartAnalysis}
          className="w-full md:w-auto px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <span>AI 직무 적합도 분석 시작</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
