import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getFinances, addRecord } from '../api/financeApi';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function FinancePage() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: 'expense', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });

  useEffect(() => { fetchFinances(); }, []);

  const fetchFinances = async () => {
    try {
      const res = await getFinances({ limit: 100 });
      setRecords(res.data.data);
      setSummary(res.data.summary);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addRecord({ ...form, amount: Number(form.amount) });
      setShowForm(false);
      setForm({ type: 'expense', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
      fetchFinances();
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader title="Finances" description="Income and expenses" action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Record</Button>} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
          <div className="flex items-center gap-2 text-green-600 mb-1"><TrendingUp className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Income</span></div>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900">
          <div className="flex items-center gap-2 text-red-600 mb-1"><TrendingDown className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Expenses</span></div>
          <p className="text-xl font-bold text-red-700 dark:text-red-300">{formatCurrency(summary.totalExpense)}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
          <div className="flex items-center gap-2 text-blue-600 mb-1"><DollarSign className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Balance</span></div>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(summary.balance)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {records.map((r) => (
          <div key={r._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <div className={`p-2 rounded-lg ${r.type === 'income' ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
              {r.type === 'income' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">{r.category}</span>
                <Badge variant={r.type === 'income' ? 'success' : 'danger'}>{r.type}</Badge>
              </div>
              {r.description && <p className="text-sm text-gray-500 dark:text-gray-400">{r.description}</p>}
            </div>
            <div className="text-right">
              <p className={`font-semibold ${r.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}</p>
              <p className="text-xs text-gray-400">{formatDate(r.date)}</p>
            </div>
          </div>
        ))}
      </div>
      {!loading && records.length === 0 && <p className="text-center py-12 text-gray-400">No transactions yet</p>}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Transaction">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="income">Income</option><option value="expense">Expense</option>
              </select>
            </div>
            <Input label="Amount (KES) *" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <Input label="Category *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Milk sales, Feed, Vet" required />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Transaction</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}