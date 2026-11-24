import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Label from '../components/Forms/Label';
import InputWithIcon from '../components/Forms/InputWithIcon';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '../components/Icons';
import { signUp } from '../services/authService';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registerAs: 'user',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.registerAs === 'doctor') {
      navigate('/register/doctor');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!form.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.fullName, form.registerAs);
      navigate('/user');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-life-bg flex flex-col items-center justify-center px-4 py-8">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
        <p className="text-gray-600 text-base mb-6">Join us and start your health journey</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              {error}
              {error.includes('already registered') && (
                <Link to="/login" className="block mt-2 text-life-blue font-medium hover:underline">
                  Go to Sign In →
                </Link>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <InputWithIcon
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              icon={UserIcon}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <InputWithIcon
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
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
              value={form.password}
              onChange={handleChange}
              icon={LockClosedIcon}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWithIcon
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              icon={LockClosedIcon}
              required
            />
          </div>
          <div>
            <Label>Register As</Label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="registerAs"
                  value="user"
                  checked={form.registerAs === 'user'}
                  onChange={handleChange}
                  className="w-4 h-4 text-life-blue border-gray-300 focus:ring-life-blue"
                />
                <span className="text-gray-900">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="registerAs"
                  value="doctor"
                  checked={form.registerAs === 'doctor'}
                  onChange={handleChange}
                  className="w-4 h-4 text-life-blue border-gray-300 focus:ring-life-blue"
                />
                <span className="text-gray-900">Doctor</span>
              </label>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-life-blue focus:ring-life-blue"
            />
            <label htmlFor="agreeTerms" className="text-gray-700 text-sm">
              I agree to the{' '}
              <Link to="/terms" className="text-life-blue hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-life-blue hover:underline">Privacy Policy</Link>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-life-blue text-white font-semibold text-base hover:bg-life-blue-dark transition disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-life-blue font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
