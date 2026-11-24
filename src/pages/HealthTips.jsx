import { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modals/Modal';

export default function HealthTips() {
  const { user, role } = useAuth();
  const { data: tips, loading } = useCollection('healthTips');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canAdd = role === 'doctor';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'healthTips'), {
        title,
        description,
        createdByDoctor: user?.uid,
      });
      setTitle('');
      setDescription('');
      setModalOpen(false);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Tips</h1>
          <p className="text-gray-600 text-sm mt-1">Tips from doctors for every user to follow for better health.</p>
        </div>
        {canAdd && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-life-blue text-white font-medium hover:bg-life-blue-dark"
          >
            Add Tip
          </button>
        )}
      </div>
      <div className="space-y-4">
        {(tips || []).map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{t.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{t.description}</p>
          </div>
        ))}
      </div>
      {(!tips || tips.length === 0) && (
        <p className="text-gray-500">No health tips yet.</p>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Health Tip">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-life-blue text-white font-medium disabled:opacity-70">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
