import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Beef,
  Heart,
  Syringe,
  Milk,
  GitBranch,
  Wheat,
  Package,
  Wrench,
  DollarSign,
  Users,
  ClipboardList,
  Cloud,
  Settings,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const allLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { to: '/livestock', icon: Beef, label: 'Livestock', key: 'livestock' },
  { to: '/health', icon: Heart, label: 'Health', key: 'health' },
  { to: '/vaccinations', icon: Syringe, label: 'Vaccinations', key: 'vaccinations' },
  { to: '/production', icon: Milk, label: 'Production', key: 'production' },
  { to: '/breeding', icon: GitBranch, label: 'Breeding', key: 'breeding' },
  { to: '/fields', icon: Wheat, label: 'Fields & Crops', key: 'fields' },
  { to: '/inventory', icon: Package, label: 'Inventory', key: 'inventory' },
  { to: '/equipment', icon: Wrench, label: 'Equipment', key: 'equipment' },
  { to: '/finances', icon: DollarSign, label: 'Finances', key: 'finances' },
  { to: '/team', icon: Users, label: 'Team', key: 'team' },
  { to: '/tasks', icon: ClipboardList, label: 'Tasks', key: 'tasks' },
  { to: '/weather', icon: Cloud, label: 'Weather', key: 'weather' },
  { to: '/reports', icon: FileText, label: 'Reports', key: 'reports' },
];

const roleAccess = {
  farmAdmin: ['dashboard', 'livestock', 'health', 'vaccinations', 'production', 'breeding', 'fields', 'inventory', 'equipment', 'finances', 'team', 'tasks', 'weather', 'reports'],
  manager: ['dashboard', 'livestock', 'health', 'vaccinations', 'production', 'breeding', 'fields', 'inventory', 'equipment', 'finances', 'tasks', 'weather', 'reports'],
  worker: ['dashboard', 'livestock', 'production', 'fields', 'tasks', 'weather'],
  vet: ['dashboard', 'livestock', 'health', 'vaccinations', 'weather'],
};

export default function Sidebar({ open }) {
  const { user, farm } = useAuth();
  const role = user?.role || 'worker';

  const links = role === 'farmAdmin'
    ? allLinks
    : allLinks.filter((l) => roleAccess[role]?.includes(l.key));

  const showSettings = role === 'farmAdmin' || role === 'manager';
  const showAI = role === 'farmAdmin' || role === 'manager';

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-200 flex flex-col',
        open ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <img src="/logo.svg" alt="FarmWise" className="w-8 h-8 flex-shrink-0" />
        {open && (
          <div className="min-w-0">
            <span className="text-lg font-bold text-gray-900 dark:text-white block leading-tight">FarmWise</span>
            {farm?.name && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block truncate leading-tight">
                {farm.name}
              </span>
            )}
          </div>
        )}
      </div>

      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx('sidebar-link', isActive && 'active')
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 space-y-1">
        {showAI && (
          <NavLink to="/ai" className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
            <span className="text-lg flex-shrink-0">🤖</span>
            {open && <span>AI Assistant</span>}
          </NavLink>
        )}
        {showSettings ? (
          <NavLink to="/settings" className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
            <Settings className="h-5 w-5 flex-shrink-0" />
            {open && <span>Settings</span>}
          </NavLink>
        ) : (
          <NavLink to="/settings" className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
            <Settings className="h-5 w-5 flex-shrink-0" />
            {open && <span>Profile</span>}
          </NavLink>
        )}
      </div>
    </aside>
  );
}