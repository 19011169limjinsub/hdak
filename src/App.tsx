/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { JobInputPage } from './pages/JobInputPage';
import { AnalyzingPage } from './pages/AnalyzingPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { ComparePage } from './pages/ComparePage';

const AppContent: React.FC = () => {
  const { activePage, theme } = useApp();

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'profile' && <ProfileEditPage />}
        {activePage === 'job-input' && <JobInputPage />}
        {activePage === 'analyzing' && <AnalyzingPage />}
        {activePage === 'result' && <ResultPage />}
        {activePage === 'history' && <HistoryPage />}
        {activePage === 'compare' && <ComparePage />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
