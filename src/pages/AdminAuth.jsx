import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Label from '../components/Forms/Label';
import InputWithIcon from '../components/Forms/InputWithIcon';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '../components/Icons';
import { signIn, signOut, getCurrentUserRole, signUpAdmin } from '../services/authService';
import { auth } from '../services/firebase';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function AdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      const uid = auth.currentUser?.uid;
      const role = uid ? await getCurrentUserRole(uid) : null;
      if (role !== 'admin') {
        await signOut();
        setError('This is not an admin account. Use the main Login page for user or doctor. To access admin, create an admin account below (Sign up tab) with the invite code.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUpAdmin(email, password, name, inviteCode.trim());
      navigate('/admin');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-life-bg-alt flex flex-col items-center justify-center px-4 py-8">
      <Link to="/" className="mb-6">
        <Logo />
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
          <p className="text-gray-600 text-sm mt-1">Sign in or create an admin account</p>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3 text-left">
            Only <strong>admin</strong> accounts can log in here. Doctor and user accounts must use the main <Link to="/login" className="text-life-blue underline">Login</Link> page. Don&apos;t have an admin account? Use the <strong>Sign up</strong> tab below with your admin invite code.
          </p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium ${mode === 'login' ? 'border-b-2 border-life-blue text-life-blue' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium ${mode === 'signup' ? 'border-b-2 border-life-blue text-life-blue' : 'text-gray-500'}`}
          >
            Sign up
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <InputWithIcon
                type="email"
                id="admin-email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={EnvelopeIcon}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <InputWithIcon
                type="password"
                id="admin-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={LockClosedIcon}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-life-blue text-white font-semibold disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Admin login'}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="admin-name">Full name</Label>
              <InputWithIcon
                type="text"
                id="admin-name"
                placeholder="Admin name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={UserIcon}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-signup-email">Email</Label>
              <InputWithIcon
                type="email"
                id="admin-signup-email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={EnvelopeIcon}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-signup-password">Password</Label>
              <InputWithIcon
                type="password"
                id="admin-signup-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={LockClosedIcon}
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="admin-confirm">Confirm password</Label>
              <input
                type="password"
                id="admin-confirm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4"
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-code">Admin invite code</Label>
              <input
                type="password"
                id="admin-code"
                placeholder="Enter admin invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Required to create an admin account.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-life-blue text-white font-semibold disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create admin account'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="text-life-blue hover:underline">Back to home</Link>
          {' · '}
          <Link to="/login" className="text-life-blue hover:underline">User / Doctor login</Link>
        </p>
      </div>
    </div>
  );
}
