import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Calendar, Cloud, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DailyBriefing({ briefing }) {
  if (!briefing) return null;

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Briefing</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{briefing.date}</span>
      </div>

      {briefing.weather && (
        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 mb-4">
          <Cloud className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{briefing.weather.summary}</p>
            {briefing.weather.high && (
              <p className="text-xs text-blue-500">
                {briefing.weather.high}°C / {briefing.weather.low}°C
                {briefing.weather.rainfall ? ` · Rain: ${briefing.weather.rainfall}mm` : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {briefing.criticalActions?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" />
            Needs Action Today
          </h3>
          <div className="space-y-2">
            {briefing.criticalActions.map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                <Badge variant={a.level === 'critical' ? 'danger' : 'warning'}>{a.level}</Badge>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{a.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {briefing.upcoming?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Upcoming</h3>
          <div className="space-y-2">
            {briefing.upcoming.map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Badge variant="warning">upcoming</Badge>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{a.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {briefing.snapshot && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <TrendingUp className="h-4 w-4" />
          <span>
            {briefing.snapshot.milk && `Milk: ${briefing.snapshot.milk.today}L`}
            {briefing.snapshot.eggs && ` · Eggs: ${briefing.snapshot.eggs.today}`}
          </span>
        </div>
      )}
    </Card>
  );
}