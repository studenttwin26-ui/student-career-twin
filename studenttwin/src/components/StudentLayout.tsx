import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  ClipboardCheck, 
  FileText, 
  MessagesSquare, 
  Compass, 
  Building, 
  Crosshair, 
  User, 
  LogOut, 
  Menu, 
  X,
  Award
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { studentProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/career-twin', label: 'My Career Twin', icon: Sparkles },
    { to: '/student/assessments', label: 'Assessments', icon: ClipboardCheck },
    { to: '/student/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { to: '/student/mock-interview', label: 'Mock Interview', icon: MessagesSquare },
    { to: '/student/roadmap', label: 'Learning Roadmap', icon: Compass },
    { to: '/student/companies', label: 'Companies', icon: Building },
    { to: '/student/placement-simulator', label: 'Placement Simulator', icon: Crosshair },
    { to: '/student/profile', label: 'Profile', icon: User }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/student-login');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {/* Student Mini Card */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {studentProfile?.fullName?.charAt(0) || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{studentProfile?.fullName}</h4>
              <p className="text-[11px] text-slate-500 truncate">{studentProfile?.rollNumber} • {studentProfile?.department}</p>
            </div>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-600" /> Readiness:
            </span>
            <span className="font-extrabold text-indigo-700">{studentProfile?.readinessScore || 0}/100</span>
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
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center p-1.5 text-[10px] font-medium text-slate-500"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>

      {/* Mobile Modal Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-72 bg-white h-full p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900">Student Twin Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden pb-20 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
};
