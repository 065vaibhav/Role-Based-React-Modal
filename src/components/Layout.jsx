import { Bell, ChevronDown, LayoutDashboard, BriefcaseBusiness, Users, ClipboardList, Activity, Settings, ShieldAlert, LogOut, Menu, Search, ShieldCheck, Server, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission, roles } from '../auth/permissions';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, permission: 'workspace.read' },
  { to: '/projects', label: 'Projects', icon: BriefcaseBusiness, permission: 'projects.read' },
  { to: '/team', label: 'Team & Access', icon: Users, permission: 'team.read' },
  { to: '/reports', label: 'Reports', icon: ClipboardList, permission: 'reports.read' },
  { to: '/audit', label: 'Audit Log', icon: Activity, permission: 'audit.read' },
  { to: '/settings', label: 'Settings', icon: Settings, permission: 'settings.manage' },
  { to: '/super-admin', label: 'Platform Control', icon: ShieldAlert, permission: 'platform.manage', alert: true },
];

function pageTitle(pathname) {
  const map = {
    '/dashboard': 'Overview',
    '/projects': 'Projects',
    '/team': 'Team & Access',
    '/reports': 'Reports',
    '/audit': 'Audit Log',
    '/settings': 'Settings',
    '/super-admin': 'Platform Control',
  };
  return map[pathname] || 'Portal';
}

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const visibleItems = navItems.filter((item) => hasPermission(user.role, item.permission));
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2);

  function logout() {
    signOut();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-mark"><ShieldCheck size={18} /></div>
            <span>Northstar</span>
          </div>
          <button type="button" className="icon-btn mobile-only" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">{user.role === 'super_admin' ? 'PL' : 'NS'}</div>
          <div>
            <strong>{user.role === 'super_admin' ? 'Platform Console' : 'Acme Workspace'}</strong>
            <span>{roles[user.role].label}</span>
          </div>
          <ChevronDown size={15} />
        </div>

        <nav>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                <Icon size={17} />
                <span>{item.label}</span>
                {item.alert ? <span className="nav-dot red" /> : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="mini-stat">
            <Server size={16} />
            <div>
              <span>API health</span>
              <strong>99.995%</strong>
            </div>
            <span className="health-dot" />
          </div>

          <button type="button" className="profile-row" onClick={() => navigate('/settings')}>
            <div className="avatar">{initials}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{roles[user.role].label}</span>
            </div>
            <ChevronDown size={14} />
          </button>

          <button type="button" className="profile-row logout-row" onClick={logout}>
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button type="button" className="icon-btn desktop-hide" onClick={() => setIsOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">Northstar <span>/</span> <strong>{pageTitle(location.pathname)}</strong></div>
          <div className="top-actions">
            <div className="search-pill">
              <Search size={16} />
              <input placeholder="Search workspace" aria-label="Search workspace" />
            </div>
            <button type="button" className="icon-btn notification" aria-label="Notifications">
              <Bell size={18} />
              <span />
            </button>
            <button type="button" className="avatar top-avatar" onClick={() => navigate('/settings')}>
              {user.name[0]}
            </button>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
