import { useCollection } from '../../hooks/useFirestore';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useState } from 'react';

export default function AdminUsers() {
  const { data: users, loading } = useCollection('users');
  const [deleting, setDeleting] = useState(null);
  const list = users?.filter((u) => u.role !== 'admin') ?? [];

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'users', id));
    } finally {
      setDeleting(null);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{u.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.role || 'user'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={deleting === u.id}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p className="p-6 text-center text-gray-500">No users.</p>
        )}
      </div>
    </div>
  );
}
