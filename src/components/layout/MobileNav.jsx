import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cow, Heart, Syringe, Milk, MoreHorizontal } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard },
  { to: '/livestock', icon: Cow },
  { to: '/health', icon: Heart },
  { to: '/vaccinations', icon: Syringe },
  { to: '/production', icon: Milk },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 md:hidden">
      <div className="flex items-center justify-around h-16">
        {links.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`
            }
          >
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
        <button className="flex flex-col items-center gap-1 text-xs text-gray-400">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}