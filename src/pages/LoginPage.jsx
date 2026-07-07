import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/authApi';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [supportPhone, setSupportPhone] = useState('');
  const [downloads, setDownloads] = useState({});

  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    api.get('/support').then(res => {
      if (res.data.success) setSupportPhone(res.data.data?.phone || '');
    }).catch(() => {});

    fetch('/api/downloads').then(r => r.json()).then(d => {
      if (d.success) setDownloads(d.data || {});
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password) { setError('Password is required'); return; }
    if (!usePhone && !email) { setError('Email is required'); return; }
    if (usePhone && !phone) { setError('Phone number is required'); return; }

    setLoading(true);
    try {
      const data = { password };
      if (usePhone) data.phone = phone.startsWith('0') ? '+254' + phone.slice(1) : phone;
      else data.email = email;
      const res = await loginApi(data);
      loginUser(res.data.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">FW</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FarmWise</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your farm</p>
        </div>

        <div className="card p-6">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button type="button" onClick={() => setUsePhone(false)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!usePhone ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Email</button>
            <button type="button" onClick={() => setUsePhone(true)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${usePhone ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Phone</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {usePhone ? (
              <Input icon={Phone} type="tel" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} />
            ) : (
              <Input icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            )}

            <div className="relative">
              <Input icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">Forgot password?</Link>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>}

            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">Contact your farm administrator if you need access.</p>
        {supportPhone && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            Need help? Call <a href={`tel:${supportPhone}`} className="text-primary-600 hover:text-primary-700 font-medium">{supportPhone}</a>
          </p>
        )}

        {(downloads.windows || downloads.android) && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-3">Download FarmWise</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {downloads.windows && (
                <a href={downloads.windows.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  🪟 Windows {downloads.windows.version && `v${downloads.windows.version}`}
                </a>
              )}
              {downloads.android && (
                <a href={downloads.android.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  🤖 Android {downloads.android.version && `v${downloads.android.version}`}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}