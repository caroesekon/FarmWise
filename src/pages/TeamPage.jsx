import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getTeam, addMember, removeMember } from '../api/teamApi';
import { getInitials } from '../utils/formatters';
import { Plus, Trash2, Mail, Phone, Copy, CheckCircle, X } from 'lucide-react';

const roleBadge = { farmAdmin: 'success', manager: 'info', worker: 'neutral', vet: 'warning' };
const roleLabel = { farmAdmin: 'Farm Admin', manager: 'Manager', worker: 'Worker', vet: 'Vet' };
const roleDesc = {
  manager: 'Can view finances, manage tasks, and oversee operations',
  worker: 'Can record production and basic data entry',
  vet: 'Can record health records and manage vaccinations. Gets alerts 7 days, 3 days, and day-of.',
};

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'worker' });
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentialData, setCredentialData] = useState(null);
  const [copied, setCopied] = useState(false);

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
      const creds = res.data.data.credentials;
      setShowForm(false);
      setForm({ name: '', phone: '', email: '', role: 'worker' });
      setCredentialData({
        name: form.name,
        phone: creds.phone,
        password: creds.password,
        email: creds.email,
        emailSent: res.data.data.emailSent,
      });
      setShowCredentials(true);
      setCopied(false);
      fetchTeam();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this team member?')) return;
    await removeMember(id);
    fetchTeam();
  };

  const handleCopyCredentials = () => {
    if (!credentialData) return;
    const text = `FarmWise Login\nPhone: ${credentialData.phone}\nPassword: ${credentialData.password}\nApp: https://farmwiseserver.pxxl.click`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage farm workers and roles"
        action={
          <Button onClick={() => { setForm({ name: '', phone: '', email: '', role: 'worker' }); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        }
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
              <div className="mt-2">
                <Badge variant={roleBadge[member.role] || 'neutral'}>{roleLabel[member.role]}</Badge>
                <p className="text-xs text-gray-400 mt-1">{roleDesc[member.role]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!loading && team.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">No team members yet</p>
          <p className="text-xs mt-1">Add workers, managers, and vets to help manage your farm.</p>
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Team Member">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Mwangi" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" required />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
            <div className="grid grid-cols-3 gap-2">
              {['manager', 'worker', 'vet'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    form.role === r
                      ? 'bg-primary-50 dark:bg-primary-950 border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {roleLabel[r]}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">{roleDesc[form.role]}</p>
          </div>

          {form.email && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-sm text-blue-700 dark:text-blue-300">
              <Mail className="h-4 w-4 inline mr-1" />
              Login credentials will be emailed to {form.email}
            </div>
          )}

          {!form.email && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-sm text-amber-700 dark:text-amber-300">
              No email provided. Credentials will be shown on screen — copy and share them manually.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Member</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showCredentials} onClose={() => setShowCredentials(false)} title="Team Member Credentials" size="sm">
        {credentialData && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">{credentialData.name} has been added!</p>
              {credentialData.emailSent ? (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Login credentials sent to {credentialData.email}</p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Share these credentials with {credentialData.name}:</p>
              )}
            </div>

            {!credentialData.emailSent && (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{credentialData.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Password</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">{credentialData.password}</span>
                </div>
              </div>
            )}

            <Button onClick={handleCopyCredentials} className="w-full" variant={copied ? 'secondary' : 'primary'}>
              {copied ? (
                <><CheckCircle className="h-4 w-4" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy Credentials</>
              )}
            </Button>

            <Button variant="ghost" onClick={() => setShowCredentials(false)} className="w-full">
              <X className="h-4 w-4" /> Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}