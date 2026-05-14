import { useState } from 'react'
import { useProveedores } from '../hooks/useProveedores'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ProveedorForm from '../components/ProveedorForm'

export default function ProveedoresPage() {
  const { proveedores, loading, error, crearProveedor, actualizarProveedor, eliminarProveedor } = useProveedores()
  const [showForm, setShowForm] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState(null)
  const [message, setMessage] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)

  const handleCreate = async (data) => {
    const result = await crearProveedor(data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) setShowForm(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor)
    setShowForm(true)
  }

  const handleUpdate = async (data) => {
    const result = await actualizarProveedor(editingProveedor.id, data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowForm(false)
      setEditingProveedor(null)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id) => {
    const result = await eliminarProveedor(id)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    setShowConfirm(null)
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🏢 Proveedores</h1>
        <button
          onClick={() => {
            setEditingProveedor(null)
            setShowForm(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Nuevo Proveedor
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {proveedores.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay proveedores registrados</p>
          <button
            onClick={() => {
              setEditingProveedor(null)
              setShowForm(true)
            }}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            + Crear el primer proveedor
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Apellidos</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">NIT/CI</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{proveedor.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{proveedor.apellidos || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{proveedor.telefono || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{proveedor.direccion || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{proveedor.nit || proveedor.ci || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(proveedor)}
                        className="text-yellow-600 hover:text-yellow-800 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowConfirm(proveedor.id)}
                        className="text-red-600 hover:text-red-800 transition"
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

      {showForm && (
        <ProveedorForm
          proveedor={editingProveedor}
          onSubmit={editingProveedor ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setEditingProveedor(null)
          }}
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">¿Eliminar proveedor?</h3>
            <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showConfirm)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}