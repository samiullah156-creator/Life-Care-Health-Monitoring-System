import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import Logo from '../components/Logo';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-life-bg-alt flex flex-col items-center justify-center px-4">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h1>
        <p className="text-gray-600 text-sm mb-6">
          Enter your email and we’ll send you a link to reset your password.
        </p>
        {sent ? (
          <p className="text-green-600 text-sm mb-4">Check your email for the reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                placeholder="john@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-life-blue text-white font-semibold hover:bg-life-blue-dark disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/login" className="text-life-blue font-medium hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
