// frontend/src/pages/SanidadPage.jsx
import React, { useState } from 'react'
import { useSanidad } from '../hooks/useSanidad'
import TratamientoForm from '../components/TratamientoForm'
import DesparasitacionForm from '../components/DesparasitacionForm'
import DiagnosticoForm from '../components/DiagnosticoForm'
import ObservacionForm from '../components/ObservacionForm'

const SanidadPage = () => {
  const { tratamientos, tratamientosActivos, desparasitaciones, diagnosticos, observaciones, loading } = useSanidad()
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'tratamientos', label: '🩺 Tratamientos', count: tratamientos.length },
    { id: 'desparasitaciones', label: '🪱 Desparasitaciones', count: desparasitaciones.length },
    { id: 'diagnosticos', label: '📋 Diagnósticos', count: diagnosticos.length },
    { id: 'observaciones', label: '📝 Observaciones', count: observaciones.length },
    { id: 'nuevo_tratamiento', label: '+ Tratamiento' },
    { id: 'nueva_desparasitacion', label: '+ Desparasitación' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-orange-800">🏥 Módulo de Sanidad</h1>
        <p className="text-gray-600">Gestión de tratamientos, desparasitaciones, diagnósticos y observaciones</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="text-sm text-gray-500">Activos</div>
          <div className="text-2xl font-bold text-orange-700">{tratamientosActivos.length}</div>
          <div className="text-xs text-gray-400">Tratamientos activos</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Registrados</div>
          <div className="text-2xl font-bold text-green-700">{desparasitaciones.length}</div>
          <div className="text-xs text-gray-400">Desparasitaciones</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Registrados</div>
          <div className="text-2xl font-bold text-purple-700">{diagnosticos.length}</div>
          <div className="text-xs text-gray-400">Diagnósticos</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
          <div className="text-sm text-gray-500">Registradas</div>
          <div className="text-2xl font-bold text-teal-700">{observaciones.length}</div>
          <div className="text-xs text-gray-400">Observaciones</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Totales</div>
          <div className="text-2xl font-bold text-blue-700">{tratamientos.length}</div>
          <div className="text-xs text-gray-400">Tratamientos totales</div>
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
                  ? 'border-b-2 border-orange-500 text-orange-600'
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
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tratamientos Activos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-orange-600 text-white px-4 py-3">
                <h3 className="font-bold">🩺 Tratamientos Activos</h3>
              </div>
              <div className="p-4">
                {tratamientosActivos.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay tratamientos activos</p>
                ) : (
                  <div className="space-y-3">
                    {tratamientosActivos.map(t => (
                      <div key={t.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold">{t.animal?.nroArete}</p>
                            <p className="text-sm text-gray-600">{t.diagnostico?.substring(0, 50)}...</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Inicio: {new Date(t.fecha).toLocaleDateString()}</p>
                            <p className="text-xs text-orange-600">Activo</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Últimos Diagnósticos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-purple-600 text-white px-4 py-3">
                <h3 className="font-bold">📋 Últimos Diagnósticos</h3>
              </div>
              <div className="p-4">
                {diagnosticos.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay diagnósticos registrados</p>
                ) : (
                  <div className="space-y-3">
                    {diagnosticos.slice(0, 5).map(d => (
                      <div key={d.id} className="border-b pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{d.animal?.nroArete}</span>
                          <span className="text-sm text-gray-500">{new Date(d.fecha).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600">{d.descripcion?.substring(0, 80)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tratamientos' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tratamientos.map(t => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 text-sm">{t.animal?.nroArete}</td>
                    <td className="px-6 py-4 text-sm">{t.diagnostico?.substring(0, 50)}</td>
                    <td className="px-6 py-4 text-sm">{new Date(t.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${t.enTratamiento ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {t.enTratamiento ? '🟡 Activo' : '✅ Completado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'desparasitaciones' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {desparasitaciones.map(d => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 text-sm">{d.animal?.nroArete}</td>
                    <td className="px-6 py-4 text-sm">{d.producto}</td>
                    <td className="px-6 py-4 text-sm">{new Date(d.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">{d.fechaProxima ? new Date(d.fechaProxima).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'diagnosticos' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veterinario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {diagnosticos.map(d => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 text-sm">{d.animal?.nroArete}</td>
                    <td className="px-6 py-4 text-sm">{d.descripcion?.substring(0, 60)}</td>
                    <td className="px-6 py-4 text-sm">{new Date(d.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">{d.veterinario?.nombre} {d.veterinario?.apellidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'observaciones' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {observaciones.map(o => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 text-sm">{o.animal?.nroArete}</td>
                    <td className="px-6 py-4 text-sm">{o.descripcion?.substring(0, 80)}</td>
                    <td className="px-6 py-4 text-sm">{new Date(o.fecha).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'nuevo_tratamiento' && (
          <TratamientoForm onSuccess={() => setActiveTab('tratamientos')} />
        )}

        {activeTab === 'nueva_desparasitacion' && (
          <DesparasitacionForm onSuccess={() => setActiveTab('desparasitaciones')} />
        )}
      </div>
    </div>
  )
}

export default SanidadPage