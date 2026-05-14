// frontend/src/pages/UnauthorizedPage.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos suficientes para acceder a esta página.
        </p>
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage