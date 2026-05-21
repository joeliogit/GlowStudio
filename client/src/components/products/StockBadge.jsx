export default function StockBadge({ stock, threshold = 5 }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
        Agotado
      </span>
    );
  }
  if (stock <= threshold) {
    return (
      <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
        Poco stock ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
      En existencia
    </span>
  );
}
