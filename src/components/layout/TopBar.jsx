import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, User, Settings, LogOut, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAlerts } from '../../hooks/useAlerts';
import { getInitials } from '../../utils/formatters';
import clsx from 'clsx';

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { summary } = useAlerts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertDropdownOpen, setAlertDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const alertRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const alertCount = (summary?.critical || 0) + (summary?.high || 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setAlertDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark(!dark);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();

    if (query.includes('animal') || query.includes('cow') || query.includes('chicken') || query.includes('poultry') || query.includes('goat') || query.includes('sheep') || query.includes('pig')) {
      navigate('/livestock');
    } else if (query.includes('health') || query.includes('sick') || query.includes('vet') || query.includes('treatment')) {
      navigate('/health');
    } else if (query.includes('vaccin') || query.includes('injection')) {
      navigate('/vaccinations');
    } else if (query.includes('milk') || query.includes('egg') || query.includes('production') || query.includes('weight')) {
      navigate('/production');
    } else if (query.includes('breed') || query.includes('heat') || query.includes('pregnant') || query.includes('calving')) {
      navigate('/breeding');
    } else if (query.includes('field') || query.includes('crop') || query.includes('plant')) {
      navigate('/fields');
    } else if (query.includes('inventory') || query.includes('stock') || query.includes('feed') || query.includes('medicine')) {
      navigate('/inventory');
    } else if (query.includes('equipment') || query.includes('tractor') || query.includes('machine') || query.includes('tool')) {
      navigate('/equipment');
    } else if (query.includes('money') || query.includes('finance') || query.includes('income') || query.includes('expense') || query.includes('kes')) {
      navigate('/finances');
    } else if (query.includes('team') || query.includes('worker') || query.includes('staff') || query.includes('member')) {
      navigate('/team');
    } else if (query.includes('task') || query.includes('todo') || query.includes('due')) {
      navigate('/tasks');
    } else if (query.includes('weather') || query.includes('rain') || query.includes('temperature')) {
      navigate('/weather');
    } else if (query.includes('ai') || query.includes('assistant') || query.includes('help') || query.includes('chat')) {
      navigate('/ai');
    } else if (query.includes('settings') || query.includes('profile') || query.includes('password')) {
      navigate('/settings');
    } else {
      navigate('/livestock');
    }

    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Menu className="h-5 w-5" />
        </button>

        <div ref={searchRef} className="relative">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search animals, tasks, finances..."
                className="w-64 md:w-80 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="ml-2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 text-sm text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <kbd className="hidden md:inline-block text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded ml-2">Ctrl+K</kbd>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleDark} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative" ref={alertRef}>
          <button
            onClick={() => setAlertDropdownOpen(!alertDropdownOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
          >
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                {alertCount}
              </span>
            )}
          </button>

          {alertDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg py-1 z-50 max-h-80 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {alertCount > 0 ? `${alertCount} Active Alert${alertCount > 1 ? 's' : ''}` : 'No Active Alerts'}
                </p>
              </div>
              {alertCount > 0 ? (
                <button
                  onClick={() => { setAlertDropdownOpen(false); navigate('/'); }}
                  className="w-full text-left px-4 py-3 text-sm text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  View all alerts on Dashboard →
                </button>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">All clear ✅</div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
            <ChevronDown className={clsx('h-4 w-4 text-gray-400 transition-transform hidden sm:block', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || user?.phone}</p>
                <span className="inline-block mt-1 text-xs bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full capitalize">
                  {user?.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}