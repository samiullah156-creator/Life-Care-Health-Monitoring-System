import { useCollection } from '../../hooks/useFirestore';

export default function DietRecommendations() {
  const { data: plans, loading } = useCollection('dietPlans');

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-life-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Diet Recommendations</h1>
      <p className="text-gray-600 mb-4">View and recommend diet plans to patients.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(plans || []).map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{p.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{p.description}</p>
            {p.calories && <p className="text-xs text-life-blue mt-2">{p.calories} cal</p>}
          </div>
        ))}
      </div>
      {(!plans || plans.length === 0) && (
        <p className="text-gray-500">No diet plans in the system yet.</p>
      )}
    </div>
  );
}
