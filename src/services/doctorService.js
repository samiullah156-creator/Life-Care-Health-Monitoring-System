import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getDoctorDocumentDataUrls } from '../utils/fileToDataUrl';

const DOCTOR_DOCS_PATH = 'doctors';

export async function createDoctorWithProfile(uid, email, profile, documentUrls) {
  const doctorData = {
    id: uid,
    name: profile.name || '',
    email,
    phone: profile.phone || '',
    gender: profile.gender || '',
    age: profile.age || '',
    specialization: profile.specialization || '',
    experience: profile.experience || '',
    licenseNumber: profile.licenseNumber || '',
    hospital: profile.hospital || '',
    address: profile.address || '',
    bio: profile.bio || '',
    profilePhotoUrl: documentUrls.profilePhotoUrl || null,
    degreeCertificateUrl: documentUrls.degreeCertificateUrl || null,
    licenseDocumentUrl: documentUrls.licenseDocumentUrl || null,
    verificationStatus: 'pending',
    adminComment: null,
    availability: {},
    approved: false,
    profileCompleted: true,
    createdAt: Timestamp.now(),
  };
  await setDoc(doc(db, DOCTOR_DOCS_PATH, uid), doctorData);
  return doctorData;
}

/**
 * Convert doctor uploads to data URLs for storing in Firestore (no Storage used).
 */
export async function uploadDoctorDocuments(uid, files) {
  return getDoctorDocumentDataUrls(files);
}

export async function getDoctorById(doctorId) {
  const snap = await getDoc(doc(db, DOCTOR_DOCS_PATH, doctorId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateDoctorProfile(doctorId, data) {
  const allowed = { ...data };
  delete allowed.verificationStatus;
  delete allowed.adminComment;
  delete allowed.approved;
  await updateDoc(doc(db, DOCTOR_DOCS_PATH, doctorId), allowed);
}
