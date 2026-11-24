import { useCollection } from '../hooks/useFirestore';
import PlanCard from '../components/Cards/PlanCard';

export default function Exercises() {
  const { data: plans, loading } = useCollection('exercisePlans');

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-life-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Exercise Plans</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(plans || []).map((p) => (
          <PlanCard
            key={p.id}
            title={p.title}
            description={p.description}
            meta={p.difficulty}
          />
        ))}
      </div>
      {(!plans || plans.length === 0) && (
        <p className="text-gray-500">No exercise plans yet.</p>
      )}
    </div>
  );
}
