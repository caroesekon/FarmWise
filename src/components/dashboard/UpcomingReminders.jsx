import { Calendar, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function UpcomingReminders({ reminders }) {
  if (!reminders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-gray-400">
        <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
        <p className="text-sm">No upcoming reminders</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reminders.map((r, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <Calendar className="h-4 w-4 text-primary-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{r.description}</p>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(r.dueDate)}</span>
        </div>
      ))}
    </div>
  );
}