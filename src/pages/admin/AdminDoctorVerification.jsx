import { useState, useEffect } from 'react';
import { getDoctorsByStatus } from '../../services/adminService';
import DoctorCard from '../../components/admin/DoctorCard';

export default function AdminDoctorVerification() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    let mounted = true;
    const status = filter === 'all' ? null : filter;
    getDoctorsByStatus(status)
      .then((list) => { if (mounted) setDoctors(list); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [filter]);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-life-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor verification</h1>
      <p className="text-gray-600 mb-6">Review and approve or reject doctor applications.</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              filter === f ? 'bg-life-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
      </div>
      {doctors.length === 0 && (
        <p className="text-gray-500">No doctors in this category.</p>
      )}
    </div>
  );
}
