import { useCollection } from '../../hooks/useFirestore';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useState } from 'react';

export default function AdminDoctors() {
  const { data: doctors, loading } = useCollection('doctors');
  const [updating, setUpdating] = useState(null);

  const toggleApproved = async (d) => {
    setUpdating(d.id);
    try {
      await updateDoc(doc(db, 'doctors', d.id), { approved: !d.approved });
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this doctor? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'doctors', id));
    } catch (e) {
      alert(e.message);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctors</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(doctors || []).map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{d.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{d.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{d.specialization || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${d.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {d.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => toggleApproved(d)}
                    disabled={updating === d.id}
                    className="text-sm text-life-blue hover:underline disabled:opacity-50"
                  >
                    {d.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!doctors || doctors.length === 0) && (
          <p className="p-6 text-center text-gray-500">No doctors.</p>
        )}
      </div>
    </div>
  );
}
