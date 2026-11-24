import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarDaysIcon, UserGroupIcon } from '../../components/Icons';

export default function DoctorDashboardHome() {
  const { user } = useAuth();
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome, Dr. {user?.name || user?.displayName || 'Doctor'}
      </h1>
      <p className="text-gray-600 mb-8">Manage your practice and appointments</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/doctor/appointments"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <CalendarDaysIcon className="w-6 h-6 text-life-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Appointments</h3>
            <p className="text-sm text-gray-500">View and manage requests</p>
          </div>
        </Link>
        <Link
          to="/doctor/availability"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Availability</h3>
            <p className="text-sm text-gray-500">Set your schedule</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
