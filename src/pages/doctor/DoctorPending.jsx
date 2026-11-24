import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/authService';

export default function DoctorPending() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-life-bg-alt flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Profile under verification</h1>
        <p className="text-gray-600 mb-6">
          Thank you, Dr. {user?.name || 'Doctor'}. Your profile and documents are being reviewed by our admin team. You will be able to access the doctor dashboard once approved.
        </p>
        <p className="text-sm text-gray-500 mb-6">This usually takes 1–2 business days.</p>
        <button
          type="button"
          onClick={() => signOut()}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Sign out
        </button>
        <p className="mt-4 text-sm text-gray-500">
          <Link to="/" className="text-life-blue hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
