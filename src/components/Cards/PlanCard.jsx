import { Link } from 'react-router-dom';

export default function PlanCard({ title, description, to, meta }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="p-5">
        {meta && (
          <span className="text-xs font-medium text-life-blue bg-blue-50 px-2 py-0.5 rounded">
            {meta}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        {to && (
          <Link
            to={to}
            className="mt-3 inline-block text-life-blue font-medium text-sm hover:underline"
          >
            View details →
          </Link>
        )}
      </div>
    </div>
  );
}
