import clsx from 'clsx';

const colors = {
  primary: 'text-primary-600 bg-primary-50 dark:bg-primary-950',
  green: 'text-green-600 bg-green-50 dark:bg-green-950',
  red: 'text-red-600 bg-red-50 dark:bg-red-950',
  yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950',
  blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
};

export default function StatCard({ icon: Icon, label, value, sub, subValue, color = 'primary' }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={clsx('p-2.5 rounded-lg', colors[color])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          {sub && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
          )}
          {subValue && (
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}