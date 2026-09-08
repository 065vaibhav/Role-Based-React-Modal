import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import { hasPermission } from './auth/permissions';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Reports from './pages/Reports';
import Audit from './pages/Audit';
import Settings from './pages/Settings';
import SuperAdmin from './pages/SuperAdmin';
import NotFound from './pages/NotFound';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="boot"><strong>Restoring session…</strong></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function RequirePermission({ permission, children }) {
  const { user } = useAuth();
  if (!user || !hasPermission(user.role, permission)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/team" element={<Team />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/audit" element={<RequirePermission permission="audit.read"><Audit /></RequirePermission>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/super-admin" element={<RequirePermission permission="platform.manage"><SuperAdmin /></RequirePermission>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
