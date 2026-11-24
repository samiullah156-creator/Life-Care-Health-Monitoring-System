import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function LandingNavbar() {
  return (
    <nav className="w-full bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-8">
            <Link
              to="/#features"
              className="text-gray-600 hover:text-gray-900 font-normal text-base"
            >
              Features
            </Link>
            <Link
              to="/#about"
              className="text-gray-600 hover:text-gray-900 font-normal text-base"
            >
              About
            </Link>
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 font-normal text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-life-blue text-white px-5 py-2.5 rounded-lg font-medium text-base hover:bg-life-blue-dark transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
