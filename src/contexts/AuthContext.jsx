import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getCurrentUserRole, ensureUserProfile } from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      let userRole = await getCurrentUserRole(firebaseUser.uid);
      // If no Firestore profile (e.g. sign-up failed earlier), create one so login works
      if (userRole == null) {
        await ensureUserProfile(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName);
        userRole = 'user';
      }
      let profile = null;
      if (userRole === 'doctor') {
        const snap = await getDoc(doc(db, 'doctors', firebaseUser.uid));
        profile = snap.exists() ? { id: snap.id, ...snap.data() } : null;
      } else {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        profile = snap.exists() ? { id: snap.id, ...snap.data() } : null;
      }
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        ...profile,
      });
      setRole(userRole);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { user, role, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
