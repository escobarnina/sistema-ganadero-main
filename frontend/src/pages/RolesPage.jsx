// frontend/src/pages/RolesPage.jsx
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ROLES, GET_PERMISOS_SISTEMA, CREATE_ROL, UPDATE_ROL, DELETE_ROL } from '../graphql/roles'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const RolesPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_ROLES)
  const { data: permisosData } = useQuery(GET_PERMISOS_SISTEMA)
  const [createRol] = useMutation(CREATE_ROL)
  const [updateRol] = useMutation(UPDATE_ROL)
  const [deleteRol] = useMutation(DELETE_ROL)

  const [showForm, setShowForm] = useState(false)
  const [editingRol, setEditingRol] = useState(null)
  const [message, setMessage] = useState(null)
  const [selectedPermisos, setSelectedPermisos] = useState([])
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: []
  })

  const roles = data?.roles || []
  const permisosSistema = permisosData?.permisosSistemaDict || {}

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let result
      if (editingRol) {
        result = await updateRol({
          variables: {
            id: editingRol,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            permisos: formData.permisos,
            activo: true
          }
        })
      } else {
        result = await createRol({
          variables: {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            permisos: formData.permisos
          }
        })
      }
      
      if (result.data?.crearRol?.success || result.data?.actualizarRol?.success) {
        setMessage({ type: 'success', text: result.data?.crearRol?.message || result.data?.actualizarRol?.message })
        setShowForm(false)
        setEditingRol(null)
        setFormData({ nombre: '', descripcion: '', permisos: [] })
        setSelectedPermisos([])
        refetch()
      } else {
        setMessage({ type: 'error', text: result.data?.crearRol?.message || 'Error al guardar' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Eliminar el rol "${nombre}"?`)) {
      try {
        const result = await deleteRol({ variables: { id } })
        if (result.data?.eliminarRol?.success) {
          setMessage({ type: 'success', text: result.data.eliminarRol.message })
          refetch()
        } else {
          setMessage({ type: 'error', text: result.data?.eliminarRol?.message })
        }
      } catch (err) {
        setMessage({ type: 'error', text: err.message })
      }
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleEdit = (rol) => {
    setEditingRol(rol.id)
    setFormData({
      nombre: rol.nombre,
      descripcion: rol.descripcion || '',
      permisos: rol.permisosLista || []
    })
    setSelectedPermisos(rol.permisosLista || [])
    setShowForm(true)
  }

  const togglePermiso = (permisoKey) => {
    const nuevosPermisos = selectedPermisos.includes(permisoKey)
      ? selectedPermisos.filter(p => p !== permisoKey)
      : [...selectedPermisos, permisoKey]
    setSelectedPermisos(nuevosPermisos)
    setFormData({ ...formData, permisos: nuevosPermisos })
  }

  const toggleAllPermisos = () => {
    if (selectedPermisos.length === Object.keys(permisosSistema).length) {
      setSelectedPermisos([])
      setFormData({ ...formData, permisos: [] })
    } else {
      const todos = Object.keys(permisosSistema)
      setSelectedPermisos(todos)
      setFormData({ ...formData, permisos: todos })
    }
  }

  // Agrupar permisos por categoría
  const permisosPorCategoria = {}
  Object.keys(permisosSistema).forEach(key => {
    let categoria = key.split('_')[0]
    if (!permisosPorCategoria[categoria]) permisosPorCategoria[categoria] = []
    permisosPorCategoria[categoria].push({ key, label: permisosSistema[key] })
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🔑 Gestión de Roles</h1>
        <button
          onClick={() => {
            setEditingRol(null)
            setFormData({ nombre: '', descripcion: '', permisos: [] })
            setSelectedPermisos([])
            setShowForm(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Nuevo Rol
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permisos</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.map(rol => (
              <tr key={rol.id}>
                <td className="px-6 py-4 text-sm font-medium">{rol.nombre}</td>
                <td className="px-6 py-4 text-sm">{rol.descripcion || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {rol.permisosLista?.length || 0} permisos
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button onClick={() => handleEdit(rol)} className="text-yellow-600 hover:text-yellow-800">✏️</button>
                  <button onClick={() => handleDelete(rol.id, rol.nombre)} className="text-red-600 hover:text-red-800">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingRol ? '✏️ Editar Rol' : '+ Nuevo Rol'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows="2"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Permisos</label>
                  <button type="button" onClick={toggleAllPermisos} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {selectedPermisos.length === Object.keys(permisosSistema).length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </button>
                </div>
                <div className="border rounded-md p-3 max-h-96 overflow-y-auto">
                  {Object.keys(permisosPorCategoria).map(categoria => (
                    <div key={categoria} className="mb-3">
                      <h4 className="font-semibold text-gray-700 capitalize mb-2">{categoria}</h4>
                      <div className="grid grid-cols-2 gap-2 ml-4">
                        {permisosPorCategoria[categoria].map(permiso => (
                          <label key={permiso.key} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedPermisos.includes(permiso.key)}
                              onChange={() => togglePermiso(permiso.key)}
                              className="rounded"
                            />
                            {permiso.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                  {editingRol ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 py-2 rounded-md hover:bg-gray-400">
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

export default RolesPage