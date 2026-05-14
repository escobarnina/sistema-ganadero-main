// frontend/src/pages/AlertasPage.jsx
import React, { useState } from 'react'
import { useAlertas } from '../hooks/useAlertas'
import AlertaCard from '../components/AlertaCard'
import GastoForm from '../components/GastoForm'
import AlertasList from '../components/AlertasList'

const AlertasPage = () => {
  const { 
    alertas, 
    alertasPendientes, 
    gastos, 
    totalGastos,
    marcarAlertaLeida, 
    eliminarAlerta,
    actualizarGasto,
    eliminarGasto,
    loading 
  } = useAlertas()

  const [activeTab, setActiveTab] = useState('alertas')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    id: '',
    fecha: '',
    tipoGasto: '',
    descripcion: '',
    cantidad: 1,
    precioUnitario: '',
    animalId: ''
  })

  const tiposGasto = [
    { value: 'SANIDAD', label: '🩺 Sanidad' },
    { value: 'REPRODUCCION', label: '🐄 Reproducción' },
    { value: 'ALIMENTO', label: '🍖 Alimento' },
    { value: 'MANO_DE_OBRA', label: '👨‍🌾 Mano de obra' },
    { value: 'TRANSPORTE', label: '🚚 Transporte' },
    { value: 'MANTENIMIENTO', label: '🔧 Mantenimiento' },
    { value: 'COMBUSTIBLE', label: '⛽ Combustible' },
    { value: 'OTRO', label: '📋 Otro' },
  ]

  const handleMarcarLeida = async (id) => {
    const result = await marcarAlertaLeida(id)
    if (result.success) {
      alert('✅ Alerta marcada como leída')
    } else {
      alert(`❌ Error: ${result.error}`)
    }
  }

  const handleEliminarAlerta = async (id) => {
    if (window.confirm('¿Eliminar esta alerta?')) {
      const result = await eliminarAlerta(id)
      if (result.success) {
        alert('✅ Alerta eliminada')
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    }
  }

  const handleEliminarGasto = async (id) => {
    if (window.confirm('¿Eliminar este gasto?')) {
      const result = await eliminarGasto(id)
      if (result.success) {
        alert('✅ Gasto eliminado')
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    }
  }

  const handleEditarGasto = (gasto) => {
    setEditForm({
      id: gasto.id,
      fecha: gasto.fecha,
      tipoGasto: gasto.tipoGasto,
      descripcion: gasto.descripcion,
      cantidad: gasto.cantidad,
      precioUnitario: gasto.precioUnitario,
      animalId: gasto.animal?.id || ''
    })
    setShowEditModal(true)
  }

  const handleActualizarGasto = async (e) => {
    e.preventDefault()
    const result = await actualizarGasto(editForm.id, {
      fecha: editForm.fecha,
      tipoGasto: editForm.tipoGasto,
      descripcion: editForm.descripcion,
      cantidad: parseFloat(editForm.cantidad),
      precioUnitario: parseFloat(editForm.precioUnitario),
      animalId: editForm.animalId || null
    })
    if (result.success) {
      alert('✅ Gasto actualizado exitosamente')
      setShowEditModal(false)
    } else {
      alert(`❌ Error: ${result.error}`)
    }
  }

  const tabs = [
    { id: 'alertas', label: '🔔 Alertas', count: alertasPendientes.length },
    { id: 'todos', label: '📋 Todas las Alertas', count: alertas.length },
    { id: 'gastos', label: '💰 Gastos', count: gastos.length },
    { id: 'nuevo_gasto', label: '+ Nuevo Gasto' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-red-800">🔔 Módulo de Alertas y Gastos</h1>
        <p className="text-gray-600">Gestión de notificaciones y registro de gastos</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Alertas Pendientes</div>
          <div className="text-2xl font-bold text-yellow-700">{alertasPendientes.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Alertas</div>
          <div className="text-2xl font-bold text-blue-700">{alertas.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Total Gastos</div>
          <div className="text-2xl font-bold text-green-700">Gs. {totalGastos.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Registros de Gastos</div>
          <div className="text-2xl font-bold text-purple-700">{gastos.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'alertas' && (
          <AlertasList
            alertas={alertasPendientes}
            onMarcarLeida={handleMarcarLeida}
            onEliminar={handleEliminarAlerta}
            titulo="🔔 Alertas Pendientes"
          />
        )}

        {activeTab === 'todos' && (
          <AlertasList
            alertas={alertas}
            onMarcarLeida={handleMarcarLeida}
            onEliminar={handleEliminarAlerta}
            titulo="📋 Historial de Alertas"
          />
        )}

        {activeTab === 'gastos' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gastos.map(g => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{new Date(g.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                        {g.tipoGasto}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{g.descripcion?.substring(0, 50)}</td>
                    <td className="px-6 py-4 text-sm">{g.cantidad}</td>
                    <td className="px-6 py-4 text-sm">Gs. {parseFloat(g.precioUnitario).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold">Gs. {parseFloat(g.total).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{g.animal?.nroArete || '-'}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEditarGasto(g)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-xs"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleEliminarGasto(g.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'nuevo_gasto' && (
          <GastoForm onSuccess={() => setActiveTab('gastos')} />
        )}
      </div>

      {/* Modal de Edición de Gasto */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">✏️ Editar Gasto</h2>
            <form onSubmit={handleActualizarGasto}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={editForm.fecha}
                  onChange={(e) => setEditForm({ ...editForm, fecha: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Tipo de Gasto</label>
                <select
                  value={editForm.tipoGasto}
                  onChange={(e) => setEditForm({ ...editForm, tipoGasto: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  {tiposGasto.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input
                    type="number"
                    step="1"
                    value={editForm.cantidad}
                    onChange={(e) => setEditForm({ ...editForm, cantidad: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.precioUnitario}
                    onChange={(e) => setEditForm({ ...editForm, precioUnitario: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Animal (opcional)</label>
                <input
                  type="text"
                  value={editForm.animalId}
                  onChange={(e) => setEditForm({ ...editForm, animalId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="ID del animal"
                />
              </div>

              <div className="flex gap-3 mt-5">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                  💾 Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertasPage