import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getDoctorsByStatus(status) {
  const q = status
    ? query(collection(db, 'doctors'), where('verificationStatus', '==', status))
    : collection(db, 'doctors');
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  return list;
}

export async function getAllDoctors() {
  const snap = await getDocs(collection(db, 'doctors'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateDoctorVerification(doctorId, verificationStatus, adminComment = null) {
  const updates = {
    verificationStatus,
    adminComment: adminComment ?? null,
    approved: verificationStatus === 'approved',
  };
  await updateDoc(doc(db, 'doctors', doctorId), updates);
}

export async function getAdminStats() {
  const [usersSnap, doctorsSnap, appointmentsSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'doctors')),
    getDocs(collection(db, 'appointments')),
  ]);
  const doctors = doctorsSnap.docs.map((d) => d.data());
  const pending = doctors.filter((d) => (d.verificationStatus || (d.approved ? 'approved' : 'pending')) === 'pending').length;
  return {
    totalUsers: usersSnap.docs.length,
    totalDoctors: doctorsSnap.docs.length,
    pendingDoctorRequests: pending,
    totalAppointments: appointmentsSnap.docs.length,
  };
}
