import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getAppointmentsByUser,
  getAppointmentsByDoctor,
  getAllAppointments,
  updateAppointmentStatus,
  addReportToAppointment,
  updateAppointmentDiet,
} from '../services/appointmentService';
import { uploadFile } from '../services/storageService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCollection } from '../hooks/useFirestore';
import Modal from '../components/Modals/Modal';

export default function Appointments() {
  const { user, role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [uploadingReport, setUploadingReport] = useState(null);
  const { data: dietPlans } = useCollection('dietPlans');
  const [dietModal, setDietModal] = useState(null);
  const [dietPlanId, setDietPlanId] = useState('');
  const [dietNotes, setDietNotes] = useState('');
  const [savingDiet, setSavingDiet] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (role === 'admin') {
          const data = await getAllAppointments();
          if (mounted) setAppointments(data);
        } else if (role === 'doctor') {
          const data = await getAppointmentsByDoctor(user?.uid);
          if (mounted) setAppointments(data);
        } else {
          const data = await getAppointmentsByUser(user?.uid);
          if (mounted) setAppointments(data);
        }
      } catch (e) {
        if (mounted) setAppointments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user?.uid, role]);

  const resolveName = async (id, type) => {
    if (!id) return '—';
    try {
      const col = type === 'user' ? 'users' : 'doctors';
      const snap = await getDoc(doc(db, col, id));
      return snap.exists() ? snap.data().name || snap.data().email : id;
    } catch {
      return id;
    }
  };

  const [names, setNames] = useState({});
  useEffect(() => {
    appointments.forEach((apt) => {
      resolveName(apt.userId, 'user').then((n) => setNames((prev) => ({ ...prev, [apt.userId]: n })));
      resolveName(apt.doctorId, 'doctor').then((n) => setNames((prev) => ({ ...prev, [apt.doctorId]: n })));
    });
  }, [appointments]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } finally {
      setUpdating(null);
    }
  };

  const handleReportUpload = async (aptId, file) => {
    if (!file) return;
    setUploadingReport(aptId);
    try {
      const path = `appointments/${aptId}/reports/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      await addReportToAppointment(aptId, url);
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, reportUrls: [...(a.reportUrls || []), url] } : a))
      );
    } finally {
      setUploadingReport(null);
    }
  };

  const openDietModal = (apt) => {
    setDietModal(apt);
    setDietPlanId(apt.recommendedDietPlanId || '');
    setDietNotes(apt.dietNotes || '');
  };

  const handleSaveDiet = async (e) => {
    e.preventDefault();
    if (!dietModal) return;
    setSavingDiet(true);
    try {
      await updateAppointmentDiet(dietModal.id, dietPlanId || null, dietNotes);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === dietModal.id ? { ...a, recommendedDietPlanId: dietPlanId || null, dietNotes: dietNotes || null } : a
        )
      );
      setDietModal(null);
    } finally {
      setSavingDiet(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-life-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date / Time</th>
                {(role === 'doctor' || role === 'admin') && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                )}
                {(role === 'user' || role === 'admin') && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {role === 'user' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">My reports</th>}
                {role === 'user' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor’s diet plan</th>}
                {role === 'doctor' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient reports</th>}
                {role === 'doctor' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diet plan</th>}
                {role === 'doctor' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No appointments yet.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {apt.date} {apt.time}
                    </td>
                    {(role === 'doctor' || role === 'admin') && (
                      <td className="px-4 py-3 text-sm text-gray-600">{names[apt.userId] || '...'}</td>
                    )}
                    {(role === 'user' || role === 'admin') && (
                      <td className="px-4 py-3 text-sm text-gray-600">{names[apt.doctorId] || '...'}</td>
                    )}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          apt.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    {role === 'user' && (
                      <td className="px-4 py-3 text-sm">
                        <label className="cursor-pointer text-life-blue font-medium hover:underline">
                          {uploadingReport === apt.id ? 'Uploading...' : 'Upload report'}
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleReportUpload(apt.id, f);
                              e.target.value = '';
                            }}
                            disabled={uploadingReport !== null}
                          />
                        </label>
                        {(apt.reportUrls || []).length > 0 && (
                          <span className="text-gray-500 ml-1">({apt.reportUrls.length} uploaded)</span>
                        )}
                        {(apt.reportUrls || []).map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block text-xs text-life-blue mt-0.5">
                            View report {i + 1}
                          </a>
                        ))}
                      </td>
                    )}
                    {role === 'user' && (
                      <td className="px-4 py-3 text-sm">
                        {apt.recommendedDietPlanId ? (
                          <Link to="/user/diet-plans" className="text-life-blue hover:underline">View recommended plan</Link>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}
                    {role === 'doctor' && (
                      <td className="px-4 py-3 text-sm">
                        {(apt.reportUrls || []).length === 0 ? (
                          '—'
                        ) : (
                          (apt.reportUrls || []).map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block text-life-blue text-xs hover:underline">
                              Patient report {i + 1}
                            </a>
                          ))
                        )}
                      </td>
                    )}
                    {role === 'doctor' && (
                      <td className="px-4 py-3 text-sm">
                        {apt.recommendedDietPlanId ? (
                          <span className="text-green-600">Assigned</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                        <button
                          type="button"
                          onClick={() => openDietModal(apt)}
                          className="ml-1 text-life-blue text-xs font-medium hover:underline"
                        >
                          {apt.recommendedDietPlanId ? 'Edit' : 'Assign'}
                        </button>
                      </td>
                    )}
                    {role === 'doctor' && apt.status === 'pending' && (
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleStatus(apt.id, 'approved')}
                          disabled={updating === apt.id}
                          className="text-sm text-green-600 font-medium hover:underline disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatus(apt.id, 'rejected')}
                          disabled={updating === apt.id}
                          className="text-sm text-red-600 font-medium hover:underline disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!dietModal} onClose={() => setDietModal(null)} title="Assign diet plan to patient" size="sm">
        {dietModal && (
          <form onSubmit={handleSaveDiet} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diet plan</label>
              <select
                value={dietPlanId}
                onChange={(e) => setDietPlanId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">— Select —</option>
                {(dietPlans || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes for patient</label>
              <textarea
                value={dietNotes}
                onChange={(e) => setDietNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Optional instructions..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setDietModal(null)} className="px-4 py-2 rounded-lg border border-gray-300">
                Cancel
              </button>
              <button type="submit" disabled={savingDiet} className="px-4 py-2 rounded-lg bg-life-blue text-white font-medium disabled:opacity-70">
                {savingDiet ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
