import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getInventory, addItem, updateStock, deleteItem } from '../api/inventoryApi';
import { INVENTORY_CATEGORIES } from '../utils/constants';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Plus, Package, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'feed', currentStock: '', unit: '', reorderAt: '', dailyConsumption: '', costPerUnit: '', supplier: '', expiryDate: '' });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await getInventory();
      setItems(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addItem({
        ...form,
        currentStock: Number(form.currentStock),
        reorderAt: form.reorderAt ? Number(form.reorderAt) : undefined,
        dailyConsumption: form.dailyConsumption ? Number(form.dailyConsumption) : undefined,
        costPerUnit: form.costPerUnit ? Number(form.costPerUnit) : undefined,
        supplier: form.supplier ? { name: form.supplier } : undefined,
      });
      setShowForm(false);
      setForm({ name: '', category: 'feed', currentStock: '', unit: '', reorderAt: '', dailyConsumption: '', costPerUnit: '', supplier: '', expiryDate: '' });
      fetchItems();
    } catch {} finally { setSubmitting(false); }
  };

  const handleStockUpdate = async (id, qty, op) => {
    await updateStock(id, { quantity: qty, operation: op });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await deleteItem(id);
    fetchItems();
  };

  return (
    <div>
      <PageHeader title="Inventory" description="Feed, medicine, and supplies" action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Item</Button>} />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className={`p-2 rounded-lg ${item.currentStock <= (item.reorderAt || 0) ? 'bg-red-50 dark:bg-red-950/30' : 'bg-blue-50 dark:bg-blue-950/30'}`}>
              {item.currentStock <= (item.reorderAt || 0) ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <Package className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                <Badge>{item.category}</Badge>
                {item.currentStock <= (item.reorderAt || 0) && <Badge variant="danger">Low Stock</Badge>}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.currentStock} {item.unit} in stock
                {item.reorderAt && ` · Reorder at ${item.reorderAt} ${item.unit}`}
                {item.costPerUnit && ` · ${formatCurrency(item.costPerUnit)}/${item.unit}`}
              </p>
              {item.expiryDate && <p className="text-xs text-gray-400">Expires: {formatDate(item.expiryDate)}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleStockUpdate(item._id, 1, 'add')}>+</Button>
              <Button variant="outline" size="sm" onClick={() => handleStockUpdate(item._id, 1, 'remove')}>-</Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)} className="text-red-500">Delete</Button>
            </div>
          </div>
        ))}
      </div>
      {!loading && items.length === 0 && <p className="text-center py-12 text-gray-400">No inventory items</p>}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Inventory Item">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Item Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {INVENTORY_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <Input label="Unit *" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="kg, L, pcs" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Current Stock *" type="number" value={form.currentStock} onChange={(e) => setForm({ ...form, currentStock: e.target.value })} required />
            <Input label="Reorder At" type="number" value={form.reorderAt} onChange={(e) => setForm({ ...form, reorderAt: e.target.value })} />
            <Input label="Daily Use" type="number" value={form.dailyConsumption} onChange={(e) => setForm({ ...form, dailyConsumption: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cost Per Unit (KES)" type="number" value={form.costPerUnit} onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })} />
            <Input label="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
          <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}