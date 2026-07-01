import Card from '../ui/Card';
import Badge from '../ui/Badge';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import { ArrowLeft, Beef, MapPin, Calendar, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export default function AnimalDetail({ animal }) {
  const navigate = useNavigate();

  if (!animal) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/livestock')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title={animal.tag}
          description={animal.breed}
          action={<Badge variant={animal.status === 'active' ? 'success' : 'neutral'}>{animal.status}</Badge>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Beef className="h-4 w-4" />
              <span>{animal.category} · {animal.sex}</span>
            </div>
            {animal.pen && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Pen: {animal.pen}</span>
              </div>
            )}
            {animal.birthDate && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Born: {formatDate(animal.birthDate)}</span>
              </div>
            )}
            {animal.weight?.current && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Ruler className="h-4 w-4" />
                <span>Weight: {animal.weight.current} kg</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Health</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Health records will appear here</p>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Production</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Production data will appear here</p>
        </Card>
      </div>
    </div>
  );
}