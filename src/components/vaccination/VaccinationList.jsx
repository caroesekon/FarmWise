import { formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Syringe, CheckCircle, Clock, AlertTriangle, UserRound } from 'lucide-react';

const statusConfig = {
  pending: { icon: Clock, variant: 'warning', label: 'Pending' },
  completed: { icon: CheckCircle, variant: 'success', label: 'Completed' },
  overdue: { icon: AlertTriangle, variant: 'danger', label: 'Overdue' },
  skipped: { icon: Clock, variant: 'neutral', label: 'Skipped' },
};

export default function VaccinationList({ vaccinations }) {
  if (!vaccinations?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Syringe className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No vaccinations scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vaccinations.map((vax) => {
        const config = statusConfig[vax.status] || statusConfig.pending;
        const Icon = config.icon;

        return (
          <div key={vax._id} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
            <div className={`p-2 rounded-lg ${
              vax.status === 'completed' ? 'bg-green-50 dark:bg-green-950/30' :
              vax.status === 'overdue' ? 'bg-red-50 dark:bg-red-950/30' :
              'bg-blue-50 dark:bg-blue-950/30'
            }`}>
              <Icon className={`h-5 w-5 ${
                vax.status === 'completed' ? 'text-green-500' :
                vax.status === 'overdue' ? 'text-red-500' :
                'text-blue-500'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-white">{vax.vaccineName}</span>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {vax.animalCount} animal{vax.animalCount > 1 ? 's' : ''} · Due: {formatDate(vax.dueDate)}
              </p>
              {vax.vetName && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <UserRound className="h-3 w-3" />
                  Vet: {vax.vetName}
                </p>
              )}
              {vax.completedDate && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Completed: {formatDate(vax.completedDate)}
                  {vax.administeredBy ? ` by ${vax.administeredBy}` : ''}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}