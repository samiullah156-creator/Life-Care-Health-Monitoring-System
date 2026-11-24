export default function Logo({ className = 'h-8 w-8', showText = true, light = false }) {
  const textClass = light ? 'text-white' : 'text-gray-900';
  return (
    <div className="flex items-center gap-2">
      <svg
        className={className}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M4 16h4l2-6 4 12 4-8 4 2 4-4"
          stroke={light ? 'white' : '#3B82F6'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className={`font-semibold text-lg ${textClass}`}>Life Care</span>
      )}
    </div>
  );
}
