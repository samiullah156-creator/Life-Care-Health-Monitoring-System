import { Link } from 'react-router-dom';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function DoctorCard({ doctor }) {
  const status = doctor.verificationStatus || (doctor.approved ? 'approved' : 'pending');
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{doctor.name || '—'}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-life-blue mt-0.5">{doctor.specialization || '—'}</p>
          <p className="text-sm text-gray-500 mt-0.5">{doctor.hospital || '—'}</p>
          <p className="text-xs text-gray-400 mt-1">License: {doctor.licenseNumber || '—'}</p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <Link
            to={`/admin/doctors/verify/${doctor.id}`}
            className="text-sm text-life-blue font-medium hover:underline"
          >
            View profile
          </Link>
        </div>
      </div>
    </div>
  );
}
