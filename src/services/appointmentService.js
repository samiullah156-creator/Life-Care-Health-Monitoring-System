import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';

export const createAppointment = async (userId, doctorId, date, time, notes = '') => {
  const ref = await addDoc(collection(db, 'appointments'), {
    userId,
    doctorId,
    date,
    time,
    status: 'pending',
    notes,
    reportUrls: [],
    recommendedDietPlanId: null,
    dietNotes: null,
    createdAt: Timestamp.now(),
  });
  return ref.id;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  await updateDoc(doc(db, 'appointments', appointmentId), { status });
};

export const addReportToAppointment = async (appointmentId, reportUrl) => {
  await updateDoc(doc(db, 'appointments', appointmentId), {
    reportUrls: arrayUnion(reportUrl),
  });
};

export const updateAppointmentDiet = async (appointmentId, recommendedDietPlanId, dietNotes) => {
  await updateDoc(doc(db, 'appointments', appointmentId), {
    recommendedDietPlanId: recommendedDietPlanId || null,
    dietNotes: dietNotes || null,
  });
};

export const getAppointmentsByUser = async (userId) => {
  const q = query(collection(db, 'appointments'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return list;
};

export const getAppointmentsByDoctor = async (doctorId) => {
  const q = query(collection(db, 'appointments'), where('doctorId', '==', doctorId));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return list;
};

export const getAllAppointments = async () => {
  const snap = await getDocs(collection(db, 'appointments'));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return list;
};

export const getAppointment = async (id) => {
  const snap = await getDoc(doc(db, 'appointments', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
