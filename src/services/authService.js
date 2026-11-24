import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const signUp = async (email, password, displayName, role = 'user') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  const userData = {
    id: userCredential.user.uid,
    name: displayName || '',
    email,
    role,
    phone: '',
    age: '',
    gender: '',
    address: '',
    weight: '',
    height: '',
    healthGoals: '',
  };
  if (role === 'doctor') {
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    return userCredential;
  }
  await setDoc(doc(db, 'users', userCredential.user.uid), userData);
  return userCredential;
}

/** Only auth + users doc for doctor; doctor profile is created on DoctorRegister page with documents. */
export const signUpDoctorAuthOnly = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(userCredential.user, { displayName });
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    id: userCredential.user.uid,
    name: displayName || '',
    email,
    role: 'doctor',
    phone: '',
    age: '',
    gender: '',
    address: '',
    weight: '',
    height: '',
    healthGoals: '',
  });
  return userCredential;
};

export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => firebaseSignOut(auth);

export const getCurrentUserRole = async (uid) => {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) return userSnap.data().role;
  const doctorSnap = await getDoc(doc(db, 'doctors', uid));
  if (doctorSnap.exists()) return 'doctor';
  return null;
};

/** Create user profile in Firestore if missing (e.g. sign-up failed earlier due to rules). */
export const ensureUserProfile = async (uid, email, displayName = '') => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return;
  await setDoc(userRef, {
    id: uid,
    name: displayName || '',
    email: email || '',
    role: 'user',
    phone: '',
    age: '',
    gender: '',
    address: '',
    weight: '',
    height: '',
    healthGoals: '',
  });
};

/** Admin signup: only with valid invite code. Creates user with role 'admin'. */
export const signUpAdmin = async (email, password, displayName, inviteCode) => {
  const validCode = import.meta.env.VITE_ADMIN_INVITE_CODE || 'SHCMS_ADMIN_2026';
  if (!inviteCode || String(inviteCode).trim() !== validCode) {
    throw new Error('Invalid admin invite code.');
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(userCredential.user, { displayName });
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    id: userCredential.user.uid,
    name: displayName || '',
    email,
    role: 'admin',
    phone: '',
    age: '',
    gender: '',
    address: '',
    weight: '',
    height: '',
    healthGoals: '',
  });
  return userCredential;
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
