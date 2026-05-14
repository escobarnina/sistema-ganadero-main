import { useState } from 'react'
import { useMuertesBajas } from '../hooks/useMuertesBajas'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import MuerteBajaForm from '../components/MuerteBajaForm'

const TIPO_ESTILOS = {
  MUERTE:   'bg-red-100 text-red-700',
  ROBO:     'bg-orange-100 text-orange-700',
  PERDIDA:  'bg-yellow-100 text-yellow-700',
  DESCARTE: 'bg-gray-100 text-gray-600',
  OTRO:     'bg-blue-100 text-blue-700',
}

const TIPO_LABELS = {
  MUERTE:   '💀 Muerte',
  ROBO:     '🚨 Robo',
  PERDIDA:  '🔍 Pérdida',
  DESCARTE: '📋 Descarte',
  OTRO:     '❓ Otro',
}

export default function MuerteBajaPage() {
  const {
    muertesBajas,
    animalesDisponibles,
    loading,
    error,
    crearMuerteBaja,
    actualizarMuerteBaja,
    eliminarMuerteBaja,
  } = useMuertesBajas()

  const [showForm, setShowForm]   = useState(false)
  const [editando, setEditando]   = useState(null)  // ← registro que se está editando
  const [message, setMessage]     = useState(null)

  const handleCreate = async (formData) => {
    const result = await crearMuerteBaja(formData)
    if (result.success) {
      setMessage({ type: 'success', text: 'Baja registrada exitosamente' })
      setShowForm(false)
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al registrar baja' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleUpdate = async (formData) => {
    const result = await actualizarMuerteBaja(editando.id, formData)
    if (result.success) {
      setMessage({ type: 'success', text: 'Baja actualizada exitosamente' })
      setEditando(null)
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al actualizar' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return
    const result = await eliminarMuerteBaja(id)
    if (result.success) {
      setMessage({ type: 'success', text: 'Registro eliminado correctamente' })
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al eliminar' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">💀 Muertes y Bajas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          + Registrar Baja
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {muertesBajas.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay registros de bajas</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-red-600 hover:text-red-700"
          >
            + Registrar primera baja
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Animal</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Arete</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Raza</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Causa</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Peso Est.</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {muertesBajas.map((baja) => (
                <tr key={baja.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {baja.animal?.nombre || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    #{baja.animal?.nroArete || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {baja.animal?.raza?.nombre || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${TIPO_ESTILOS[baja.tipo]}`}>
                      {TIPO_LABELS[baja.tipo] || baja.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{baja.causa}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(baja.fechaBaja).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {baja.pesoEstimadoKg ? `${baja.pesoEstimadoKg} Kg` : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {baja.descripcion || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditando(baja)}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(baja.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear */}
      {showForm && (
        <MuerteBajaForm
          animales={animalesDisponibles}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Modal editar */}
      {editando && (
        <MuerteBajaForm
          animales={animalesDisponibles}
          initialData={editando}
          onSubmit={handleUpdate}
          onCancel={() => setEditando(null)}
          isEditing
        />
      )}
    </div>
  )
}