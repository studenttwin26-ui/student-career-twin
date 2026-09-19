import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserPlus, 
  Briefcase, 
  FileSearch, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/faculty', label: 'Faculty Management', icon: Building2 },
    { to: '/admin/students', label: 'Student Management', icon: Users },
    { to: '/admin/assignments', label: 'Cohort Assignments', icon: UserPlus },
    { to: '/admin/companies', label: 'Corporate Criteria', icon: Briefcase },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileSearch },
    { to: '/admin/settings', label: 'System & Firebase', icon: Settings }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-white shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {/* Admin Mini Profile */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{currentUser?.fullName}</h4>
              <p className="text-[11px] text-slate-400 truncate">Placement Directorate</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden pb-12">
        <Outlet />
      </main>
    </div>
  );
};
