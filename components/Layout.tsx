
import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Activity as ActivityIcon, Send, Settings, FileText } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.ACTIVITY, label: 'Activity', icon: ActivityIcon },
    { id: View.POSTER, label: 'Poster', icon: Send },
    { id: View.API_MANAGER, label: 'API', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-background border-r border-slate-800 flex-col h-full">
        <div className="p-6 mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-primary">Auto</span>Social
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === View.DASHBOARD && currentView === View.REPLIES);
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-800">
           <button 
             onClick={() => setCurrentView(View.LEGAL)}
             className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${currentView === View.LEGAL ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
           >
              <FileText size={16} /> Terms & Privacy
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-background/90 backdrop-blur-md border-b border-slate-800 z-40 flex items-center justify-center px-4">
        <span className="text-xl font-bold text-white"><span className="text-primary">Auto</span>Social</span>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-background border-t border-slate-800 z-50 pb-safe">
        <div className="flex justify-between items-center h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === View.DASHBOARD && currentView === View.REPLIES);
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 gap-1 transition-colors min-w-[3.5rem] ${
                  isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 pb-24 md:pt-0 md:pb-0 bg-background">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
