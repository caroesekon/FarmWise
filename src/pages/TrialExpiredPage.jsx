import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Clock, Phone, Mail, LogOut, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

export default function TrialExpiredPage() {
  const { user, farm, logout } = useAuth();
  const navigate = useNavigate();
  const [supportPhone, setSupportPhone] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSupportInfo();
  }, []);

  const fetchSupportInfo = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/support`);
      const data = await res.json();
      if (data.success) {
        setSupportPhone(data.data?.phone || '');
        setSupportEmail(data.data?.email || '');
      }
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCopyEmail = () => {
    if (supportEmail) {
      navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-6">
            <Clock className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trial Expired</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Your free trial has ended
          </p>
        </div>

        <div className="card p-6 mb-6 space-y-6">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {farm?.name || 'Your farm'} is locked
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                All features are temporarily unavailable until your account is upgraded to full access.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Contact your administrator to upgrade your account:
            </p>

            <div className="space-y-3">
              {supportPhone && (
                <a
                  href={`tel:${supportPhone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-primary-700 dark:text-primary-300">Call Support</p>
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">{supportPhone}</p>
                  </div>
                </a>
              )}

              {supportEmail && (
                <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{supportEmail}</p>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Copy email"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              )}

              {!supportPhone && !supportEmail && (
                <p className="text-sm text-gray-400 italic">
                  No support contact available. Please reach out to the person who set up your account.
                </p>
              )}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Your data is safe</p>
              <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                All your animals, records, and farm data are preserved. Everything will be available as soon as your account is reactivated.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Button variant="secondary" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4" />
            Back to Login
          </Button>
          <p className="text-xs text-gray-400">
            FarmWise — Farm Smarter, Grow Further
          </p>
        </div>
      </div>
    </div>
  );
}