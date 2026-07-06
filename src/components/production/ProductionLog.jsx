import { formatDate, formatCurrency } from '../../utils/formatters';
import { Milk, Egg, TrendingUp, Layers, Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const typeConfig = {
  milk: { icon: Milk, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  eggs: { icon: Egg, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
  weight: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
};

function getAnimalTag(record) {
  if (record.animalId && typeof record.animalId === 'object') return record.animalId.tag || '—';
  if (record.animal && typeof record.animal === 'object') return record.animal.tag || '—';
  return record.animalId || '—';
}

export default function ProductionLog({ records, batchSummary, viewMode = 'single', onEdit, onDelete }) {
  const batchRecords = records.filter((r) => r.notes?.startsWith('Batch:'));
  const individualRecords = records.filter((r) => !r.notes || !r.notes.startsWith('Batch:'));

  if (viewMode === 'batch') {
    if (!batchSummary?.length) {
      return (
        <div className="text-center py-12 text-gray-400">
          <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No batch production yet</p>
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
                <p className="font-medium text-gray-900 dark:text-white">{b.batchId?.split('-').slice(0, -2).join('-') || b.batchId}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{b.count} animals · {b.totalQuantity} total{b.totalValue ? ` · ${formatCurrency(b.totalValue)}` : ''} · {formatDate(b.date)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalMilk = individualRecords.filter((r) => r.type === 'milk').reduce((s, r) => s + r.quantity, 0);
  const totalEggs = individualRecords.filter((r) => r.type === 'eggs').reduce((s, r) => s + r.quantity, 0);

  if (!individualRecords.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Milk className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No individual production records yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
          <p className="text-xs text-blue-500 uppercase tracking-wider">Total Milk</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalMilk.toFixed(1)} L</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900">
          <p className="text-xs text-yellow-600 uppercase tracking-wider">Total Eggs</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{totalEggs}</p>
        </div>
      </div>

      <div className="space-y-2">
        {individualRecords.slice(0, 20).map((record) => {
          const config = typeConfig[record.type] || typeConfig.weight;
          const Icon = config.icon;
          const animalTag = getAnimalTag(record);
          return (
            <div key={record._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{animalTag} — {record.quantity} {record.unit}</p>
                <p className="text-xs text-gray-400 capitalize">{record.type} · {record.session || 'single'}{record.value > 0 ? ` · ${formatCurrency(record.value)}` : ''}</p>
              </div>
              <span className="text-xs text-gray-400">{formatDate(record.date)}</span>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(record)}><Pencil className="h-4 w-4 text-gray-400" /></Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(record)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}