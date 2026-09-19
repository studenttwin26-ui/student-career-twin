import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import { 
  Building2, 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  TrendingUp, 
  FileEdit, 
  LogOut, 
  Menu, 
  X,
  AlertCircle
} from 'lucide-react';

export const FacultyLayout: React.FC = () => {
  const { currentUser, pendingStudentsCount, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/faculty/requests', label: 'Registration Requests', icon: UserCheck, badge: pendingStudentsCount },
    { to: '/faculty/students', label: 'My Students', icon: Users },
    { to: '/faculty/progress', label: 'Cohort Progress', icon: TrendingUp },
    { to: '/faculty/mentoring', label: 'Mentoring & Action Items', icon: FileEdit }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/faculty-login');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {/* Faculty Mini Card */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {currentUser?.fullName?.charAt(0) || 'F'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser?.fullName}</h4>
              <p className="text-[11px] text-slate-500 truncate">{currentUser?.department}</p>
            </div>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs">
            <span className="text-amber-800 font-medium">Pending Approvals:</span>
            <span className="font-extrabold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full text-[11px]">
              {pendingStudentsCount}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Scoped Security Label & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500">
            <span className="font-bold text-slate-700 block">Scoped Access:</span>
            Restricted to {currentUser?.department || 'Assigned Department'} cohort.
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
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
