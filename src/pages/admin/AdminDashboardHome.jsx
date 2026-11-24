import { Link } from 'react-router-dom';
import { UserGroupIcon, UserIcon, CalendarDaysIcon } from '../../components/Icons';
import { useCollection } from '../../hooks/useFirestore';

export default function AdminDashboardHome() {
  const { data: users } = useCollection('users');
  const { data: doctors } = useCollection('doctors');
  const { data: appointments } = useCollection('appointments');
  const pendingDoctors = doctors?.filter((d) => (d.verificationStatus || (d.approved ? 'approved' : 'pending')) === 'pending')?.length ?? 0;

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">System overview and quick actions</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-life-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Users</p>
            </div>
          </div>
          <Link to="/admin/users" className="mt-2 text-sm text-life-blue font-medium hover:underline">
            Manage →
          </Link>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{doctors?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Doctors</p>
            </div>
          </div>
          <Link to="/admin/doctors" className="mt-2 text-sm text-life-blue font-medium hover:underline">
            Manage →
          </Link>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{appointments?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
          </div>
          <Link to="/admin/appointments" className="mt-2 text-sm text-life-blue font-medium hover:underline">
            View →
          </Link>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
              <span className="text-lg font-bold text-red-600">{pendingDoctors}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingDoctors}</p>
              <p className="text-sm text-gray-500">Pending approvals</p>
            </div>
          </div>
          <Link to="/admin/doctors/verify" className="mt-2 text-sm text-life-blue font-medium hover:underline">
            Review →
          </Link>
        </div>
      </div>
    </div>
  );
}
