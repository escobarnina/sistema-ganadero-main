import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_REPRODUCTORES, CREATE_REPRODUCTOR, UPDATE_REPRODUCTOR, DELETE_REPRODUCTOR, GET_RAZAS } from '../../graphql/catalogos'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

export default function ReproductoresNuevo() {
  const { data, loading, error, refetch } = useQuery(GET_REPRODUCTORES)
  const { data: razasData, loading: loadingRazas } = useQuery(GET_RAZAS)
  const [create] = useMutation(CREATE_REPRODUCTOR)
  const [update] = useMutation(UPDATE_REPRODUCTOR)
  const [remove] = useMutation(DELETE_REPRODUCTOR)
  
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState({ 
    codigo: '', 
    nombre: '', 
    razaId: '', 
    tipoOrigen: 'INTERNO', 
    codigoPajuela: '', 
    laboratorio: '',
    observaciones: '',
    activo: true
  })

  const items = data?.reproductores || []
  const razas = razasData?.razas || []

  const handleChange = (e) => {
    const value = e.target.name === 'activo' ? e.target.value === 'true' : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const resetForm = () => {
    setForm({ 
      codigo: '', 
      nombre: '', 
      razaId: '', 
      tipoOrigen: 'INTERNO', 
      codigoPajuela: '', 
      laboratorio: '',
      observaciones: '',
      activo: true
    })
    setEditando(null)
    setShowForm(false)
  }

  const handleEditar = (item) => {
    setEditando(item.id)
    setForm({
      codigo: item.codigo,
      nombre: item.nombre || '',
      razaId: item.raza?.id || '',
      tipoOrigen: item.tipoOrigen,
      codigoPajuela: item.codigoPajuela || '',
      laboratorio: item.laboratorio || '',
      observaciones: item.observaciones || '',
      activo: item.activo
    })
    setShowForm(true)
  }

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Eliminar reproductor "${nombre || id}"?`)) {
      try {
        const res = await remove({ variables: { id } })
        if (res.data?.eliminarReproductor?.success) {
          setMsg({ type: 'success', text: res.data.eliminarReproductor.message })
          refetch()
        } else {
          setMsg({ type: 'error', text: res.data?.eliminarReproductor?.message || 'Error al eliminar' })
        }
      } catch (err) {
        setMsg({ type: 'error', text: err.message })
      }
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const fincaId = localStorage.getItem('fincaId') || '1'
      
      if (editando) {
        // Actualizar
        const res = await update({ 
          variables: { 
            id: editando,
            nombre: form.nombre,
            razaId: form.razaId || null,
            tipoOrigen: form.tipoOrigen,
            codigoPajuela: form.codigoPajuela,
            laboratorio: form.laboratorio,
            observaciones: form.observaciones,
            activo: form.activo
          } 
        })
        if (res.data?.actualizarReproductor?.success) {
          setMsg({ type: 'success', text: res.data.actualizarReproductor.message })
          refetch()
          resetForm()
        } else {
          setMsg({ type: 'error', text: res.data?.actualizarReproductor?.message || 'Error al actualizar' })
        }
      } else {
        // Crear nuevo
        const res = await create({ variables: { fincaId, ...form } })
        if (res.data?.crearReproductor?.success) {
          setMsg({ type: 'success', text: res.data.crearReproductor.message })
          refetch()
          resetForm()
        } else {
          setMsg({ type: 'error', text: res.data?.crearReproductor?.message || 'Error al crear' })
        }
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    }
    setTimeout(() => setMsg(null), 3000)
  }

  if (loading || loadingRazas) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          + Nuevo Reproductor
        </button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-md ${msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {msg.text}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay reproductores registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold">Código</th>
                <th className="px-6 py-3 text-left text-xs font-bold">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-bold">Raza</th>
                <th className="px-6 py-3 text-left text-xs font-bold">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-bold">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">{item.codigo}</td>
                  <td className="px-6 py-4 text-sm">{item.nombre || '-'}</td>
                  <td className="px-6 py-4 text-sm">{item.raza?.nombre || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.tipoOrigen === 'INTERNO' ? 'bg-blue-100 text-blue-800' :
                      item.tipoOrigen === 'EXTERNO' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.tipoOrigen === 'INTERNO' ? '🐂 Interno' :
                       item.tipoOrigen === 'EXTERNO' ? '✈️ Externo' :
                       '💉 Semen'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.activo ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEditar(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-xs"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(item.id, item.nombre || item.codigo)}
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

      {/* Modal de formulario (Crear/Editar) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editando ? '✏️ Editar Reproductor' : '+ Nuevo Reproductor'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Código *</label>
                <input 
                  name="codigo" 
                  value={form.codigo} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" 
                  required 
                  disabled={editando} // No permitir editar código si ya existe
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Nombre</label>
                <input 
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md" 
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Raza</label>
                <select 
                  name="razaId" 
                  value={form.razaId} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccionar raza</option>
                  {razas.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Tipo Origen *</label>
                <select 
                  name="tipoOrigen" 
                  value={form.tipoOrigen} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md" 
                  required
                >
                  <option value="INTERNO">🐂 Interno (toro propio)</option>
                  <option value="EXTERNO">✈️ Externo (toro de otra finca)</option>
                  <option value="SEMEN">💉 Semen (pajuela)</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Código Pajuela</label>
                <input 
                  name="codigoPajuela" 
                  value={form.codigoPajuela} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md" 
                  placeholder="Ej: AX-12345"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Laboratorio</label>
                <input 
                  name="laboratorio" 
                  value={form.laboratorio} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md" 
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Observaciones</label>
                <textarea 
                  name="observaciones" 
                  value={form.observaciones} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-md" 
                  rows="2"
                />
              </div>
              
              {editando && (
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">Estado</label>
                  <select 
                    name="activo" 
                    value={form.activo} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="true">✅ Activo</option>
                    <option value="false">❌ Inactivo</option>
                  </select>
                </div>
              )}
              
              <div className="flex gap-3 mt-5">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                  {editando ? 'Actualizar' : 'Crear'}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
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