import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Blocks, 
  Settings, 
  LogOut,
  BrainCircuit
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '../../store/authStore';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const SIDEBAR_LINKS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Tenants', path: '/admin/tenants', icon: Users },
  { name: 'Modules', path: '/admin/modules', icon: Blocks },
  { name: 'AI Config', path: '/admin/ai-config', icon: BrainCircuit },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const SuperAdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-white/10 flex flex-col z-10 relative">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg shadow-secondary/20">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Hermes <span className="neon-text-primary">SaaS</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-secondary/20 text-white border border-secondary/30 shadow-[0_0_15px_rgba(123,104,238,0.15)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={20} className={isActive ? "text-secondary-light" : ""} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-8 z-10">
          <div className="flex items-center text-sm text-gray-400">
            <span className="bg-primary-light px-2 py-1 rounded-md text-xs font-mono border border-white/5">
              SUPERADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-white">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-sm font-bold uppercase">
              {user?.email?.substring(0, 2) || 'SA'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};