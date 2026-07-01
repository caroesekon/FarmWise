import { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { getAnimals } from '../api/animalApi';
import { getProduction } from '../api/productionApi';
import { getFinances } from '../api/financeApi';
import { getVaccinations } from '../api/vaccinationApi';
import { getInventory } from '../api/inventoryApi';
import { getTasks } from '../api/taskApi';
import { getFarm } from '../api/farmApi';
import { formatDate, formatCurrency } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import {
  Printer, Beef, Milk, Egg, DollarSign, Syringe, Package,
  ClipboardList, TrendingUp, TrendingDown, FileText
} from 'lucide-react';

const tabs = [
  { key: 'livestock', label: 'Livestock', icon: Beef },
  { key: 'production', label: 'Production', icon: Milk },
  { key: 'financial', label: 'Financial', icon: DollarSign },
  { key: 'vaccination', label: 'Vaccination', icon: Syringe },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'tasks', label: 'Tasks', icon: ClipboardList },
];

const reportTitles = {
  livestock: 'Livestock Report',
  production: 'Production Report',
  financial: 'Financial Report',
  vaccination: 'Vaccination Report',
  inventory: 'Inventory Report',
  tasks: 'Tasks Report',
};

export default function ReportsPage() {
  const { farm } = useAuth();
  const [activeTab, setActiveTab] = useState('livestock');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [farmData, setFarmData] = useState(null);
  const printRef = useRef(null);

  useEffect(() => { fetchFarm(); }, []);
  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchFarm = async () => {
    try {
      const res = await getFarm();
      setFarmData(res.data.data);
    } catch {}
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'livestock': {
          const res = await getAnimals({ limit: 500 });
          const animals = res.data.data || [];
          const byCategory = {};
          const byStatus = {};
          animals.forEach((a) => {
            byCategory[a.category] = (byCategory[a.category] || 0) + 1;
            byStatus[a.status] = (byStatus[a.status] || 0) + 1;
          });
          setData({ animals, byCategory, byStatus, total: animals.length });
          break;
        }
        case 'production': {
          const endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
          const res = await getProduction({ startDate: startDate.toISOString(), endDate: endDate.toISOString(), limit: 1000 });
          const records = res.data.data || [];
          const totalMilk = records.filter((r) => r.type === 'milk').reduce((s, r) => s + r.quantity, 0);
          const totalEggs = records.filter((r) => r.type === 'eggs').reduce((s, r) => s + r.quantity, 0);
          const byDay = {};
          records.forEach((r) => {
            const day = new Date(r.date).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' });
            if (!byDay[day]) byDay[day] = { milk: 0, eggs: 0 };
            if (r.type === 'milk') byDay[day].milk += r.quantity;
            if (r.type === 'eggs') byDay[day].eggs += r.quantity;
          });
          setData({ records, totalMilk, totalEggs, byDay });
          break;
        }
        case 'financial': {
          const res = await getFinances({ limit: 500 });
          const records = res.data.data || [];
          const summary = res.data.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
          setData({ records, summary });
          break;
        }
        case 'vaccination': {
          const res = await getVaccinations({ limit: 200 });
          const vaccinations = res.data.data || [];
          const pending = vaccinations.filter((v) => v.status === 'pending' || v.status === 'overdue');
          const completed = vaccinations.filter((v) => v.status === 'completed');
          setData({ vaccinations, pending, completed });
          break;
        }
        case 'inventory': {
          const res = await getInventory({ limit: 200 });
          const items = res.data.data || [];
          const lowStock = items.filter((i) => i.currentStock <= (i.reorderAt || 0));
          setData({ items, lowStock });
          break;
        }
        case 'tasks': {
          const res = await getTasks({ limit: 200 });
          const tasks = res.data.data || [];
          const pending = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
          const completed = tasks.filter((t) => t.status === 'completed');
          setData({ tasks, pending, completed });
          break;
        }
      }
    } catch {} finally { setLoading(false); }
  };

  const handlePrint = () => {
    window.print();
  };

  const now = new Date();
  const dateTimeStr = now.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) +
    ' at ' + now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  const displayFarm = farmData || farm;
  const farmLocation = displayFarm?.location?.county
    ? `${displayFarm.location.county}${displayFarm.location.subCounty ? ', ' + displayFarm.location.subCounty : ''}`
    : '';

  if (loading) return <Spinner className="py-20" size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 no-print">
        <PageHeader title="Reports" description="View and print farm reports" />
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> Print Report
        </Button>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 no-print">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div className="print-area" ref={printRef}>
        <div className="print-header">
          <h1>{reportTitles[activeTab]}</h1>
          <p>{displayFarm?.name || 'Farm'}{farmLocation ? ` — ${farmLocation}` : ''}</p>
          <p>{dateTimeStr}</p>
        </div>

        {activeTab === 'livestock' && (
          <>
            <div className="print-summary">
              <div className="print-summary-card"><div className="label">Total Animals</div><div className="value">{data.total}</div></div>
              {Object.entries(data.byCategory || {}).map(([cat, count]) => (
                <div key={cat} className="print-summary-card"><div className="label">{cat}</div><div className="value">{count}</div></div>
              ))}
            </div>
            <table>
              <thead><tr><th>Tag</th><th>Breed</th><th>Category</th><th>Sex</th><th>Status</th></tr></thead>
              <tbody>
                {(data.animals || []).map((a) => (
                  <tr key={a._id}><td>{a.tag}</td><td>{a.breed}</td><td>{a.category}</td><td>{a.sex}</td><td>{a.status}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'production' && (
          <>
            <div className="print-summary">
              <div className="print-summary-card"><div className="label">Total Milk (30d)</div><div className="value">{data.totalMilk?.toFixed(1) || '0'} L</div></div>
              <div className="print-summary-card"><div className="label">Total Eggs (30d)</div><div className="value">{data.totalEggs || '0'}</div></div>
              <div className="print-summary-card"><div className="label">Total Records</div><div className="value">{data.records?.length || 0}</div></div>
            </div>
            <table>
              <thead><tr><th>Date</th><th>Animal</th><th>Type</th><th>Quantity</th><th>Session</th></tr></thead>
              <tbody>
                {(data.records || []).slice(0, 100).map((r) => (
                  <tr key={r._id}><td>{formatDate(r.date)}</td><td>{r.animalId?.tag || '—'}</td><td className="capitalize">{r.type}</td><td>{r.quantity} {r.unit}</td><td className="capitalize">{r.session || 'single'}</td></tr>
                ))}
                {(data.records || []).length === 0 && <tr><td colSpan="5" className="text-center">No production records found</td></tr>}
              </tbody>
            </table>
            {Object.keys(data.byDay || {}).length > 0 && (
              <>
                <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Daily Breakdown</h3>
                <table>
                  <thead><tr><th>Day</th><th>Milk (L)</th><th>Eggs</th></tr></thead>
                  <tbody>
                    {Object.entries(data.byDay).reverse().map(([day, d]) => (
                      <tr key={day}><td>{day}</td><td>{d.milk?.toFixed(1) || '0'}</td><td>{d.eggs || '0'}</td></tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}

        {activeTab === 'financial' && (
          <>
            <div className="print-summary">
              <div className="print-summary-card"><div className="label">Income</div><div className="value">{formatCurrency(data.summary?.totalIncome || 0)}</div></div>
              <div className="print-summary-card"><div className="label">Expenses</div><div className="value">{formatCurrency(data.summary?.totalExpense || 0)}</div></div>
              <div className="print-summary-card"><div className="label">Balance</div><div className="value">{formatCurrency(data.summary?.balance || 0)}</div></div>
            </div>
            <table>
              <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
              <tbody>
                {(data.records || []).map((r) => (
                  <tr key={r._id}><td>{formatDate(r.date)}</td><td>{r.category}</td><td>{r.description || '—'}</td><td className={r.type === 'income' ? 'text-green-600' : 'text-red-600'}>{r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'vaccination' && (
          <>
            <div className="print-summary">
              <div className="print-summary-card"><div className="label">Total</div><div className="value">{data.vaccinations?.length || 0}</div></div>
              <div className="print-summary-card"><div className="label">Pending</div><div className="value">{data.pending?.length || 0}</div></div>
              <div className="print-summary-card"><div className="label">Completed</div><div className="value">{data.completed?.length || 0}</div></div>
            </div>
            <table>
              <thead><tr><th>Vaccine</th><th>Animals</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>
                {(data.vaccinations || []).map((v) => (
                  <tr key={v._id}><td>{v.vaccineName}</td><td>{v.animalCount}</td><td>{formatDate(v.dueDate)}</td><td>{v.status}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'inventory' && (
          <>
            <div className="print-summary">
              <div className="print-summary-card"><div className="label">Total Items</div><div className="value">{data.items?.length || 0}</div></div>
              <div className="print-summary-card"><div className="label">Low Stock</div><div className="value">{data.lowStock?.length || 0}</div></div>
            </div>
            <table>
              <thead><tr><th>Item</th><th>Category</th><th>Stock</th><th>Reorder At</th><th>Status</th></tr></thead>
              <tbody>
                {(data.items || []).map((i) => (
                  <tr key={i._id}><td>{i.name}</td><td>{i.category}</td><td>{i.currentStock} {i.unit}</td><td>{i.reorderAt ? `${i.reorderAt} ${i.unit}` : '—'}</td><td>{i.currentStock <= (i.reorderAt || 0) ? 'Low' : 'OK'}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'tasks' && (
          <>
            <div className="print-summary">
              <div className="print-summary-card"><div className="label">Total</div><div className="value">{data.tasks?.length || 0}</div></div>
              <div className="print-summary-card"><div className="label">Pending</div><div className="value">{data.pending?.length || 0}</div></div>
              <div className="print-summary-card"><div className="label">Completed</div><div className="value">{data.completed?.length || 0}</div></div>
            </div>
            <table>
              <thead><tr><th>Task</th><th>Category</th><th>Priority</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>
                {(data.tasks || []).map((t) => (
                  <tr key={t._id}><td>{t.title}</td><td>{t.category}</td><td>{t.priority}</td><td>{t.dueDate ? formatDate(t.dueDate) : '—'}</td><td>{t.status}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="print-footer">
          <p>Generated by FarmWise on {dateTimeStr}</p>
          <p>FarmWise — Farm Smarter, Grow Further</p>
        </div>
      </div>
    </div>
  );
}