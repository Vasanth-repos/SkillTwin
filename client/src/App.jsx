import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SkillTwinProvider, useSkillTwin } from './context/SkillTwinContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import MissionsPage from './pages/MissionsPage';
import ProfileEditorPage from './pages/ProfileEditorPage';
import AdminDashboard from './pages/AdminDashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { loading: twinLoading } = useSkillTwin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-xs font-mono">Initializing SkillTwin Engine...</p>
      </div>
    );
  }

  // Not logged in: Show Landing Page or Auth Page
  if (!user) {
    if (showAuthScreen) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
          <header className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setShowAuthScreen(false)}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              ← Back to Overview
            </button>
          </header>
          <AuthPage />
        </div>
      );
    }
    return <LandingPage onGetStarted={() => setShowAuthScreen(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Top Bar Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Student Views */}
        {user.role === 'STUDENT' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                onNavigateToMissions={() => setActiveTab('missions')}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}
            {activeTab === 'missions' && <MissionsPage />}
            {activeTab === 'profile' && <ProfileEditorPage />}
          </>
        )}

        {/* Administrator Views */}
        {user.role === 'COLLEGE_ADMIN' && (
          <AdminDashboard subView={activeTab === 'admin-students' ? 'students' : 'stats'} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>SkillTwin Digital Career Twin & Evidence Engine • MVP Scope Boundary Realized</p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SkillTwinProvider>
        <AppContent />
      </SkillTwinProvider>
    </AuthProvider>
  );
}
