import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getTeam, addMember, removeMember } from '../api/teamApi';
import { getInitials } from '../utils/formatters';
import { Plus, Trash2, Mail, Phone } from 'lucide-react';

const roleBadge = { farmAdmin: 'success', manager: 'info', worker: 'neutral', vet: 'warning' };
const roleLabel = { farmAdmin: 'Farm Admin', manager: 'Manager', worker: 'Worker', vet: 'Vet' };

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'worker' });

  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    try {
      const res = await getTeam();
      setTeam(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await addMember(form);
      setShowForm(false);
      setForm({ name: '', phone: '', email: '', role: 'worker' });
      alert(`Team member added. Password: ${res.data.data.tempPassword}`);
      fetchTeam();
    } catch {} finally { setSubmitting(false); }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this team member?')) return;
    await removeMember(id);
    fetchTeam();
  };

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage farm workers and roles"
        action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Member</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div key={member._id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {getInitials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">{member.name}</h3>
                {member.role !== 'farmAdmin' && (
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(member._id)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-1 mt-1">
                {member.phone && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {member.phone}
                  </p>
                )}
                {member.email && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {member.email}
                  </p>
                )}
              </div>
              <Badge variant={roleBadge[member.role] || 'neutral'} className="mt-2">{roleLabel[member.role]}</Badge>
            </div>
          </div>
        ))}
      </div>
      {!loading && team.length === 0 && <p className="text-center py-12 text-gray-400">No team members yet</p>}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Team Member">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" required />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="vet@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field">
              <option value="manager">Manager</option>
              <option value="worker">Worker</option>
              <option value="vet">Vet</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}