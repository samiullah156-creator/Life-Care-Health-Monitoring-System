export default function DocumentViewer({ label, url }) {
  if (!url) return null;
  const isPdf = url.toLowerCase().includes('.pdf') || url.includes('content-type') || url.includes('firebasestorage') || url.startsWith('data:application/pdf');
  const isImageUrl = url.match(/\.(jpg|jpeg|png|gif|webp)/i) || url.startsWith('data:image/');
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-life-blue text-sm hover:underline block"
      >
        View document (opens in new tab)
      </a>
      {isImageUrl && (
        <img src={url} alt={label} className="mt-2 max-w-full rounded-lg border border-gray-200 max-h-64 object-contain" />
      )}
    </div>
  );
}
