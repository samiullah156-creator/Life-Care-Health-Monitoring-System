import { useState, useMemo } from 'react';
import { useCollection } from '../hooks/useFirestore';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'halal', label: 'Halal food' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'general', label: 'General' },
];

export default function Recipes() {
  const { data: recipes, loading } = useCollection('recipes');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const list = recipes || [];
    if (filter === 'all') return list;
    return list.filter((r) => (r.category || 'general') === filter);
  }, [recipes, filter]);

  const halal = useMemo(() => (recipes || []).filter((r) => (r.category || '') === 'halal'), [recipes]);
  const healthy = useMemo(() => (recipes || []).filter((r) => (r.category || '') === 'healthy'), [recipes]);
  const general = useMemo(() => (recipes || []).filter((r) => !r.category || r.category === 'general'), [recipes]);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-life-blue border-t-transparent" />
      </div>
    );
  }

  const RecipeCard = ({ r }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {r.videoUrl && (
        <div className="aspect-video bg-gray-100">
          <iframe
            title={r.title}
            src={r.videoUrl}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-life-blue/10 text-life-blue capitalize">
            {r.category || 'general'}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mt-1">{r.title}</h3>
        {r.ingredients && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {Array.isArray(r.ingredients) ? r.ingredients.join(', ') : r.ingredients}
          </p>
        )}
        {r.instructions && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.instructions}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Recipes & Food</h1>
      <p className="text-gray-600 mb-6">Halal and healthy recipes for every user. Follow these for a balanced diet.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === c.id ? 'bg-life-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filter !== 'all' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} r={r} />
          ))}
        </div>
      )}

      {filter === 'all' && (
        <>
          {halal.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Halal food</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {halal.map((r) => (
                  <RecipeCard key={r.id} r={r} />
                ))}
              </div>
            </section>
          )}
          {healthy.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Healthy recipes</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthy.map((r) => (
                  <RecipeCard key={r.id} r={r} />
                ))}
              </div>
            </section>
          )}
          {general.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">General</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {general.map((r) => (
                  <RecipeCard key={r.id} r={r} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {filter !== 'all' && filtered.length === 0 && (
        <p className="text-gray-500">No recipes in this category yet.</p>
      )}
      {filter === 'all' && !halal.length && !healthy.length && !general.length && (
        <p className="text-gray-500">No recipes added yet.</p>
      )}
    </div>
  );
}
