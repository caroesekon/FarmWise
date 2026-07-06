import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import PricesTab from '../components/finance/PricesTab';
import { getFinances, addRecord, updateRecord, deleteRecord } from '../api/financeApi';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Plus, TrendingUp, TrendingDown, DollarSign, Pencil, Trash2 } from 'lucide-react';

export default function FinancePage() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: 'expense', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });

  useEffect(() => { fetchFinances(); }, []);

  const fetchFinances = async () => {
    try {
      const res = await getFinances({ limit: 100 });
      setRecords(res.data.data);
      setSummary(res.data.summary || { totalIncome: 0, totalExpense: 0, balance: 0 });
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateRecord(editingRecord._id, { ...form, amount: Number(form.amount) });
      } else {
        await addRecord({ ...form, amount: Number(form.amount) });
      }
      setShowForm(false);
      setEditingRecord(null);
      setForm({ type: 'expense', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
      fetchFinances();
    } catch {} finally { setSubmitting(false); }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setForm({
      type: record.type,
      category: record.category,
      amount: String(record.amount),
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      description: record.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await deleteRecord(id);
    fetchFinances();
  };

  return (
    <div>
      <PageHeader
        title="Finances"
        description="Income, expenses, and pricing"
        action={
          activeTab === 'transactions' ? (
            <Button onClick={() => { setEditingRecord(null); setForm({ type: 'expense', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' }); setShowForm(true); }}>
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
          ) : null
        }
      />

      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-64">
        <button onClick={() => setActiveTab('transactions')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'transactions' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Transactions</button>
        <button onClick={() => setActiveTab('prices')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'prices' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Prices</button>
      </div>

      {activeTab === 'transactions' ? (
        <>
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
              <div key={r._id} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
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
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(r)}><Pencil className="h-4 w-4 text-gray-400" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
          {!loading && records.length === 0 && <p className="text-center py-12 text-gray-400">No transactions yet</p>}
        </>
      ) : (
        <PricesTab />
      )}

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditingRecord(null); }} title={editingRecord ? 'Edit Transaction' : 'Add Transaction'}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <Input label="Amount (KES) *" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <Input label="Category *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Milk sales, Feed, Vet" required />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingRecord(null); }}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editingRecord ? 'Update' : 'Add'} Transaction</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}