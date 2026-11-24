import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { uploadFile } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';
import Label from '../components/Forms/Label';

export default function Profile() {
  const { user, role } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    weight: '',
    height: '',
    healthGoals: '',
    ...(role === 'doctor' && { specialization: '', experience: '', bio: '' }),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (user) {
      setPhotoURL(user.photoURL || '');
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || '',
        address: user.address || '',
        weight: user.weight || '',
        height: user.height || '',
        healthGoals: user.healthGoals || '',
        ...(role === 'doctor' && {
          specialization: user.specialization || '',
          experience: user.experience || '',
          bio: user.bio || '',
        }),
      }));
    }
  }, [user, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;
    setUploadingPhoto(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `avatars/${user.uid}/avatar.${ext}`;
      const url = await uploadFile(file, path);
      const col = role === 'doctor' ? 'doctors' : 'users';
      await updateDoc(doc(db, col, user.uid), { photoURL: url });
      setPhotoURL(url);
    } catch (err) {
      setMessage(err.message || 'Photo upload failed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const col = role === 'doctor' ? 'doctors' : 'users';
      const { id, ...data } = form;
      if (role === 'doctor') {
        const profileCompleted = !!(data.name?.trim() && data.specialization?.trim() && data.bio?.trim());
        await updateDoc(doc(db, col, user.uid), { ...data, profileCompleted });
      } else {
        await updateDoc(doc(db, col, user.uid), data);
      }
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {role === 'doctor' ? 'Professional Profile' : 'Health Profile'}
      </h1>
      <div className="mb-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {photoURL ? (
            <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-2xl font-semibold">{(form.name || 'U').charAt(0)}</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={uploadingPhoto}
            className="block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-life-blue file:text-white file:text-sm"
          />
          {uploadingPhoto && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
          />
        </div>
        {role === 'doctor' && (
          <>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience (years)</Label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
              />
            </div>
          </>
        )}
        {role === 'user' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="healthGoals">Health Goals</Label>
              <textarea
                id="healthGoals"
                name="healthGoals"
                value={form.healthGoals}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
              />
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-life-blue text-white font-medium hover:bg-life-blue-dark disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
