import { useState } from 'react';
import { Mail, LayoutDashboard, History, Settings } from 'lucide-react';
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">InsightMail AI</h1>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
      
      <Toaster />
    </div>
  );
}