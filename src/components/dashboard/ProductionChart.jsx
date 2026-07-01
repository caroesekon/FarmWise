import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getProduction } from '../../api/productionApi';

export default function ProductionChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduction();
  }, []);

const fetchProduction = async () => {
  try {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const res = await getProduction({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 500,
    });

    const records = res.data.data || [];

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-KE', { weekday: 'short' });
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const dayRecords = records.filter((r) => {
        const rd = new Date(r.date);
        return rd >= dayStart && rd <= dayEnd;
      });

      days.push({
        day: dayStr,
        milk: dayRecords.filter((r) => r.type === 'milk').reduce((s, r) => s + r.quantity, 0),
        eggs: dayRecords.filter((r) => r.type === 'eggs').reduce((s, r) => s + r.quantity, 0),
      });
    }

    setData(days);
  } catch {
    setData([]);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Production This Week</h3>
        <div className="h-[250px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      </Card>
    );
  }

  const hasData = data.some((d) => d.milk > 0 || d.eggs > 0);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Production This Week</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-gray-500" />
            <YAxis tick={{ fontSize: 12 }} className="text-gray-500" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="milk" fill="#4caf50" radius={[4, 4, 0, 0]} name="Milk (L)" />
            <Bar dataKey="eggs" fill="#ffa000" radius={[4, 4, 0, 0]} name="Eggs" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
          No production data this week
        </div>
      )}
    </Card>
  );
}