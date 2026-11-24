import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Label from '../components/Forms/Label';
import InputWithIcon from '../components/Forms/InputWithIcon';
import { EnvelopeIcon, LockClosedIcon } from '../components/Icons';
import { signIn, getCurrentUserRole } from '../services/authService';
import { auth } from '../services/firebase';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAs, setLoginAs] = useState('user');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      const uid = auth.currentUser?.uid;
      let role = uid ? await getCurrentUserRole(uid) : loginAs;
      if (role == null) role = loginAs;
      if (role === 'admin') navigate('/admin');
      else if (role === 'doctor') navigate('/doctor');
      else navigate('/user');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-life-bg-alt flex flex-col items-center justify-center px-4 py-8">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-gray-600 text-base mb-6">Sign in to your account to continue</p>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
          If your browser shows a &quot;Change your password&quot; or data-breach warning, that’s from Google Password Manager. Click <strong>OK</strong> to dismiss it; sign-in will still complete.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</div>
          )}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <InputWithIcon
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={EnvelopeIcon}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <InputWithIcon
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={LockClosedIcon}
              required
            />
          </div>
          <div>
            <Label>Login As</Label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loginAs"
                  checked={loginAs === 'user'}
                  onChange={() => setLoginAs('user')}
                  className="w-4 h-4 text-life-blue border-gray-300 focus:ring-life-blue"
                />
                <span className="text-gray-900">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loginAs"
                  checked={loginAs === 'doctor'}
                  onChange={() => setLoginAs('doctor')}
                  className="w-4 h-4 text-life-blue border-gray-300 focus:ring-life-blue"
                />
                <span className="text-gray-900">Doctor</span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-life-blue focus:ring-life-blue"
              />
              <span className="text-gray-900 text-sm">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-life-blue text-sm font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-life-blue text-white font-semibold text-base hover:bg-life-blue-dark transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-life-blue font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
