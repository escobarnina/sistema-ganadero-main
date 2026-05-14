import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CATEGORIAS_ANIMALES, CREATE_CATEGORIA_ANIMAL, UPDATE_CATEGORIA_ANIMAL, DELETE_CATEGORIA_ANIMAL } from '../../graphql/catalogos'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

export default function CategoriasList() {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIAS_ANIMALES)
  const [createCategoria] = useMutation(CREATE_CATEGORIA_ANIMAL)
  const [updateCategoria] = useMutation(UPDATE_CATEGORIA_ANIMAL)
  const [deleteCategoria] = useMutation(DELETE_CATEGORIA_ANIMAL)
  
  const [showForm, setShowForm] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState(null)
  const [message, setMessage] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)

  const categorias = data?.categoriasAnimales || []

  const handleCreate = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const variables = {
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
    }

    try {
      const result = await createCategoria({ variables })
      if (result.data?.crearCategoriaAnimal?.success) {
        setMessage({ type: 'success', text: result.data.crearCategoriaAnimal.message })
        refetch()
        setShowForm(false)
      } else {
        setMessage({ type: 'error', text: result.data?.crearCategoriaAnimal?.message || 'Error al crear' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria)
    setShowForm(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const variables = {
      id: editingCategoria.id,
      nombre: formData.get('nombre'),
      activo: formData.get('activo') === 'true',
    }

    try {
      const result = await updateCategoria({ variables })
      if (result.data?.actualizarCategoriaAnimal?.success) {
        setMessage({ type: 'success', text: result.data.actualizarCategoriaAnimal.message })
        refetch()
        setShowForm(false)
        setEditingCategoria(null)
      } else {
        setMessage({ type: 'error', text: result.data?.actualizarCategoriaAnimal?.message || 'Error al actualizar' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id) => {
    try {
      const result = await deleteCategoria({ variables: { id } })
      if (result.data?.eliminarCategoriaAnimal?.success) {
        setMessage({ type: 'success', text: result.data.eliminarCategoriaAnimal.message })
        refetch()
      } else {
        setMessage({ type: 'error', text: result.data?.eliminarCategoriaAnimal?.message || 'Error al eliminar' })
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
            setEditingCategoria(null)
            setShowForm(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Nueva Categoría
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {categorias.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay categorías registradas</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{categoria.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{categoria.descripcion || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${categoria.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {categoria.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowConfirm(categoria.id)}
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
                {editingCategoria ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
              </h2>
              <form onSubmit={editingCategoria ? handleUpdate : handleCreate}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={editingCategoria?.nombre || ''}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    defaultValue={editingCategoria?.descripcion || ''}
                    rows="3"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                {editingCategoria && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      name="activo"
                      defaultValue={editingCategoria.activo ? 'true' : 'false'}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                    {editingCategoria ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCategoria(null)
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
            <h3 className="text-lg font-bold mb-4">¿Eliminar categoría?</h3>
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