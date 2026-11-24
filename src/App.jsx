import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorVerificationGate from './components/DoctorVerificationGate';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorRegister from './pages/DoctorRegister';
import ForgotPassword from './pages/ForgotPassword';
import AdminAuth from './pages/AdminAuth';
import DoctorPending from './pages/doctor/DoctorPending';
import DoctorRejected from './pages/doctor/DoctorRejected';

import UserDashboard from './pages/UserDashboard';
import UserDashboardHome from './pages/user/UserDashboardHome';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import DietPlans from './pages/DietPlans';
import Exercises from './pages/Exercises';
import Recipes from './pages/Recipes';
import HealthTips from './pages/HealthTips';

import DoctorDashboard from './pages/DoctorDashboard';
import DoctorDashboardHome from './pages/doctor/DoctorDashboardHome';
import Availability from './pages/doctor/Availability';
import DietRecommendations from './pages/doctor/DietRecommendations';

import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminReports from './pages/admin/AdminReports';
import AdminContent from './pages/admin/AdminContent';
import AdminDoctorVerification from './pages/admin/AdminDoctorVerification';
import AdminDoctorReview from './pages/admin/AdminDoctorReview';

function RedirectByRole() {
  const { user, role, loading } = useAuth();
  if (loading || !user) return null;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'doctor') return <Navigate to="/doctor" replace />;
  return <Navigate to="/user" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin-auth" element={<AdminAuth />} />
      <Route path="/dashboard" element={<RedirectByRole />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="diet-plans" element={<DietPlans />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="health-tips" element={<HealthTips />} />
      </Route>

      <Route path="/doctor/pending" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPending /></ProtectedRoute>} />
      <Route path="/doctor/rejected" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorRejected /></ProtectedRoute>} />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorVerificationGate>
              <DoctorDashboard />
            </DoctorVerificationGate>
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="availability" element={<Availability />} />
        <Route path="health-tips" element={<HealthTips />} />
        <Route path="diet-recommendations" element={<DietRecommendations />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="doctors/verify" element={<AdminDoctorVerification />} />
        <Route path="doctors/verify/:doctorId" element={<AdminDoctorReview />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="statistics" element={<AdminStatistics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="content" element={<AdminContent />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
