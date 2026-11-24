import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';

export function useCollection(collectionName, constraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = collection(db, collectionName);
    if (constraints.length) {
      q = query(q, ...constraints);
    }
    getDocs(q)
      .then((snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

export function useDocument(collectionName, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }
    getDoc(doc(db, collectionName, id))
      .then((snap) => {
        setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [collectionName, id]);

  return { data, loading, error };
}

export {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  db,
};
