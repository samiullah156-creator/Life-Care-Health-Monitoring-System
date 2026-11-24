import { NavLink, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { signOut } from '../../services/authService';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-life-blue text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

export default function DashboardSidebar({ links, footer }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut();
    navigate('/');
  };
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/">
          <Logo className="h-8 w-8" />
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            {Icon && <Icon className="w-5 h-5 shrink-0" />}
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          Logout
        </button>
      </div>
      {footer && <div className="p-3 border-t border-gray-100">{footer}</div>}
    </aside>
  );
}
