// frontend/src/pages/RrhhPage.jsx (versión con tarjetas)
import React, { useState } from 'react'
import { useRrhh } from '../hooks/useRrhh'
import TipoEmpleadoForm from '../components/TipoEmpleadoForm'
import EmpleadoForm from '../components/EmpleadoForm'
import EmpleadoCard from '../components/EmpleadoCard'

const RrhhPage = () => {
  const { tipos, empleados, eliminarTipo, eliminarEmpleado, loading } = useRrhh()
  const [activeTab, setActiveTab] = useState('empleados')
  const [showTipoModal, setShowTipoModal] = useState(false)
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false)
  const [editTipo, setEditTipo] = useState(null)
  const [editEmpleado, setEditEmpleado] = useState(null)

  const tabs = [
    { id: 'empleados', label: '👨‍🌾 Empleados', count: empleados.length },
    { id: 'tipos', label: '📋 Tipos de Empleado', count: tipos.length },
  ]

  const handleEliminarTipo = async (id, nombre) => {
    if (window.confirm(`¿Eliminar el tipo "${nombre}"?`)) {
      const result = await eliminarTipo(id)
      if (result.success) {
        alert('✅ Tipo eliminado')
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    }
  }

  const handleEliminarEmpleado = async (id, nombre) => {
    if (window.confirm(`¿Eliminar al empleado "${nombre}"?`)) {
      const result = await eliminarEmpleado(id)
      if (result.success) {
        alert('✅ Empleado eliminado')
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">👨‍🌾 Módulo de RRHH</h1>
        <p className="text-gray-600">Gestión de empleados y tipos de cargo</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Empleados</div>
          <div className="text-2xl font-bold text-blue-700">{empleados.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Empleados Activos</div>
          <div className="text-2xl font-bold text-green-700">{empleados.filter(e => e.estado === 'ACTIVO').length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Tipos de Cargo</div>
          <div className="text-2xl font-bold text-purple-700">{tipos.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content - Empleados en formato tarjetas */}
      {activeTab === 'empleados' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditEmpleado(null)
                setShowEmpleadoModal(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Nuevo Empleado
            </button>
          </div>

          {empleados.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay empleados registrados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {empleados.map(empleado => (
                <EmpleadoCard
                  key={empleado.id}
                  empleado={empleado}
                  onEditar={(emp) => {
                    setEditEmpleado(emp)
                    setShowEmpleadoModal(true)
                  }}
                  onEliminar={handleEliminarEmpleado}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content - Tipos */}
      {activeTab === 'tipos' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditTipo(null)
                setShowTipoModal(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Nuevo Tipo
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salario Base</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tipos.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{t.nombre}</td>
                    <td className="px-6 py-4 text-sm">{t.descripcion || '-'}</td>
                    <td className="px-6 py-4 text-sm">Gs. {parseFloat(t.salarioBase || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${t.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => {
                          setEditTipo(t)
                          setShowTipoModal(true)
                        }}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEliminarTipo(t.id, t.nombre)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tipo Empleado */}
      {showTipoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <TipoEmpleadoForm
              tipoParaEditar={editTipo}
              onSuccess={() => {
                setShowTipoModal(false)
                setEditTipo(null)
              }}
              onCancel={() => {
                setShowTipoModal(false)
                setEditTipo(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Empleado */}
      {showEmpleadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-2xl w-full">
            <EmpleadoForm
              empleadoParaEditar={editEmpleado}
              onSuccess={() => {
                setShowEmpleadoModal(false)
                setEditEmpleado(null)
              }}
              onCancel={() => {
                setShowEmpleadoModal(false)
                setEditEmpleado(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RrhhPage