import { useState, useMemo } from 'react';
import { useCollection } from '../hooks/useFirestore';
import Modal from '../components/Modals/Modal';
import { createAppointment } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';

function isProfileComplete(d) {
  return d.profileCompleted !== false && d.name?.trim() && d.specialization?.trim() && d.bio?.trim();
}

function matchesSearch(d, keyword) {
  if (!keyword.trim()) return true;
  const k = keyword.toLowerCase().trim();
  const name = (d.name || '').toLowerCase();
  const spec = (d.specialization || '').toLowerCase();
  const bio = (d.bio || '').toLowerCase();
  return name.includes(k) || spec.includes(k) || bio.includes(k);
}

export default function Doctors() {
  const { user } = useAuth();
  const { data: doctors, loading } = useCollection('doctors');
  const [search, setSearch] = useState('');
  const isApproved = (d) => d.verificationStatus === 'approved' || (d.approved === true && d.verificationStatus !== 'rejected');
  const approvedAndComplete = useMemo(
    () => (doctors || []).filter((d) => isApproved(d) && isProfileComplete(d)),
    [doctors]
  );
  const filtered = useMemo(
    () => approvedAndComplete.filter((d) => matchesSearch(d, search)),
    [approvedAndComplete, search]
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openBook = (doctor) => {
    setSelected(doctor);
    setDate('');
    setTime('');
    setNotes('');
    setModalOpen(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selected || !date || !time) return;
    setSubmitting(true);
    try {
      await createAppointment(user.uid, selected.id, date, time, notes);
      setModalOpen(false);
      setSelected(null);
    } finally {
      setSubmitting(false);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find a Doctor</h1>
      <p className="text-gray-600 mb-4">Search by name or specialization (e.g. gynaecologist, cardiologist) to see registered doctors with completed profiles.</p>
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:border-life-blue focus:ring-1 focus:ring-life-blue"
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{doc.name}</h3>
              {isApproved(doc) && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800" title="Verified by admin">Verified</span>
              )}
            </div>
            <p className="text-sm text-life-blue">{doc.specialization || 'General'}</p>
            <p className="text-sm text-gray-500 mt-1">{doc.experience ? `${doc.experience} years exp.` : ''}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doc.bio}</p>
            <button
              onClick={() => openBook(doc)}
              className="mt-4 w-full py-2 rounded-lg bg-life-blue text-white text-sm font-medium hover:bg-life-blue-dark"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-gray-500">
          {search ? 'No doctors match your search. Try a different keyword.' : 'No approved doctors with completed profiles yet.'}
        </p>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Book Appointment" size="sm">
        {selected && (
          <form onSubmit={handleBook} className="space-y-4">
            <p className="text-sm text-gray-600">
              Booking with <strong>{selected.name}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-life-blue text-white font-medium disabled:opacity-70">
                {submitting ? 'Booking...' : 'Book'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
