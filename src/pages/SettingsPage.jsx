import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword as changePasswordApi } from '../api/authApi';
import { getFarm, updateFarm } from '../api/farmApi';
import { User, Lock, Bell, Globe, MapPin, Wheat } from 'lucide-react';

export default function SettingsPage() {
  const { user, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [farmData, setFarmData] = useState(null);

  const [profile, setProfile] = useState({
    name: user?.name || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [prefs, setPrefs] = useState({
    dailyBriefing: user?.preferences?.dailyBriefing ?? true,
    emailAlerts: user?.preferences?.emailAlerts ?? true,
    smsAlerts: user?.preferences?.smsAlerts ?? false,
    language: user?.preferences?.language || 'en',
  });

  const [farmForm, setFarmForm] = useState({
    name: '',
    county: '',
    subCounty: '',
    size: '',
    sizeUnit: 'acres',
  });

  useEffect(() => {
    fetchFarm();
  }, []);

  const fetchFarm = async () => {
    try {
      const res = await getFarm();
      setFarmData(res.data.data);
      setFarmForm({
        name: res.data.data.name || '',
        county: res.data.data.location?.county || '',
        subCounty: res.data.data.location?.subCounty || '',
        size: res.data.data.size || '',
        sizeUnit: res.data.data.sizeUnit || 'acres',
      });
    } catch {}
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'farm', label: 'Farm', icon: Wheat },
    { key: 'password', label: 'Password', icon: Lock },
    { key: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile({ name: profile.name, preferences: prefs });
      loginUser({ user: { ...user, name: profile.name, preferences: prefs } });
      setMessage('Profile updated successfully');
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

const handleFarmUpdate = async (e) => {
  e.preventDefault();
  setSaving(true);
  setMessage('');
  try {
    await updateFarm({
      name: farmForm.name,
      location: {
        county: farmForm.county,
        subCounty: farmForm.subCounty,
      },
      size: farmForm.size ? Number(farmForm.size) : undefined,
      sizeUnit: farmForm.sizeUnit,
    });
    setMessage('Farm updated successfully');
    fetchFarm();
  } catch {
    setMessage('Failed to update farm');
  } finally {
    setSaving(false);
  }
};

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage('Passwords do not match');
      setSaving(false);
      return;
    }

    if (passwords.newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      setSaving(false);
      return;
    }

    try {
      await changePasswordApi({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password changed successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleFarmChange = (e) => {
    setFarmForm({ ...farmForm, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account, farm, and preferences" />

      <div className="flex gap-6">
        <div className="w-56 space-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-2xl">
          {activeTab === 'profile' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <Input label="Email" value={user?.email || ''} disabled />
                <Input label="Phone" value={user?.phone || ''} disabled />
                <Input label="Role" value={user?.role || ''} disabled />

                <div className="flex items-center gap-2 pt-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <select
                    value={prefs.language}
                    onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                    className="input-field w-40"
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>

                {message && (
                  <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
                )}

                <Button type="submit" loading={saving}>Save Changes</Button>
              </form>
            </Card>
          )}

          {activeTab === 'farm' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Farm Settings</h3>
              <form onSubmit={handleFarmUpdate} className="space-y-4">
                <Input label="Farm Name" name="name" value={farmForm.name} onChange={handleFarmChange} />

                <div className="grid grid-cols-2 gap-4">
                  <Input label="County" name="county" value={farmForm.county} onChange={handleFarmChange} />
                  <Input label="Sub-County" name="subCounty" value={farmForm.subCounty} onChange={handleFarmChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Farm Size" name="size" type="number" value={farmForm.size} onChange={handleFarmChange} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                    <select name="sizeUnit" value={farmForm.sizeUnit} onChange={handleFarmChange} className="input-field">
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                {message && (
                  <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
                )}

                <Button type="submit" loading={saving}>Update Farm</Button>
              </form>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input label="Current Password" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
                <Input label="New Password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="Min. 8 characters" />
                <Input label="Confirm New Password" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />

                {message && (
                  <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
                )}

                <Button type="submit" loading={saving}>Update Password</Button>
              </form>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Daily Briefing</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive a daily farm summary at 7 AM EAT</p>
                  </div>
                  <input type="checkbox" checked={prefs.dailyBriefing} onChange={(e) => setPrefs({ ...prefs, dailyBriefing: e.target.checked })} className="toggle" />
                </label>

                <label className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get critical alerts via email</p>
                  </div>
                  <input type="checkbox" checked={prefs.emailAlerts} onChange={(e) => setPrefs({ ...prefs, emailAlerts: e.target.checked })} className="toggle" />
                </label>

                <label className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">SMS Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get critical alerts via SMS</p>
                  </div>
                  <input type="checkbox" checked={prefs.smsAlerts} onChange={(e) => setPrefs({ ...prefs, smsAlerts: e.target.checked })} className="toggle" />
                </label>

                {message && (
                  <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
                )}

                <Button onClick={handleProfileUpdate} loading={saving}>Save Preferences</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}