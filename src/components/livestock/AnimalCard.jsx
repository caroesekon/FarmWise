import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Beef, MapPin, Calendar } from 'lucide-react';

export default function AnimalCard({ animal, onClick }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{animal.tag}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{animal.breed}</p>
        </div>
        <Badge variant={animal.status === 'active' ? 'success' : 'neutral'}>
          {animal.status}
        </Badge>
      </div>
      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Beef className="h-4 w-4" />
          <span>{animal.category} · {animal.sex}</span>
        </div>
        {animal.pen && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Pen: {animal.pen}</span>
          </div>
        )}
        {animal.birthDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Born: {new Date(animal.birthDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Card>
  );
}