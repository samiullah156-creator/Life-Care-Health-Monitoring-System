import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/Sidebar/DashboardSidebar';
import {
  HomeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  FilmIcon,
  LightBulbIcon,
} from '../components/Icons';

const links = [
  { to: '/user', label: 'Dashboard', icon: HomeIcon },
  { to: '/user/profile', label: 'Health Profile', icon: UserCircleIcon },
  { to: '/user/appointments', label: 'Appointments', icon: CalendarDaysIcon },
  { to: '/user/doctors', label: 'Doctors', icon: UserGroupIcon },
  { to: '/user/diet-plans', label: 'Diet Plans', icon: BookOpenIcon },
  { to: '/user/exercises', label: 'Exercises', icon: ChartBarIcon },
  { to: '/user/recipes', label: 'Recipes', icon: FilmIcon },
  { to: '/user/health-tips', label: 'Health Tips', icon: LightBulbIcon },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar links={links} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
