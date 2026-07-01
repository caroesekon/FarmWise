import { formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Stethoscope, Syringe, Heart, Activity, Layers } from 'lucide-react';

const typeIcons = {
  diagnosis: Stethoscope,
  treatment: Syringe,
  vet_visit: Heart,
  deworming: Activity,
  hoof_trimming: Activity,
  injury: Heart,
  surgery: Stethoscope,
  other: Activity,
};

const severityBadge = {
  mild: 'info',
  moderate: 'warning',
  severe: 'warning',
  critical: 'danger',
};

export default function HealthRecordList({ records, batchSummary, viewMode }) {
  if (viewMode === 'batch') {
    if (!batchSummary?.length) {
      return (
        <div className="text-center py-12 text-gray-400">
          <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No batch health records yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {batchSummary.map((b, i) => (
          <div key={i} className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{b.type?.replace('_', ' ')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {b.diagnosis || 'No diagnosis'} · {b.count} animals · {formatDate(b.date)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!records?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No health records yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const Icon = typeIcons[record.type] || Activity;
        return (
          <div key={record._id} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
            <div className={`p-2 rounded-lg ${record.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <Icon className={`h-5 w-5 ${record.severity === 'critical' ? 'text-red-500' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-white capitalize">{record.type.replace('_', ' ')}</span>
                {record.severity && <Badge variant={severityBadge[record.severity]}>{record.severity}</Badge>}
              </div>
              {record.diagnosis && <p className="text-sm text-gray-600 dark:text-gray-300">{record.diagnosis}</p>}
              {record.treatment && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{record.treatment}</p>}
              {record.medication?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {record.medication.map((med, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{med.name}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>{formatDate(record.date)}</span>
                {record.vetName && <span>Vet: {record.vetName}</span>}
                {record.cost && <span>KES {record.cost}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}