export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-KE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-KE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'KES 0';
  return `KES ${Number(amount).toLocaleString('en-KE')}`;
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-KE');
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  const num = Number(value);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num}%`;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    inactive: 'gray',
    suspended: 'red',
    pending: 'yellow',
    completed: 'green',
    overdue: 'red',
    growing: 'green',
    harvested: 'blue',
    failed: 'red',
    depleted: 'red',
    in_progress: 'blue',
    cancelled: 'gray',
  };
  return colors[status] || 'gray';
};