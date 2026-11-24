import { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { user: authUser, role } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!authUser?.uid) {
      setProfile(null);
      return;
    }
    const collectionName = role === 'doctor' ? 'doctors' : 'users';
    const unsub = onSnapshot(doc(db, collectionName, authUser.uid), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    return () => unsub();
  }, [authUser?.uid, role]);

  const value = { profile, role };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
