import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById } from '../../services/doctorService';
import { updateDoctorVerification } from '../../services/adminService';
import DoctorProfileView from '../../components/admin/DoctorProfileView';

export default function AdminDoctorReview() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminComment, setAdminComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    getDoctorById(doctorId)
      .then(setDoctor)
      .finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => {
    if (doctor?.adminComment) setAdminComment(doctor.adminComment);
  }, [doctor]);

  const handleApprove = async () => {
    setUpdating(true);
    try {
      await updateDoctorVerification(doctorId, 'approved', adminComment || null);
      navigate('/admin/doctors/verify');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!adminComment.trim()) {
      alert('Please add a comment for the doctor before rejecting.');
      return;
    }
    setUpdating(true);
    try {
      await updateDoctorVerification(doctorId, 'rejected', adminComment);
      navigate('/admin/doctors/verify');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-life-blue border-t-transparent" />
      </div>
    );
  }
  if (!doctor) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-gray-500">Doctor not found.</p>
        <button onClick={() => navigate('/admin/doctors/verify')} className="mt-2 text-life-blue hover:underline">Back to verification</button>
      </div>
    );
  }

  const status = doctor.verificationStatus || (doctor.approved ? 'approved' : 'pending');

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <button onClick={() => navigate('/admin/doctors/verify')} className="text-sm text-life-blue hover:underline mb-4">← Back to verification</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review doctor profile</h1>
      <DoctorProfileView doctor={doctor} />

      <div className="mt-8 pt-6 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-1">Admin comment (optional for approve; required for reject)</label>
        <textarea
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4"
          placeholder="Add a note for the doctor..."
        />
        <div className="flex gap-3">
          {status !== 'approved' && (
            <button
              onClick={handleApprove}
              disabled={updating}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-70"
            >
              {updating ? 'Updating...' : 'Approve'}
            </button>
          )}
          {status !== 'rejected' && (
            <button
              onClick={handleReject}
              disabled={updating || !adminComment.trim()}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-70"
            >
              {updating ? 'Updating...' : 'Reject'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
