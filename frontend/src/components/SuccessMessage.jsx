export default function SuccessMessage({ message, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
      <span>✅</span>
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">✕</button>
    </div>
  )
}