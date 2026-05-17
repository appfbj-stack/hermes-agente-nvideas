import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot,
  Calendar,
  Briefcase,
  Settings, 
  LogOut,
  Bell,
  Menu,
  X,
  Users,
  Flag,
  Building2,
  Shield,
  BookOpen,
  Wrench
} from 'lucide-react';
import { cn } from './SuperAdminLayout';
import { useAuthStore } from '../../store/authStore';

export const TenantLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, appModule, role, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock tenant name for now
  const tenantName = "Acme Corp";

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Define links dinamicamente baseado no módulo do Tenant
  const getSidebarLinks = () => {
    const baseLinks = [
      { name: 'Painel', path: '/t', icon: LayoutDashboard },
      { name: 'Hermes IA', path: '/t/chat', icon: Bot },
    ];

    const configLinks = [
      { name: 'Configurações', path: '/t/settings', icon: Settings },
    ];

    if (role === 'superadmin') {
      configLinks.push({ name: 'Admin Master', path: '/admin/tenants', icon: Shield });
    }

    if (role === 'superadmin') {
      return [
        ...baseLinks,
        { name: 'CRM Eleitoral', path: '/t/crm', icon: Users },
        { name: 'Agenda Política', path: '/t/calendar', icon: Calendar },
        { name: 'Lideranças', path: '/t/liderancas', icon: Flag },
        { name: 'Gabinete Digital', path: '/t/gabinete', icon: Building2 },
        { name: 'Oficina Mecânica', path: '/t/oficina', icon: Wrench },
        { name: 'Agenda Pastoral', path: '/t/pastoral', icon: BookOpen },
        { name: 'Bíblia', path: '/t/biblia', icon: BookOpen },
        ...configLinks
      ];
    }

    if (appModule === 'geral') {
      return [
        ...baseLinks,
        ...configLinks
      ];
    }

    if (appModule === 'politica') {
      return [
        ...baseLinks,
        { name: 'CRM Eleitoral', path: '/t/crm', icon: Users },
        { name: 'Agenda Política', path: '/t/calendar', icon: Calendar },
        { name: 'Lideranças', path: '/t/liderancas', icon: Flag },
        { name: 'Gabinete Digital', path: '/t/gabinete', icon: Building2 },
        ...configLinks
      ];
    }

    if (appModule === 'oficina') {
      return [
        ...baseLinks,
        { name: 'Oficina Mecânica', path: '/t/oficina', icon: Wrench },
        { name: 'Agenda', path: '/t/calendar', icon: Calendar },
        ...configLinks
      ];
    }

    if (appModule === 'igreja') {
      return [
        ...baseLinks,
        { name: 'Agenda Pastoral', path: '/t/pastoral', icon: BookOpen },
        { name: 'Bíblia', path: '/t/biblia', icon: BookOpen },
        ...configLinks
      ];
    }

    // Default fallback
    return baseLinks;
  };

  const SIDEBAR_LINKS = getSidebarLinks();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 glass-panel border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-light to-secondary/30 flex items-center justify-center font-bold text-xs border border-white/10">
              {tenantName.substring(0, 2).toUpperCase()}
            </div>
            <h1 className="text-lg font-bold tracking-tight truncate">
              {tenantName}
            </h1>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={closeMobileMenu}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Plano Atual</p>
            <p className="text-sm font-medium text-purple-400">Enterprise</p>
            <div className="mt-2 w-full bg-black/40 rounded-full h-1.5">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">45k / 100k msgs</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            // Strict exact match for root '/t', otherwise includes match
            const isActive = link.path === '/t' ? location.pathname === '/t' : location.pathname.startsWith(link.path);
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-secondary/20 text-white border border-secondary/30 shadow-[0_0_15px_rgba(123,104,238,0.15)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} className={isActive ? "text-secondary-light" : ""} />
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        {/* Header */}
        <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center text-sm text-gray-400 hidden sm:flex">
              {/* Breadcrumb or title could go here */}
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-gray-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-xs sm:text-sm font-bold uppercase">
                {user?.email?.substring(0, 2) || 'US'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto relative z-0 pb-16 lg:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 flex items-center justify-around px-2 pb-safe z-40 bg-background/80 backdrop-blur-xl">
        {SIDEBAR_LINKS.slice(0, 4).map((link) => {
          const Icon = link.icon;
          const isActive = link.path === '/t' ? location.pathname === '/t' : location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex flex-col items-center gap-1 p-3 min-w-[64px] transition-colors relative",
                isActive ? "text-secondary-light" : "text-gray-500 hover:text-gray-300"
              )}
            >
              {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-secondary rounded-b-full"></div>}
              <Icon size={20} />
              <span className="text-[10px] font-medium truncate w-full text-center">{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        {/* Admin Master direct link for mobile */}
        <Link
          to="/admin/tenants"
          className="flex flex-col items-center gap-1 p-3 min-w-[64px] transition-colors text-gray-500 hover:text-secondary-light"
        >
          <Shield size={20} />
          <span className="text-[10px] font-medium truncate w-full text-center">Admin</span>
        </Link>
      </nav>
    </div>
  );
};