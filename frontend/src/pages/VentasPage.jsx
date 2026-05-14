import { useState } from 'react'
import { useVentas } from '../hooks/useVentas'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import VentaForm from '../components/VentaForm'

export default function VentasPage() {
  const { 
    notasVenta, 
    clientes, 
    animalesDisponibles, 
    loading, 
    error, 
    crearNotaVenta,
    crearDetalleVenta 
  } = useVentas()
  
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState(null)

  const handleCreate = async (formData, detalles) => {
    // Crear la nota de venta
    const result = await crearNotaVenta(formData)
    
    if (result.success && detalles.length > 0) {
      // Crear cada detalle
      const notaVentaId = result.id
      
      for (const detalle of detalles) {
        await crearDetalleVenta({
          notaVentaId: notaVentaId,
          animalId: detalle.animalId,
          pesoVentaKg: detalle.pesoVentaKg,
          precioKg: detalle.precioKg
        })
      }
      
      setMessage({ type: 'success', text: 'Venta registrada exitosamente' })
      setShowForm(false)
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al registrar venta' })
    }
    
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🛒 Ventas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Nueva Venta
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {notasVenta.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay ventas registradas</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            + Registrar primera venta
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notasVenta.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">{venta.cliente?.nombre || 'N/A'} {venta.cliente?.apellidos || ''}</td>
                  <td className="px-6 py-4 text-sm">{venta.observaciones || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <VentaForm
          clientes={clientes}
          animales={animalesDisponibles}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}