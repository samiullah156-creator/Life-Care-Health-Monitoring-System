import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/authService';

export default function DoctorRejected() {
  const { user } = useAuth();
  const adminComment = user?.adminComment;

  return (
    <div className="min-h-screen bg-life-bg-alt flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Profile not approved</h1>
        <p className="text-gray-600 mb-4">
          Your doctor profile was not approved. Please contact the admin for more information.
        </p>
        {adminComment && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-left text-sm text-gray-700">
            <span className="font-medium">Admin note: </span>{adminComment}
          </div>
        )}
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
