import { Link } from 'react-router-dom';

export default function DoctorProfileCompleteBanner() {
  return (
    <div className="mx-6 mt-6 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <p className="text-amber-800 font-medium">Complete your profile so patients can find you.</p>
      <p className="text-amber-700 text-sm mt-1">Add your name, specialization, and bio, then save. You will appear in the doctor list only after your profile is complete and approved.</p>
      <Link
        to="/doctor/profile"
        className="inline-block mt-3 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
      >
        Complete profile →
      </Link>
    </div>
  );
}
