import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCollection } from '../../hooks/useFirestore';
import { CalendarDaysIcon, ChartBarIcon, BookOpenIcon, LightBulbIcon } from '../../components/Icons';

export default function UserDashboardHome() {
  const { user } = useAuth();
  const { data: tips } = useCollection('healthTips');
  const recentTips = (tips || []).slice(0, 3);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back, {user?.name || user?.displayName || 'User'}
      </h1>
      <p className="text-gray-600 mb-8">Here’s your health overview. Patient–doctor communication made easy.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link
          to="/user/appointments"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <CalendarDaysIcon className="w-6 h-6 text-life-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Appointments</h3>
            <p className="text-sm text-gray-500">View and manage bookings, upload reports</p>
          </div>
        </Link>
        <Link
          to="/user/diet-plans"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <BookOpenIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Diet Plans</h3>
            <p className="text-sm text-gray-500">Plans recommended by your doctor</p>
          </div>
        </Link>
        <Link
          to="/user/exercises"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Exercises</h3>
            <p className="text-sm text-gray-500">Routines and progress</p>
          </div>
        </Link>
      </div>

      {recentTips.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5 text-life-blue" />
              Health tips to follow
            </h2>
            <Link to="/user/health-tips" className="text-sm text-life-blue font-medium hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {recentTips.map((t) => (
              <li key={t.id} className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{t.title}</span> — {t.description}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
