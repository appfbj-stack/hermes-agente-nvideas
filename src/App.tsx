import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout';
import { TenantLayout } from './components/layout/TenantLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Tenants } from './pages/admin/Tenants';
import { Modules } from './pages/admin/Modules';
import { AiConfig } from './pages/admin/AiConfig';
import { AdminSettings } from './pages/admin/Settings';
import { TenantDashboard } from './pages/tenant/Dashboard';
import { HermesChat } from './pages/tenant/Chat';
import { TenantCrm } from './pages/tenant/Crm';
import { TenantCalendar } from './pages/tenant/Calendar';
import { Pastoral } from './pages/tenant/Pastoral';
import { OficinaMecanica } from './pages/tenant/Oficina';
import { TenantSettings } from './pages/tenant/Settings';
import { Login } from './pages/auth/Login';
import { useAuthStore } from './store/authStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'superadmin' | 'admin' }) => {
  const { user, role, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-primary flex items-center justify-center"><div className="animate-pulse text-secondary">Carregando sessão...</div></div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // DESATIVADO TEMPORARIAMENTE PARA DEMONSTRAÇÃO:
  // Permite que qualquer usuário teste tanto a visão de Tenant quanto a visão de SuperAdmin.
  /*
  if (allowedRole && role !== allowedRole) {
    // Redirect to their appropriate dashboard if they try to access the wrong one
    return <Navigate to={role === 'superadmin' ? '/admin' : '/t'} replace />;
  }
  */

  return <>{children}</>;
};

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Login />} />
        
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* Superadmin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="superadmin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="modules" element={<Modules />} />
          <Route path="ai-config" element={<AiConfig />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Tenant Portal Routes */}
        <Route path="/t" element={
          <ProtectedRoute allowedRole="admin">
            <TenantLayout />
          </ProtectedRoute>
        }>
          <Route index element={<TenantDashboard />} />
          <Route path="chat" element={<HermesChat />} />
          <Route path="calendar" element={<TenantCalendar />} />
          <Route path="crm" element={<TenantCrm />} />
          <Route path="pastoral" element={<Pastoral />} />
          <Route path="oficina" element={<OficinaMecanica />} />
          <Route path="settings" element={<TenantSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;