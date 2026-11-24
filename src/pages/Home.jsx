import { Link } from 'react-router-dom';
import LandingNavbar from '../components/Navbar/LandingNavbar';
import FeatureCard from '../components/Cards/FeatureCard';
import Logo from '../components/Logo';
import {
  HeartIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
} from '../components/Icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      <LandingNavbar />
      {/* Admin entry: bottom-left icon → admin-only login/signup (no User/Doctor options) */}
      <Link
        to="/admin-auth"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/80 text-gray-300 hover:bg-gray-800 hover:text-white text-sm transition"
        title="Admin login"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        <span>Admin</span>
      </Link>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Take Care of Your Health Easily
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Manage your diet, exercise, and doctor appointments all in one place. Your health journey starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-life-blue text-white font-medium text-base hover:bg-life-blue-dark transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/#features"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-life-blue text-life-blue font-medium text-base hover:bg-blue-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Everything You Need */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Everything You Need for Better Health
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive tools to help you stay healthy and active
          </p>
        </div>
        <div id="features" className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
          <FeatureCard
            icon={HeartIcon}
            title="Diet Plan Management"
            description="Track your daily meals, calories, and nutritional intake. Get personalized diet recommendations."
          />
          <FeatureCard
            icon={ChartBarIcon}
            title="Exercise Guidance"
            description="Follow structured workout plans, track your progress, and stay motivated with daily goals."
          />
          <FeatureCard
            icon={CalendarDaysIcon}
            title="Doctor Appointments"
            description="Book appointments with healthcare professionals and manage your medical schedule seamlessly."
          />
        </div>
      </section>

      {/* Why Choose Life Care */}
      <section id="about" className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Why Choose Life Care?
            </h2>
            <ul className="space-y-6">
              {[
                { title: 'Easy to Use', desc: 'Simple and intuitive interface designed for everyone' },
                { title: 'All-in-One Platform', desc: 'Manage diet, exercise, and appointments in one place' },
                { title: '24/7 Health Assistant', desc: 'Access health tips and guidance whenever you need' },
                { title: 'Progress Tracking', desc: 'Monitor your health journey with clear insights' },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-life-blue shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center w-64 h-64">
              <svg
                className="w-32 h-32 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-life-blue py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of users managing their health with Life Care
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-life-blue font-semibold text-base hover:bg-gray-100 transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-life-footer text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <Logo className="h-8 w-8" light />
              <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                Your trusted partner in managing health and wellness.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/#features" className="hover:text-white">Features</Link></li>
                <li><Link to="/#" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/#" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/#about" className="hover:text-white">About</Link></li>
                <li><Link to="/#" className="hover:text-white">Blog</Link></li>
                <li><Link to="/#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/#" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/#" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            © 2026 Life Care. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
