import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Label from '../components/Forms/Label';
import { signUpDoctorAuthOnly } from '../services/authService';
import { createDoctorWithProfile, uploadDoctorDocuments } from '../services/doctorService';
import { getAuthErrorMessage } from '../utils/authErrors';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  gender: '',
  age: '',
  specialization: '',
  experience: '',
  licenseNumber: '',
  hospital: '',
  address: '',
  bio: '',
};

export default function DoctorRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [licenseDocument, setLicenseDocument] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!profilePhoto || !degreeCertificate || !licenseDocument) {
      setError('Please upload profile photo, degree certificate, and license document.');
      return;
    }
    setLoading(true);
    try {
      const { user } = await signUpDoctorAuthOnly(form.email, form.password, form.name);
      const urls = await uploadDoctorDocuments(user.uid, {
        profilePhoto,
        degreeCertificate,
        licenseDocument,
      });
      await createDoctorWithProfile(user.uid, form.email, form, urls);
      navigate('/doctor/pending');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-life-bg flex flex-col items-center py-8 px-4">
      <Link to="/" className="mb-6">
        <Logo />
      </Link>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Doctor Registration</h1>
        <p className="text-gray-600 text-sm mb-6">Complete your professional profile. Your account will be reviewed by admin before you can access the dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password *</Label>
              <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required minLength={6} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age *</Label>
              <input type="text" id="age" name="age" value={form.age} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization *</Label>
              <input type="text" id="specialization" name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Cardiologist, Gynaecologist" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Years of Experience *</Label>
              <input type="text" id="experience" name="experience" value={form.experience} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <Label htmlFor="licenseNumber">Medical License Number *</Label>
              <input type="text" id="licenseNumber" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </div>
          <div>
            <Label htmlFor="hospital">Hospital / Clinic Name *</Label>
            <input type="text" id="hospital" name="hospital" value={form.hospital} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <Label htmlFor="address">Address *</Label>
            <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <Label htmlFor="bio">Short Bio / Description *</Label>
            <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={3} required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <Label>Profile Photo *</Label>
            <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} required className="mt-1 block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-life-blue file:text-white" />
          </div>
          <div>
            <Label>Medical Degree Certificate (PDF or image) *</Label>
            <input type="file" accept=".pdf,image/*" onChange={(e) => setDegreeCertificate(e.target.files?.[0] || null)} required className="mt-1 block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-life-blue file:text-white" />
          </div>
          <div>
            <Label>Medical License Document (PDF or image) *</Label>
            <input type="file" accept=".pdf,image/*" onChange={(e) => setLicenseDocument(e.target.files?.[0] || null)} required className="mt-1 block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-life-blue file:text-white" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-life-blue text-white font-semibold disabled:opacity-70">
            {loading ? 'Submitting...' : 'Submit for verification'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-life-blue font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
