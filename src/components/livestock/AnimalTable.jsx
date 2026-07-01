import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';

export default function AnimalTable({ animals, loading, onRowClick }) {
  const columns = [
    {
      key: 'tag',
      label: 'Tag',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.tag}</span>
      ),
    },
    { key: 'breed', label: 'Breed' },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <Badge>{row.category}</Badge>,
    },
    { key: 'sex', label: 'Sex' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Added',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <Table
      columns={columns}
      data={animals}
      loading={loading}
      onRowClick={onRowClick}
      emptyMessage="No animals registered yet"
    />
  );
}