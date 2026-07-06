import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getPrices, updatePrices, getProducts } from '../../api/farmApi';
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react';

function PriceTable({ title, products, updateRow, removeRow, getGlobalIndex }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h4>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Product</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 w-28">Price (KES)</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 w-20">Unit</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="px-4 py-2">
                  <input value={p.name} readOnly className="w-full bg-transparent text-gray-900 dark:text-white focus:outline-none text-sm cursor-default" />
                </td>
                <td className="px-4 py-2">
                  <input type="number" value={p.price} onChange={(e) => updateRow(getGlobalIndex(i), 'price', e.target.value)} placeholder="0" className="w-full bg-transparent text-gray-900 dark:text-white focus:outline-none text-sm text-right" />
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{p.unit}</td>
                <td className="px-4 py-2">
                  <Button variant="ghost" size="sm" onClick={() => removeRow(getGlobalIndex(i))} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">No products yet. Add animals and crops first.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function PricesTab() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchPrices(); }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const [pricesRes, productsRes] = await Promise.all([getPrices(), getProducts()]);
      const existingPrices = pricesRes.data.data || [];
      const farmProducts = productsRes.data.data || [];

      const merged = farmProducts.map((fp) => {
        const found = existingPrices.find((p) => p.name === fp.name);
        return found ? { ...fp, price: String(found.price) } : { ...fp, price: '' };
      });

      existingPrices.forEach((p) => {
        if (!merged.find((m) => m.name === p.name)) {
          merged.push({ ...p, price: String(p.price) });
        }
      });

      setPrices(merged);
    } catch {} finally { setLoading(false); }
  };

  const addRow = () => {
    setPrices([...prices, { name: '', category: 'other', price: '', unit: '' }]);
  };

  const removeRow = (index) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...prices];
    updated[index] = { ...updated[index], [field]: value };
    setPrices(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const valid = prices.filter((p) => p.name && p.price && p.unit);
      await updatePrices({ productPrices: valid.map((p) => ({ ...p, price: Number(p.price) })) });
      setMessage('Prices saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to save prices');
    } finally {
      setSaving(false);
    }
  };

  const animalProducts = prices.filter((p) => p.category === 'animal');
  const cropProducts = prices.filter((p) => p.category === 'crop');
  const otherProducts = prices.filter((p) => p.category === 'other');

  const getAnimalIndex = (i) => prices.indexOf(animalProducts[i]);
  const getCropIndex = (i) => prices.indexOf(cropProducts[i]);
  const getOtherIndex = (i) => prices.indexOf(otherProducts[i]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Prices</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={fetchPrices}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4" /> Add Custom
          </Button>
          <Button size="sm" onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4" /> Save All
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Products are pulled from your farm data. Add animals and crops to see them here. Enter prices to auto-calculate production value.
      </p>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceTable title="Animal Products" products={animalProducts} updateRow={updateRow} removeRow={removeRow} getGlobalIndex={getAnimalIndex} />
        <div className="space-y-6">
          <PriceTable title="Crop Products" products={cropProducts} updateRow={updateRow} removeRow={removeRow} getGlobalIndex={getCropIndex} />
          <PriceTable title="Other" products={otherProducts} updateRow={updateRow} removeRow={removeRow} getGlobalIndex={getOtherIndex} />
        </div>
      </div>
    </div>
  );
}