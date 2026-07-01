import clsx from 'clsx';

export default function StatCard({ icon: Icon, label, value, change, color = 'primary' }) {
  const colors = {
    primary: 'text-primary-600 bg-primary-50 dark:bg-primary-950',
    green: 'text-green-600 bg-green-50 dark:bg-green-950',
    red: 'text-red-600 bg-red-50 dark:bg-red-950',
    yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  };

  return (
    <div className="card p-4">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={clsx('p-3 rounded-lg', colors[color])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={clsx('text-xs mt-1', change.startsWith('+') ? 'text-green-600' : 'text-red-600')}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}