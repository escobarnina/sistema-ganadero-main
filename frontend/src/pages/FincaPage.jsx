// frontend/src/pages/FincaPage.jsx
import React, { useState } from 'react'
import { useFincas } from '../hooks/useFincas'
import FincaForm from '../components/FincaForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const FincaPage = () => {
  const { fincas, fincaActual, loading, error, crearFinca, actualizarFinca, eliminarFinca } = useFincas()
  const [showForm, setShowForm] = useState(false)
  const [editingFinca, setEditingFinca] = useState(null)
  const [message, setMessage] = useState(null)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const handleCreate = async (data) => {
    const result = await crearFinca(data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowForm(false)
    }
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const handleUpdate = async (data) => {
    const result = await actualizarFinca(editingFinca.id, data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowForm(false)
      setEditingFinca(null)
    }
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Eliminar la finca "${nombre}"?`)) {
      const result = await eliminarFinca(id)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const openCreateForm = () => {
    setEditingFinca(null)
    setShowForm(true)
  }

  const openEditForm = (finca) => {
    setEditingFinca(finca)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingFinca(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📍 Gestión de Fincas</h1>
        <button
          onClick={openCreateForm}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Nueva Finca
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Finca Actual */}
      {fincaActual && (
        <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-blue-800">🏠 Finca Actual</h2>
              <p className="text-blue-600 font-medium">{fincaActual.nombre}</p>
              {fincaActual.propietario && (
                <p className="text-sm text-blue-500">Propietario: {fincaActual.propietario}</p>
              )}
            </div>
            <button
              onClick={() => openEditForm(fincaActual)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              ✏️ Editar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Fincas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propietario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fincas.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No hay fincas registradas
                </td>
              </tr>
            ) : (
              fincas.map((finca) => (
                <tr key={finca.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{finca.nombre}</td>
                  <td className="px-6 py-4 text-sm">{finca.propietario || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    {finca.municipio ? `${finca.municipio}${finca.departamento ? `, ${finca.departamento}` : ''}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">{finca.telefono || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${finca.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {finca.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => openEditForm(finca)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(finca.id, finca.nombre)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <FincaForm
              fincaParaEditar={editingFinca}
              onSubmit={editingFinca ? handleUpdate : handleCreate}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FincaPage