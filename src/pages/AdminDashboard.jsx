import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/Sidebar/DashboardSidebar';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
} from '../components/Icons';

const links = [
  { to: '/admin', label: 'Dashboard', icon: HomeIcon },
  { to: '/admin/users', label: 'Users', icon: UserIcon },
  { to: '/admin/doctors', label: 'Doctors', icon: UserGroupIcon },
  { to: '/admin/doctors/verify', label: 'Doctor verification', icon: UserGroupIcon },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarDaysIcon },
  { to: '/admin/content', label: 'Content', icon: BookOpenIcon },
  { to: '/admin/statistics', label: 'Statistics', icon: ChartBarIcon },
  { to: '/admin/reports', label: 'Reports', icon: DocumentChartBarIcon },
];

const developerCredit = (
  <p className="text-xs text-gray-500 text-center">
    Developed by{' '}
    <a
      href="https://www.facebook.com/share/1ZnLnvcNmZ/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-life-blue hover:underline font-medium"
    >
      Syed Muhammad Hussnain Bukhari
    </a>
  </p>
);

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar links={links} footer={developerCredit} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
