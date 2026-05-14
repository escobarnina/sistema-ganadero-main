// frontend/src/pages/UsuariosPage.jsx
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_USUARIOS, CREATE_USUARIO, UPDATE_USUARIO, DELETE_USUARIO } from '../graphql/usuarios'
import { GET_ROLES } from '../graphql/roles'  // 👈 Importar GET_ROLES desde roles.js
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const UsuariosPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_USUARIOS)
  const { data: rolesData } = useQuery(GET_ROLES)  // 👈 Ahora funciona
  const [createUsuario] = useMutation(CREATE_USUARIO)
  const [updateUsuario] = useMutation(UPDATE_USUARIO)
  const [deleteUsuario] = useMutation(DELETE_USUARIO)

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    rolId: '',
    telefono: ''
  })

  const usuarios = data?.usuarios || []
  const roles = rolesData?.roles || []

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let result
      if (editingUser) {
        result = await updateUsuario({
          variables: {
            id: editingUser,
            username: formData.username,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            rolId: formData.rolId || null,
            telefono: formData.telefono,
            isActive: true
          }
        })
      } else {
        result = await createUsuario({
          variables: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            rolId: formData.rolId || null,
            telefono: formData.telefono
          }
        })
      }
      
      if (result.data?.crearUsuario?.success || result.data?.actualizarUsuario?.success) {
        setMessage({ type: 'success', text: result.data?.crearUsuario?.message || result.data?.actualizarUsuario?.message })
        setShowForm(false)
        setEditingUser(null)
        setFormData({ username: '', email: '', password: '', firstName: '', lastName: '', rolId: '', telefono: '' })
        refetch()
      } else {
        setMessage({ type: 'error', text: result.data?.crearUsuario?.message || 'Error al guardar' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id, username) => {
    if (window.confirm(`¿Eliminar el usuario "${username}"?`)) {
      try {
        const result = await deleteUsuario({ variables: { id } })
        if (result.data?.eliminarUsuario?.success) {
          setMessage({ type: 'success', text: result.data.eliminarUsuario.message })
          refetch()
        } else {
          setMessage({ type: 'error', text: result.data?.eliminarUsuario?.message })
        }
      } catch (err) {
        setMessage({ type: 'error', text: err.message })
      }
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user.id)
    setFormData({
      username: user.username,
      email: user.email || '',
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      rolId: user.rol?.id || '',
      telefono: user.telefono || ''
    })
    setShowForm(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👥 Gestión de Usuarios</h1>
        <button
          onClick={() => {
            setEditingUser(null)
            setFormData({ username: '', email: '', password: '', firstName: '', lastName: '', rolId: '', telefono: '' })
            setShowForm(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Nuevo Usuario
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm font-medium">{user.username}</td>
                <td className="px-6 py-4 text-sm">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4 text-sm">{user.email || '-'}</td>
                <td className="px-6 py-4 text-sm">{user.rol?.nombre || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-yellow-600 hover:text-yellow-800">✏️</button>
                  <button onClick={() => handleDelete(user.id, user.username)} className="text-red-600 hover:text-red-800">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingUser ? '✏️ Editar Usuario' : '+ Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Usuario *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {!editingUser && (
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Contraseña *</label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Apellido</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={formData.rolId}
                  onChange={(e) => setFormData({ ...formData, rolId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                  {editingUser ? 'Actualizar' : 'Crear'}
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

export default UsuariosPage