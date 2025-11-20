import { useState } from 'react';
import { Mail, LayoutDashboard, History, Settings, Sparkles, Zap } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { EmailAnalyzer } from './components/EmailAnalyzer';
import { Dashboard } from './components/Dashboard';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';

type Page = 'analyzer' | 'dashboard' | 'history' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('analyzer');

  const menuItems = [
    { id: 'analyzer' as Page, label: 'Email Analyzer', icon: Mail },
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history' as Page, label: 'History', icon: History },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'analyzer':
        return <EmailAnalyzer />;
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <EmailAnalyzer />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 relative z-10">
        <div className="h-full glass-effect-strong rounded-r-3xl p-6 flex flex-col border-r border-white/10">
          {/* Logo */}
          <div className="mb-8 relative">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  InsightMail
                </h1>
                <p className="text-xs text-white/60 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  AI-Powered
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-100"></div>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    </>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-2xl"></div>
                  )}
                  <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-8 bg-white/50 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="glass-effect rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>
              <div className="text-xs text-white/40">
                AI Model: Gemini Pro
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="h-full animate-slide-in">
          {renderPage()}
        </div>
      </main>
      
      <Toaster 
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
