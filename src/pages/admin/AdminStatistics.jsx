import { useCollection } from '../../hooks/useFirestore';
import { ChartBarIcon, UserGroupIcon, UserIcon, CalendarDaysIcon } from '../../components/Icons';

export default function AdminStatistics() {
  const { data: users } = useCollection('users');
  const { data: doctors } = useCollection('doctors');
  const { data: appointments } = useCollection('appointments');
  const approved = appointments?.filter((a) => a.status === 'approved')?.length ?? 0;
  const pending = appointments?.filter((a) => a.status === 'pending')?.length ?? 0;

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <UserIcon className="w-10 h-10 text-life-blue" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{users?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <UserGroupIcon className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{doctors?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Doctors</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <CalendarDaysIcon className="w-10 h-10 text-amber-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{appointments?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Total Appointments</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <ChartBarIcon className="w-10 h-10 text-gray-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{approved} / {pending}</p>
            <p className="text-sm text-gray-500">Approved / Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
