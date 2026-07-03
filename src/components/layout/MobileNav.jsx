import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beef, Heart, Syringe, Milk, Package } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/livestock', icon: Beef, label: 'Animals' },
  { to: '/health', icon: Heart, label: 'Health' },
  { to: '/production', icon: Milk, label: 'Production' },
  { to: '/inventory', icon: Package, label: 'Stock' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 md:hidden">
      <div className="flex items-center justify-around h-16 safe-bottom">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-medium px-1 ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}