import { useState } from 'react'
import { useCompras } from '../hooks/useCompras'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import CompraForm from '../components/CompraForm'

export default function ComprasPage() {
  const { 
    notasCompra, 
    proveedores, 
    medicamentos, 
    alimentos, 
    loading, 
    error, 
    crearNotaCompra,
    crearDetalleCompra,
    crearDetalleCompraAlimento,
    eliminarNotaCompra 
  } = useCompras()
  
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)

  const handleCreate = async (formData, detalles) => {
    // Crear la nota de compra
    const result = await crearNotaCompra(formData)
    
    if (result.success && detalles.length > 0) {
      // Crear cada detalle
      const notaCompraId = result.id
      
      for (const detalle of detalles) {
        if (formData.tipoCompra === 'MEDICAMENTO') {
          await crearDetalleCompra({
            notaCompraId,
            medicamentoId: detalle.productoId,
            precioUnitario: detalle.precioUnitario,
            cantidad: detalle.cantidad
          })
        } else {
          await crearDetalleCompraAlimento({
            notaCompraId,
            alimentoId: detalle.productoId,
            precioUnitario: detalle.precioUnitario,
            cantidad: detalle.cantidad
          })
        }
      }
      
      setMessage({ type: 'success', text: 'Compra registrada exitosamente' })
      setShowForm(false)
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al registrar compra' })
    }
    
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id) => {
    const result = await eliminarNotaCompra(id)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    setShowConfirm(null)
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🛒 Compras de Insumos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Nueva Compra
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {notasCompra.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay compras registradas</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            + Registrar primera compra
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Observaciones</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notasCompra.map((compra) => (
                <tr key={compra.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{new Date(compra.fechaCompra).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">{compra.proveedor?.nombre || 'N/A'} {compra.proveedor?.apellidos || ''}</td>
                  <td className="px-6 py-4 text-sm">
                    {compra.tipoCompra === 'MEDICAMENTO' ? '💊 Medicamentos' : '🌾 Alimentos'}
                  </td>
                  <td className="px-6 py-4 text-sm">{compra.observaciones || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setShowConfirm(compra.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CompraForm
          proveedores={proveedores}
          medicamentos={medicamentos}
          alimentos={alimentos}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">¿Eliminar compra?</h3>
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