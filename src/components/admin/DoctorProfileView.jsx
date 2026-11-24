import DocumentViewer from './DocumentViewer';

export default function DoctorProfileView({ doctor }) {
  if (!doctor) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {doctor.profilePhotoUrl && (
          <img src={doctor.profilePhotoUrl} alt={doctor.name} className="w-24 h-24 rounded-full object-cover border border-gray-200" />
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
          <p className="text-life-blue">{doctor.specialization}</p>
          <p className="text-sm text-gray-500">{doctor.email}</p>
        </div>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div><dt className="text-gray-500">Phone</dt><dd className="font-medium">{doctor.phone || '—'}</dd></div>
        <div><dt className="text-gray-500">Gender</dt><dd className="font-medium">{doctor.gender || '—'}</dd></div>
        <div><dt className="text-gray-500">Age</dt><dd className="font-medium">{doctor.age || '—'}</dd></div>
        <div><dt className="text-gray-500">Experience</dt><dd className="font-medium">{doctor.experience ? `${doctor.experience} years` : '—'}</dd></div>
        <div><dt className="text-gray-500">License number</dt><dd className="font-medium">{doctor.licenseNumber || '—'}</dd></div>
        <div><dt className="text-gray-500">Hospital / Clinic</dt><dd className="font-medium">{doctor.hospital || '—'}</dd></div>
        <div className="sm:col-span-2"><dt className="text-gray-500">Address</dt><dd className="font-medium">{doctor.address || '—'}</dd></div>
        <div className="sm:col-span-2"><dt className="text-gray-500">Bio</dt><dd className="font-medium">{doctor.bio || '—'}</dd></div>
      </dl>
      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Uploaded documents</h3>
        <DocumentViewer label="Profile photo" url={doctor.profilePhotoUrl} />
        <DocumentViewer label="Medical degree certificate" url={doctor.degreeCertificateUrl} />
        <DocumentViewer label="Medical license document" url={doctor.licenseDocumentUrl} />
      </div>
    </div>
  );
}
