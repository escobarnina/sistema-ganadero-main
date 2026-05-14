import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { 
  GET_VETERINARIOS, 
  CREATE_VETERINARIO, 
  UPDATE_VETERINARIO, 
  DELETE_VETERINARIO 
} from '../../graphql/catalogos'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

export default function VeterinariosList() {
  const { data, loading, error, refetch } = useQuery(GET_VETERINARIOS)
  const [createVeterinario] = useMutation(CREATE_VETERINARIO)
  const [updateVeterinario] = useMutation(UPDATE_VETERINARIO)
  const [deleteVeterinario] = useMutation(DELETE_VETERINARIO)
  
  const [showForm, setShowForm] = useState(false)
  const [editingVeterinario, setEditingVeterinario] = useState(null)
  const [message, setMessage] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)

  const veterinarios = data?.veterinarios || []

  const handleCreate = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const variables = {
      fincaId: '1',
      nombre: formData.get('nombre'),
      apellidos: formData.get('apellidos'),
      ci: formData.get('ci'),
      especialidad: formData.get('especialidad'),
      telefono: formData.get('telefono'),
      email: formData.get('email'),
    }

    try {
      const result = await createVeterinario({ variables })
      if (result.data?.crearVeterinario?.success) {
        setMessage({ type: 'success', text: result.data.crearVeterinario.message })
        refetch()
        setShowForm(false)
      } else {
        setMessage({ type: 'error', text: result.data?.crearVeterinario?.message || 'Error al crear' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEdit = (veterinario) => {
    setEditingVeterinario(veterinario)
    setShowForm(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const variables = {
      id: editingVeterinario.id,
      nombre: formData.get('nombre'),
      apellidos: formData.get('apellidos'),
      telefono: formData.get('telefono'),
      especialidad: formData.get('especialidad'),
      activo: formData.get('activo') === 'true',
    }

    try {
      const result = await updateVeterinario({ variables })
      if (result.data?.actualizarVeterinario?.success) {
        setMessage({ type: 'success', text: result.data.actualizarVeterinario.message })
        refetch()
        setShowForm(false)
        setEditingVeterinario(null)
      } else {
        setMessage({ type: 'error', text: result.data?.actualizarVeterinario?.message || 'Error al actualizar' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id) => {
    try {
      const result = await deleteVeterinario({ variables: { id } })
      if (result.data?.eliminarVeterinario?.success) {
        setMessage({ type: 'success', text: result.data.eliminarVeterinario.message })
        refetch()
      } else {
        setMessage({ type: 'error', text: result.data?.eliminarVeterinario?.message || 'Error al eliminar' })
      }
      setShowConfirm(null)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditingVeterinario(null)
            setShowForm(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Nuevo Veterinario
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {veterinarios.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay veterinarios registrados</p>
          <button
            onClick={() => {
              setEditingVeterinario(null)
              setShowForm(true)
            }}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            + Crear el primer veterinario
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Apellidos</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Especialidad</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {veterinarios.map((vet) => (
                <tr key={vet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{vet.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vet.apellidos || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vet.especialidad || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vet.telefono || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${vet.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vet.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(vet)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowConfirm(vet.id)}
                        className="text-red-600 hover:text-red-800"
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

      {/* Modal de Creación/Edición */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingVeterinario ? '✏️ Editar Veterinario' : '👨‍⚕️ Nuevo Veterinario'}
              </h2>
              <form onSubmit={editingVeterinario ? handleUpdate : handleCreate}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingVeterinario?.nombre || ''}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      defaultValue={editingVeterinario?.apellidos || ''}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">CI</label>
                  <input
                    type="text"
                    name="ci"
                    defaultValue={editingVeterinario?.ci || ''}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Especialidad</label>
                  <input
                    type="text"
                    name="especialidad"
                    defaultValue={editingVeterinario?.especialidad || ''}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    defaultValue={editingVeterinario?.telefono || ''}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingVeterinario?.email || ''}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                {editingVeterinario && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      name="activo"
                      defaultValue={editingVeterinario.activo ? 'true' : 'false'}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                    {editingVeterinario ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingVeterinario(null)
                    }}
                    className="flex-1 bg-gray-300 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">¿Eliminar veterinario?</h3>
            <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(showConfirm)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">
                Sí, eliminar
              </button>
              <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}