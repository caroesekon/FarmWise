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
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/livestock', icon: Beef, label: 'Livestock' },
  { to: '/health', icon: Heart, label: 'Health' },
  { to: '/vaccinations', icon: Syringe, label: 'Vaccinations' },
  { to: '/production', icon: Milk, label: 'Production' },
  { to: '/breeding', icon: GitBranch, label: 'Breeding' },
  { to: '/fields', icon: Wheat, label: 'Fields' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/equipment', icon: Wrench, label: 'Equipment' },
  { to: '/finances', icon: DollarSign, label: 'Finances' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/tasks', icon: ClipboardList, label: 'Tasks' },
  { to: '/weather', icon: Cloud, label: 'Weather' },
];

export default function Sidebar({ open }) {
  const { farm } = useAuth();

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
              clsx(
                'sidebar-link',
                isActive && 'active'
              )
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 space-y-1">
        <NavLink to="/ai" className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
          <span className="text-lg flex-shrink-0">🤖</span>
          {open && <span>AI Assistant</span>}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
          <Settings className="h-5 w-5 flex-shrink-0" />
          {open && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}