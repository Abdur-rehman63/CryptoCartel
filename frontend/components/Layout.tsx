
import React from 'react';
import { User, UserRole } from '../types';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  if (!user) return <div className="min-h-screen">{children}</div>;

  const isAdmin = user.role === UserRole.ADMIN;

  const NavItem = ({ id, label }: { id: string, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
        activeTab === id 
          ? 'bg-[#2b3139] text-[#fcd535] border-l-4 border-[#fcd535]' 
          : 'text-[#848e9c] hover:bg-[#2b3139] hover:text-white'
      }`}
    >
      <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0b0e11] overflow-hidden text-[#eaecef]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#12161c] border-r border-[#2b3139] flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="bg-[#fcd535] p-1 rounded">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
              </svg>
            </div>
            <span className="text-white">CryptoPort</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          {isAdmin ? (
            <>
              <NavItem id="overview" label="Dashboard" />
              <NavItem id="clients" label="Clients" />
              <NavItem id="announcements" label="Announcements" />
            </>
          ) : (
            <>
              <NavItem id="dashboard" label="Dashboard" />
              <NavItem id="coins" label="My Coins" />
              <NavItem id="reports" label="Reports" />
              <NavItem id="announcements" label="Comments" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-[#2b3139]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 text-[#848e9c] hover:text-red-400 transition-colors"
          >
            <span className="text-sm font-medium uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0b0e11]">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-[#12161c] border-b border-[#2b3139]">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search markets, features..." 
                className="w-full bg-[#1e2329] border border-transparent focus:border-[#fcd535] rounded-md py-1.5 px-4 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-4">
            <button className="text-[#848e9c] hover:text-white relative">
              <span className="text-xs font-bold">ALERTS</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#fcd535] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[#2b3139] pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#848e9c] uppercase tracking-wider">Verified Account</p>
              </div>
              <div className="w-8 h-8 rounded-md bg-[#2b3139] flex items-center justify-center text-[#fcd535] font-bold">
                {user.name[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
