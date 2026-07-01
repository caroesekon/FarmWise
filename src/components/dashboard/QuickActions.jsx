import { useNavigate } from 'react-router-dom';
import { Plus, Syringe, Milk, ClipboardList } from 'lucide-react';

const actions = [
  { label: 'Add Animal', icon: Plus, to: '/livestock' },
  { label: 'Record Milk', icon: Milk, to: '/production' },
  { label: 'Schedule Vaccine', icon: Syringe, to: '/vaccinations' },
  { label: 'Create Task', icon: ClipboardList, to: '/tasks' },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map(({ label, icon: Icon, to }) => (
        <button
          key={label}
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
            <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </button>
      ))}
    </div>
  );
}