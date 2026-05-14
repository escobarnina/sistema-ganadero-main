// frontend/src/pages/VacunacionesPage.jsx
import React, { useState } from 'react'
import { useVacunaciones } from '../hooks/useVacunaciones'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const VacunacionesPage = () => {
  const { 
    vacunaciones, 
    vacunasProximas, 
    animalesActivos, 
    vacunas, 
    loading, 
    error, 
    crearVacunacion,
    actualizarVacunacion,
    eliminarVacunacion 
  } = useVacunaciones()

  const [showForm, setShowForm] = useState(false)
  const [editingVacunacion, setEditingVacunacion] = useState(null)
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    animalId: '',
    vacunaId: '',
    fechaAplicacion: new Date().toISOString().split('T')[0],
    campana: '',
    lote: '',
    dosisAplicada: '',
    viaAplicacion: '',
    observaciones: '',
    fechaProxima: ''
  })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const resetForm = () => {
    setFormData({
      animalId: '',
      vacunaId: '',
      fechaAplicacion: new Date().toISOString().split('T')[0],
      campana: '',
      lote: '',
      dosisAplicada: '',
      viaAplicacion: '',
      observaciones: '',
      fechaProxima: ''
    })
    setEditingVacunacion(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (vacunacion) => {
    setEditingVacunacion(vacunacion)
    setFormData({
      animalId: vacunacion.animal.id,
      vacunaId: vacunacion.vacuna.id,
      fechaAplicacion: vacunacion.fechaAplicacion,
      campana: vacunacion.campana || '',
      lote: vacunacion.lote || '',
      dosisAplicada: vacunacion.dosisAplicada || '',
      viaAplicacion: vacunacion.viaAplicacion || '',
      observaciones: vacunacion.observaciones || '',
      fechaProxima: vacunacion.fechaProxima || ''
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let result
    if (editingVacunacion) {
      result = await actualizarVacunacion(editingVacunacion.id, {
        fechaAplicacion: formData.fechaAplicacion,
        campana: formData.campana,
        lote: formData.lote,
        dosisAplicada: formData.dosisAplicada,
        viaAplicacion: formData.viaAplicacion,
        observaciones: formData.observaciones,
        fechaProxima: formData.fechaProxima
      })
    } else {
      result = await crearVacunacion({
        animalId: formData.animalId,
        vacunaId: formData.vacunaId,
        fechaAplicacion: formData.fechaAplicacion,
        campana: formData.campana,
        lote: formData.lote,
        dosisAplicada: formData.dosisAplicada,
        viaAplicacion: formData.viaAplicacion,
        observaciones: formData.observaciones,
        fechaProxima: formData.fechaProxima
      })
    }
    
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      closeForm()
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id, animalName) => {
    if (window.confirm(`¿Eliminar vacunación de "${animalName}"?`)) {
      const result = await eliminarVacunacion(id)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">💉 Vacunaciones</h1>
        <button
          onClick={openCreateForm}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Registrar Vacunación
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Vacunas Próximas */}
      {vacunasProximas.length > 0 && (
        <div className="mb-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h2 className="text-lg font-bold text-yellow-800 mb-3">⚠️ Vacunas Próximas (30 días)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vacunasProximas.map(vp => (
              <div key={vp.id} className="bg-white rounded p-3 shadow-sm">
                <p className="font-medium">{vp.vacuna?.nombre}</p>
                <p className="text-sm text-gray-600">Animal: {vp.animal?.nroArete}</p>
                <p className="text-sm text-gray-600">Fecha próxima: {new Date(vp.fechaProxima).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de Vacunaciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vacuna</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campana/Lote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vacunaciones.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No hay vacunaciones registradas
                </td>
              </tr>
            ) : (
              vacunaciones.map((vac) => (
                <tr key={vac.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{new Date(vac.fechaAplicacion).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    {vac.animal?.nroArete} - {vac.animal?.nombre || ''}
                  </td>
                  <td className="px-6 py-4 text-sm">{vac.vacuna?.nombre}</td>
                  <td className="px-6 py-4 text-sm">
                    <div>{vac.campana || '-'}</div>
                    <div className="text-xs text-gray-500">Lote: {vac.lote || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {vac.fechaProxima ? new Date(vac.fechaProxima).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => openEditForm(vac)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(vac.id, vac.animal?.nroArete)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              {editingVacunacion ? '✏️ Editar Vacunación' : '💉 Nueva Vacunación'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Animal *</label>
                <select
                  name="animalId"
                  required
                  value={formData.animalId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!!editingVacunacion}
                >
                  <option value="">Seleccionar animal</option>
                  {animalesActivos.map(a => (
                    <option key={a.id} value={a.id}>{a.nroArete} - {a.nombre || 'Sin nombre'}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vacuna *</label>
                <select
                  name="vacunaId"
                  required
                  value={formData.vacunaId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Seleccionar vacuna</option>
                  {vacunas.map(v => (
                    <option key={v.id} value={v.id}>{v.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Aplicación *</label>
                  <input
                    type="date"
                    name="fechaAplicacion"
                    required
                    value={formData.fechaAplicacion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Dosis</label>
                  <input
                    type="date"
                    name="fechaProxima"
                    value={formData.fechaProxima}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaña</label>
                  <input
                    type="text"
                    name="campana"
                    value={formData.campana}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Ej: Aftosa 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                  <input
                    type="text"
                    name="lote"
                    value={formData.lote}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="N° de lote"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosis Aplicada</label>
                  <input
                    type="text"
                    name="dosisAplicada"
                    value={formData.dosisAplicada}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Ej: 2 ml"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vía Aplicación</label>
                  <select
                    name="viaAplicacion"
                    value={formData.viaAplicacion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Seleccionar</option>
                    <option value="INTRAMUSCULAR">Intramuscular</option>
                    <option value="SUBCUTANEA">Subcutánea</option>
                    <option value="INTRADERMICA">Intradérmica</option>
                    <option value="ORAL">Oral</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                  {editingVacunacion ? 'Actualizar' : 'Registrar'}
                </button>
                <button type="button" onClick={closeForm} className="flex-1 bg-gray-300 py-2 rounded-md hover:bg-gray-400">
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

export default VacunacionesPage