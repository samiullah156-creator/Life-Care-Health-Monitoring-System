import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/** Renders children only if doctor is approved; otherwise redirects to pending/rejected. */
export default function DoctorVerificationGate({ children }) {
  const { user, role } = useAuth();
  if (role !== 'doctor') return children;
  const status = user?.verificationStatus ?? (user?.approved ? 'approved' : 'pending');
  if (status === 'pending') return <Navigate to="/doctor/pending" replace />;
  if (status === 'rejected') return <Navigate to="/doctor/rejected" replace />;
  return children;
}
