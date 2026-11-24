import { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Availability() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'doctors', user?.uid)).then((snap) => {
      if (snap.exists() && snap.data().availability) {
        setAvailability(snap.data().availability);
      }
      setLoaded(true);
    });
  }, [user?.uid]);

  const setSlot = (day, key, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...(prev[day] || {}), [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'doctors', user.uid), { availability });
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return null;

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Availability</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        {DAYS.map((day) => (
          <div key={day} className="flex flex-wrap items-center gap-4 py-2 border-b border-gray-100 last:border-0">
            <span className="w-28 font-medium text-gray-700">{day}</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!availability[day]?.enabled}
                onChange={(e) => setSlot(day, 'enabled', e.target.checked)}
                className="rounded border-gray-300 text-life-blue"
              />
              Available
            </label>
            {availability[day]?.enabled && (
              <span className="flex gap-2 text-sm">
                <input
                  type="time"
                  value={availability[day]?.start || ''}
                  onChange={(e) => setSlot(day, 'start', e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1"
                />
                to
                <input
                  type="time"
                  value={availability[day]?.end || ''}
                  onChange={(e) => setSlot(day, 'end', e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1"
                />
              </span>
            )}
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 px-4 py-2 rounded-lg bg-life-blue text-white font-medium hover:bg-life-blue-dark disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </div>
  );
}
