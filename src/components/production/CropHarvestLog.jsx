import { formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Wheat } from 'lucide-react';

export default function CropHarvestLog({ crops }) {
  if (!crops?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Wheat className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No crop records yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {crops.map((crop) => (
        <div key={crop._id} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
            <Wheat className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-white">{crop.cropType}</span>
              {crop.variety && <span className="text-sm text-gray-500">({crop.variety})</span>}
              <Badge variant={crop.status === 'harvested' ? 'success' : crop.status === 'growing' ? 'info' : 'neutral'}>
                {crop.status}
              </Badge>
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Planted: {formatDate(crop.plantingDate)}</span>
              {crop.expectedHarvestDate && <span>Expected: {formatDate(crop.expectedHarvestDate)}</span>}
              {crop.actualHarvestDate && <span>Harvested: {formatDate(crop.actualHarvestDate)}</span>}
            </div>
            {crop.yield?.quantity && (
              <p className="text-sm text-green-600 font-medium mt-2">
                Yield: {crop.yield.quantity} {crop.yield.unit}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}