import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Search, GraduationCap } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { authUtils } from '../../utils/auth';

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authUtils.getUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!currentUser) {
    return (
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="flex items-center justify-center h-16 px-4 lg:px-6">
          <p className="text-zinc-400">Loading...</p>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-zinc-400 hover:bg-zinc-800 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white hidden sm:block text-lg">LearnPath</span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search courses, topics..."
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 text-zinc-400 hover:bg-zinc-800 rounded-xl transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button className="relative p-2 text-zinc-400 hover:bg-zinc-800 rounded-xl transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-zinc-950" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Avatar src={currentUser?.avatar} name={currentUser?.name || 'User'} size="sm" />
              <span className="hidden sm:block text-sm font-medium text-zinc-300">{currentUser?.name?.split(' ')[0] || 'User'}</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 py-2">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="font-medium text-white">{currentUser?.name || 'User'}</p>
                  <p className="text-sm text-zinc-500">{currentUser?.email || ''}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">Profile</Link>
                {currentUser?.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">Admin Panel</Link>
                )}
                <hr className="my-2 border-zinc-800" />
                <button 
                  onClick={() => {
                    authUtils.clearAuth();
                    navigate('/login');
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
