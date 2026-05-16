import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-6">
      <div className="text-8xl font-black text-gray-200 select-none leading-none">404</div>
      <div>
        <p className="text-xl font-semibold text-gray-800 mb-2">Página no encontrada</p>
        <p className="text-sm text-gray-500 max-w-xs">
          La ruta que buscas no existe o fue movida. Verifica la URL e intenta de nuevo.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
      >
        Ir al Dashboard
      </button>
    </div>
  )
}
