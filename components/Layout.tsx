
import React, { useState } from 'react';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRoute, setActiveRoute }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: AppRoute.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { id: AppRoute.PLAYBOOK, label: 'The Playbook', icon: '📖' },
    { id: AppRoute.TOOLS, label: 'Compliance Tools', icon: '🛠️' },
    { id: AppRoute.ASSISTANT, label: 'AI Assistant', icon: '🤖' },
    { id: AppRoute.RESOURCES, label: 'Resources', icon: '🔗' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-red-600 p-1.5 rounded-lg">W</span>
              Westonka SpEd
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Playbook Agent</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                    setActiveRoute(item.id);
                    setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${activeRoute === item.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-800">
              <a 
                href="https://15.spedforms.org/0277/" 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
              >
                <span className="text-xl">📊</span>
                <span className="font-medium">SpEd Forms Login</span>
              </a>
            </div>
          </nav>

          <div className="p-4 bg-slate-800/50 m-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-tighter">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-200">Compliance Ready</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:block">
                <span className="text-sm font-bold text-slate-700">Westonka Public Schools (0277)</span>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
               SpEd Department
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
