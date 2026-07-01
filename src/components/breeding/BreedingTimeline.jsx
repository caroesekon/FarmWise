import { formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { GitBranch, Heart, Calendar, Baby } from 'lucide-react';

const eventConfig = {
  heat_observed: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', label: 'Heat Observed' },
  expectedHeat: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', label: 'Expected Heat' },
  insemination: { icon: GitBranch, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', label: 'Insemination' },
  pregnancyCheck: { icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', label: 'Pregnancy Check' },
  pregnancyConfirmed: { icon: Heart, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30', label: 'Pregnant' },
  expectedCalving: { icon: Baby, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30', label: 'Expected Calving' },
  calving: { icon: Baby, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30', label: 'Calving' },
  abortion: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', label: 'Abortion' },
  other: { icon: Calendar, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800', label: 'Other' },
};

function getAnimalTag(record) {
  if (record.animalId && typeof record.animalId === 'object') {
    return record.animalId.tag || 'Unknown';
  }
  return record.animalId || 'Unknown';
}

export default function BreedingTimeline({ records }) {
  if (!records?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No breeding records yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-6">
        {records.map((record) => {
          const config = eventConfig[record.eventType] || eventConfig.other;
          const Icon = config.icon;
          const animalTag = getAnimalTag(record);

          return (
            <div key={record._id} className="relative flex gap-4 pl-14">
              <div className={`absolute left-4 p-1.5 rounded-full ${config.bg} border-2 border-white dark:border-gray-900`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="flex-1 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{config.label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">— {animalTag}</span>
                  </div>
                  <Badge variant={record.status === 'completed' ? 'success' : record.status === 'missed' ? 'danger' : 'warning'}>
                    {record.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  {record.eventDate && <span>Date: {formatDate(record.eventDate)}</span>}
                  {record.expectedDate && <span>Expected: {formatDate(record.expectedDate)}</span>}
                  {record.pregnancyStatus && <span>Pregnancy: {record.pregnancyStatus}</span>}
                  {record.calfCount !== undefined && <span>Calves: {record.calfCount}</span>}
                </div>
                {record.notes && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{record.notes}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}