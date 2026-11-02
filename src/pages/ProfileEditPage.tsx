import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  FileText,
  Plus,
  Trash2,
  Save,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_PROFILES } from '../mock/samples';
import { SkillCategory, SkillProficiency } from '../types';

const POPULAR_SKILLS = [
  { name: 'C++', category: 'language' },
  { name: 'C#', category: 'language' },
  { name: 'Java', category: 'language' },
  { name: 'Python', category: 'language' },
  { name: 'TypeScript', category: 'language' },
  { name: 'React', category: 'framework' },
  { name: 'Spring Boot', category: 'framework' },
  { name: '.NET / WPF', category: 'framework' },
  { name: 'SQL', category: 'database' },
  { name: 'MySQL / PostgreSQL', category: 'database' },
  { name: 'Redis', category: 'database' },
  { name: 'Docker', category: 'infra' },
  { name: 'Linux', category: 'infra' },
  { name: 'PLC / 모션제어', category: 'domain' },
  { name: 'TCP/IP Socket', category: 'domain' },
  { name: 'Git', category: 'tools' },
  { name: 'AWS', category: 'infra' },
];

export const ProfileEditPage: React.FC = () => {
  const { profile, setProfile, setActivePage, theme } = useApp();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState(profile);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('language');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillProficiency>('중급');

  const handleSave = () => {
    setProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = SAMPLE_PROFILES.find((p) => p.id === presetId);
    if (preset) {
      setFormData(preset);
      setProfile(preset);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  const addSkill = (name: string, category: SkillCategory = 'language', level: SkillProficiency = '중급') => {
    if (!name.trim()) return;
    const exists = formData.skills.some((s) => s.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) return;

    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: 'skill-' + Date.now() + Math.random().toString(36).substring(2, 5),
          name: name.trim(),
          category,
          level,
        },
      ],
    }));
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const updateSkillLevel = (id: string, level: SkillProficiency) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, level } : s)),
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: 'proj-' + Date.now(),
          title: '',
          role: '',
          duration: '',
          techStack: [],
          description: '',
          keyAchievements: [''],
        },
      ],
    }));
  };

  const removeProject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const addCareer = () => {
    setFormData((prev) => ({
      ...prev,
      careers: [
        ...prev.careers,
        {
          id: 'car-' + Date.now(),
          company: '',
          role: '',
          period: '',
          type: '인턴',
          description: '',
        },
      ],
    }));
  };

  const removeCareer = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      careers: prev.careers.filter((c) => c.id !== id),
    }));
  };

  const addCertificate = () => {
    setFormData((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        {
          id: 'cert-' + Date.now(),
          name: '',
          issuer: '',
          date: '',
        },
      ],
    }));
  };

  const removeCertificate = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id),
    }));
  };

  const inputClass = isDark
    ? 'w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500'
    : 'w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs';

  const sectionClass = `p-6 rounded-3xl border transition-all ${
    isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-xs'
  }`;

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header & Actions */}
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
            <User className="w-3.5 h-3.5" />
            <span>내 스펙 관리 & 역량 프로필</span>
          </div>
          <h1
            className={`text-2xl md:text-3xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            사용자 스펙 & 이력 정보 입력
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            입력된 스펙은 브라우저에 안전하게 저장되며, 다양한 채용 공고와 반복 비교 분석할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>스펙 저장</span>
          </button>
          <button
            onClick={() => {
              handleSave();
              setActivePage('job-input');
            }}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all active:scale-95"
          >
            <span>공고 분석하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isSavedNotice && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 transition-all ${
            isDark
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>사용자 스펙이 성공적으로 저장되었습니다. 이제 채용 공고와 분석을 진행할 수 있습니다.</span>
        </div>
      )}

      {/* Preset Loader Banner */}
      <div
        className={`p-4 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
          isDark
            ? 'border-indigo-500/30 bg-indigo-950/20'
            : 'border-indigo-100 bg-indigo-50/60 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              준비된 추천 샘플 스펙 불러오기
            </h4>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              원하는 직무 분야의 샘플 데이터를 선택하면 즉시 채용 공고와의 적합도 테스트가 가능합니다.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {SAMPLE_PROFILES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadPreset(sample.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-indigo-600/40 text-slate-200 hover:text-white border-slate-700'
                  : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200 shadow-2xs'
              }`}
            >
              {sample.name} ({sample.targetJob.split('/')[0].trim()})
            </button>
          ))}
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* 1. 기본 인적사항 & 희망 직무 */}
        <section className={sectionClass}>
          <h2
            className={`text-base font-bold flex items-center gap-2 mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-indigo-600" />
            <span>기본 정보 및 희망 직무</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                이름 / 닉네임 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 홍길동"
                className={inputClass}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                목표 희망 직무 *
              </label>
              <input
                type="text"
                value={formData.targetJob}
                onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}
                placeholder="예: C++ 임베디드 제어 엔지니어, 백엔드 개발자"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* 2. 학력 및 전공 */}
        <section className={sectionClass}>
          <h2
            className={`text-base font-bold flex items-center gap-2 mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>학력 및 전공</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                학교명
              </label>
              <input
                type="text"
                value={formData.education.school}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, school: e.target.value },
                  })
                }
                placeholder="예: 한국대학교"
                className={inputClass}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                학위
              </label>
              <select
                value={formData.education.degree}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, degree: e.target.value },
                  })
                }
                className={inputClass}
              >
                <option value="학사">학사</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
                <option value="전문학사">전문학사</option>
                <option value="고졸">고졸</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                졸업 구분
              </label>
              <select
                value={formData.education.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, status: e.target.value as any },
                  })
                }
                className={inputClass}
              >
                <option value="졸업">졸업</option>
                <option value="졸업예정">졸업예정</option>
                <option value="재학">재학</option>
                <option value="휴학">휴학</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                전공 (복수전공 포함)
              </label>
              <input
                type="text"
                value={formData.education.major}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, major: e.target.value },
                  })
                }
                placeholder="예: 컴퓨터공학, 기계제어공학 복수전공"
                className={inputClass}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                학점 (선택)
              </label>
              <input
                type="text"
                value={formData.education.gpa || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, gpa: e.target.value },
                  })
                }
                placeholder="예: 3.8 / 4.5"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* 3. 보유 기술 스택 & 숙련도 */}
        <section className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>보유 기술 스택 및 숙련도 ({formData.skills.length}개)</span>
            </h2>
          </div>

          {/* Quick Add popular chips */}
          <div>
            <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              클릭하여 빠른 기술 스택 추가:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((sk) => {
                const isAdded = formData.skills.some(
                  (s) => s.name.toLowerCase() === sk.name.toLowerCase()
                );
                return (
                  <button
                    key={sk.name}
                    type="button"
                    onClick={() =>
                      !isAdded && addSkill(sk.name, sk.category as SkillCategory, '중급')
                    }
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isAdded
                        ? isDark
                          ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-slate-800'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : isDark
                        ? 'bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-slate-700'
                        : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    + {sk.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom skill adder */}
          <div
            className={`p-4 rounded-2xl border flex flex-wrap items-center gap-2.5 mt-4 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(newSkillName, newSkillCategory, newSkillLevel);
                }
              }}
              placeholder="직접 기술 스택 입력 (예: Rust, Kubernetes, PLC, Kafka 등)"
              className={`flex-1 min-w-[200px] px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-600'
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />

            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
              className={`px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-slate-300'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <option value="language">프로그래밍 언어</option>
              <option value="framework">프레임워크/라이브러리</option>
              <option value="database">데이터베이스</option>
              <option value="infra">인프라/클라우드/OS</option>
              <option value="domain">도메인 특화 (제어/통신/AI)</option>
              <option value="tools">협업 도구/기타</option>
            </select>

            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillProficiency)}
              className={`px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-slate-300'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <option value="초급">초급 (기초 문법 및 학습)</option>
              <option value="중급">중급 (프로젝트 구현 가능)</option>
              <option value="고급">고급 (실무 최적화 및 능숙)</option>
            </select>

            <button
              type="button"
              onClick={() => addSkill(newSkillName, newSkillCategory, newSkillLevel)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>추가</span>
            </button>
          </div>

          {/* Current Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-4">
            {formData.skills.map((skill) => (
              <div
                key={skill.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  isDark
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-slate-50 border-slate-200/90 shadow-2xs'
                }`}
              >
                <div>
                  <span
                    className={`font-bold text-xs ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-400">{skill.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkillLevel(skill.id, e.target.value as SkillProficiency)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-xl border focus:outline-none ${
                      skill.level === '고급'
                        ? isDark
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : skill.level === '중급'
                        ? isDark
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="초급">초급</option>
                    <option value="중급">중급</option>
                    <option value="고급">고급</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 프로젝트 경험 */}
        <section className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className={`text-base font-bold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                <span>프로젝트 경험 ({formData.projects.length}개)</span>
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                프로젝트에서 담당한 역할과 수치 기반 성과를 구체적으로 작성하면 AI 적합도 점수가 정밀하게 산출됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={addProject}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                isDark
                  ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border-indigo-500/30'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border-indigo-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>프로젝트 추가</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.projects.map((proj, pIdx) => (
              <div
                key={proj.id}
                className={`p-5 rounded-2xl border space-y-3 relative ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    프로젝트 #{pIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      프로젝트명
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[pIdx].title = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      placeholder="예: 산업용 4축 모션 제어 시스템 개발"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      진행 기간
                    </label>
                    <input
                      type="text"
                      value={proj.duration}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[pIdx].duration = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      placeholder="예: 2025.03 ~ 2025.09 (6개월)"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      담당 역할 및 기여도
                    </label>
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[pIdx].role = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      placeholder="예: C++ 코어 알고리즘 구현 (기여도 70%)"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      사용 기술 스택 (쉼표로 구분)
                    </label>
                    <input
                      type="text"
                      value={proj.techStack.join(', ')}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[pIdx].techStack = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFormData({ ...formData, projects: updated });
                      }}
                      placeholder="예: C++, Qt, TCP/IP, Multithreading"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    프로젝트 설명
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[pIdx].description = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    placeholder="프로젝트의 목적과 전체 시스템 구조를 설명해주세요."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    핵심 구현 성과 (줄바꿈으로 구분)
                  </label>
                  <textarea
                    rows={2}
                    value={proj.keyAchievements.join('\n')}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[pIdx].keyAchievements = e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, projects: updated });
                    }}
                    placeholder="예: Ring Buffer 적용으로 통신 지연시간 15ms -> 2ms 단축&#10;멀티스레드 기반 큐 설계로 센서 데이터 유실률 0% 달성"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 경력 및 실무 경험 */}
        <section className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>경력 및 실무 경험 ({formData.careers.length}건)</span>
            </h2>

            <button
              type="button"
              onClick={addCareer}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                isDark
                  ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border-indigo-500/30'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border-indigo-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>경력 추가</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.careers.map((career, cIdx) => (
              <div
                key={career.id}
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      회사명
                    </label>
                    <input
                      type="text"
                      value={career.company}
                      onChange={(e) => {
                        const updated = [...formData.careers];
                        updated[cIdx].company = e.target.value;
                        setFormData({ ...formData, careers: updated });
                      }}
                      placeholder="예: (주)스마트테크"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      담당 직무
                    </label>
                    <input
                      type="text"
                      value={career.role}
                      onChange={(e) => {
                        const updated = [...formData.careers];
                        updated[cIdx].role = e.target.value;
                        setFormData({ ...formData, careers: updated });
                      }}
                      placeholder="예: SW 연구원 인턴"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      근무 형태
                    </label>
                    <select
                      value={career.type}
                      onChange={(e) => {
                        const updated = [...formData.careers];
                        updated[cIdx].type = e.target.value as any;
                        setFormData({ ...formData, careers: updated });
                      }}
                      className={inputClass}
                    >
                      <option value="인턴">인턴</option>
                      <option value="정규직">정규직</option>
                      <option value="계약직">계약직</option>
                      <option value="프리랜서">프리랜서</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      기간
                    </label>
                    <input
                      type="text"
                      value={career.period}
                      onChange={(e) => {
                        const updated = [...formData.careers];
                        updated[cIdx].period = e.target.value;
                        setFormData({ ...formData, careers: updated });
                      }}
                      placeholder="예: 2025.07 ~ 2025.09"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      주요 업무 및 성과
                    </label>
                    <button
                      type="button"
                      onClick={() => removeCareer(career.id)}
                      className="text-xs text-red-500 hover:underline font-bold"
                    >
                      삭제
                    </button>
                  </div>
                  <input
                    type="text"
                    value={career.description}
                    onChange={(e) => {
                      const updated = [...formData.careers];
                      updated[cIdx].description = e.target.value;
                      setFormData({ ...formData, careers: updated });
                    }}
                    placeholder="수행한 실무 업무와 성과를 간략히 입력해주세요."
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. 자격증 & 어학 */}
        <section className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-base font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>자격증 및 어학 성적</span>
            </h2>

            <button
              type="button"
              onClick={addCertificate}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                isDark
                  ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border-indigo-500/30'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border-indigo-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>자격증 추가</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.certificates.map((cert, cIdx) => (
              <div
                key={cert.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...formData.certificates];
                      updated[cIdx].name = e.target.value;
                      setFormData({ ...formData, certificates: updated });
                    }}
                    placeholder="자격증명 (예: 정보처리기사)"
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...formData.certificates];
                        updated[cIdx].issuer = e.target.value;
                        setFormData({ ...formData, certificates: updated });
                      }}
                      placeholder="발급처 (예: 한국산업인력공단)"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={cert.score || ''}
                      onChange={(e) => {
                        const updated = [...formData.certificates];
                        updated[cIdx].score = e.target.value;
                        setFormData({ ...formData, certificates: updated });
                      }}
                      placeholder="점수/취득일 (예: 850점, 2025.06)"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeCertificate(cert.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 7. 자유 서술형 자기소개 & 포트폴리오 요약 */}
        <section className={sectionClass}>
          <h2
            className={`text-base font-bold flex items-center gap-2 mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>자기소개 및 직무 역량 요약 (자유 서술)</span>
          </h2>
          <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            자신의 문제 해결 태도, 관심 도메인, 개발 철학 또는 포트폴리오 요약을 자유롭게 적어주세요.
            AI가 채용 공고의 인재상 및 우대 사항과 교차 검증합니다.
          </p>

          <textarea
            rows={4}
            value={formData.freeIntro}
            onChange={(e) => setFormData({ ...formData, freeIntro: e.target.value })}
            placeholder="자신의 핵심 역량과 지원 동기, 강점을 자유롭게 작성해주세요."
            className={`${inputClass} leading-relaxed`}
          />
        </section>
      </div>

      {/* Bottom Floating Save bar */}
      <div
        className={`sticky bottom-4 z-20 p-4 rounded-3xl border shadow-2xl flex items-center justify-between backdrop-blur-md ${
          isDark
            ? 'border-slate-700 bg-slate-900/95'
            : 'border-slate-200/90 bg-white/95 text-slate-800'
        }`}
      >
        <div className={`text-xs hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          스펙을 저장하면 다음 분석부터 자동으로 반영됩니다.
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-all shadow-md shadow-indigo-600/25"
          >
            <Save className="w-4 h-4" />
            <span>스펙 저장 완료</span>
          </button>
          <button
            onClick={() => {
              handleSave();
              setActivePage('job-input');
            }}
            className="px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 transition-all shadow-md shadow-purple-600/25"
          >
            <span>채용 공고 분석으로 이동</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
