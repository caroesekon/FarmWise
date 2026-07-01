import { AlertTriangle, Bell, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';

const levelBadge = {
  critical: 'danger',
  high: 'warning',
  medium: 'warning',
  info: 'info',
};

export default function AlertList({ alerts }) {
  if (!alerts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
        <p className="text-sm">All clear. No active alerts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert._id}
          className={`flex items-start gap-3 p-3 rounded-lg border ${
            alert.level === 'critical'
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              : alert.level === 'high'
              ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
              : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
          }`}
        >
          {alert.level === 'critical' ? (
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <Bell className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant={levelBadge[alert.level]}>{alert.level}</Badge>
              <span className="text-xs text-gray-400">{formatDate(alert.createdAt)}</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{alert.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{alert.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}