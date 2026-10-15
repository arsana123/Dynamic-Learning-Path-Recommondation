import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, TrendingUp, User, X, Shield, Sun, Moon } from 'lucide-react';
import { authUtils } from '../../utils/auth';
import { useTheme } from '../../utils/ThemeContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Admin Panel' },
];

export default function Sidebar({ isOpen, onClose }) {
  const currentUser = authUtils.getUser();
  const isAdmin = currentUser?.role === 'admin';
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-0 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-zinc-950 lg:bg-transparent border-r border-zinc-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-zinc-800">
          <span className="font-semibold text-white">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-xl transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <div className="pt-6 mt-6 border-t border-zinc-800">
              <p className="px-4 mb-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Admin</p>
              {adminItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 dark:border-zinc-800">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-white dark:text-zinc-400 dark:hover:text-white rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </div>
            <div className={`w-11 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-teal-500' : 'bg-zinc-600'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
