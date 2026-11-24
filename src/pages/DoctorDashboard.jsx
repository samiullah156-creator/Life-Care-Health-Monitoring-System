import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/Sidebar/DashboardSidebar';
import DoctorProfileCompleteBanner from '../components/DoctorProfileCompleteBanner';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  LightBulbIcon,
  BookOpenIcon,
} from '../components/Icons';

const links = [
  { to: '/doctor', label: 'Dashboard', icon: HomeIcon },
  { to: '/doctor/profile', label: 'Profile', icon: UserCircleIcon },
  { to: '/doctor/appointments', label: 'Appointments', icon: CalendarDaysIcon },
  { to: '/doctor/availability', label: 'Availability', icon: ClockIcon },
  { to: '/doctor/health-tips', label: 'Health Tips', icon: LightBulbIcon },
  { to: '/doctor/diet-recommendations', label: 'Diet Recommendations', icon: BookOpenIcon },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const profileComplete = user?.profileCompleted === true || !!(user?.name?.trim() && user?.specialization?.trim() && user?.bio?.trim());

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar links={links} />
      <main className="flex-1 overflow-auto">
        {!profileComplete && <DoctorProfileCompleteBanner />}
        <Outlet />
      </main>
    </div>
  );
}
