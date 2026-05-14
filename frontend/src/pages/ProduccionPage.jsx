// frontend/src/pages/ProduccionPage.jsx
import React, { useState } from 'react'
import { useProduccion } from '../hooks/useProduccion'
import LactanciaForm from '../components/LactanciaForm'
import ProduccionLecheForm from '../components/ProduccionLecheForm'
import RegistroPesoForm from '../components/RegistroPesoForm'
import ProduccionCard from '../components/ProduccionCard'

const ProduccionPage = () => {
  const { 
    lactancias, 
    produccionesHoy, 
    produccionTotalHoy, 
    top5Vacas,
    loading 
  } = useProduccion()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'lactancias', label: '🐄 Lactancias', count: lactancias.length },
    { id: 'produccion', label: '🥛 Registrar Producción' },
    { id: 'peso', label: '⚖️ Registro Peso' },
    { id: 'nueva_lactancia', label: '+ Nueva Lactancia' },
  ]
  
  // Calcular producción del día formateada
  const produccionHoy = produccionesHoy.reduce((sum, p) => sum + p.litros, 0)
  
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
        <h1 className="text-2xl font-bold text-blue-800">🥛 Módulo de Producción Lechera</h1>
        <p className="text-gray-600">Gestión de lactancias, producción diaria y pesos</p>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <ProduccionCard 
          titulo="Producción Hoy" 
          valor={`${produccionTotalHoy || 0} L`} 
          icono="🥛" 
          color="blue"
          subtitulo={`${produccionesHoy.length} registros`}
        />
        <ProduccionCard 
          titulo="Lactancias Activas" 
          valor={lactancias.filter(l => l.estado === 'ACTIVA').length} 
          icono="🐄" 
          color="green"
        />
        <ProduccionCard 
          titulo="Total Lactancias" 
          valor={lactancias.length} 
          icono="📊" 
          color="purple"
        />
        <ProduccionCard 
          titulo="Promedio por Vaca" 
          valor={lactancias.length > 0 ? `${(lactancias.reduce((sum, l) => sum + (l.promedioDiario || 0), 0) / lactancias.length).toFixed(1)} L/día` : '0 L/día'} 
          icono="📈" 
          color="yellow"
        />
      </div>
      
      {/* Top 5 Vacas */}
      {top5Vacas && top5Vacas.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🏆 Top 5 Vacas - Producción Hoy</h3>
          <div className="space-y-2">
            {top5Vacas.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-yellow-500 w-8">#{index + 1}</span>
                  <span className="font-medium">{item.vaca?.nroArete} - {item.vaca?.nombre || 'Sin nombre'}</span>
                </div>
                <span className="text-blue-600 font-bold">{item.litros} L</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
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
            {/* Lactancias Activas */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-3">
                <h3 className="font-bold">🐄 Lactancias Activas</h3>
              </div>
              <div className="p-4">
                {lactancias.filter(l => l.estado === 'ACTIVA').length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay lactancias activas</p>
                ) : (
                  <div className="space-y-3">
                    {lactancias.filter(l => l.estado === 'ACTIVA').map(lactancia => (
                      <div key={lactancia.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold">{lactancia.vaca?.nroArete}</p>
                            <p className="text-sm text-gray-600">Lactancia #{lactancia.numeroLactancia}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Inicio: {new Date(lactancia.fechaInicio).toLocaleDateString()}</p>
                            <p className="text-sm font-bold text-blue-600">{lactancia.promedioDiario?.toFixed(1) || 0} L/día</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Últimos Registros */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-3">
                <h3 className="font-bold">🥛 Producción de Hoy</h3>
              </div>
              <div className="p-4">
                {produccionesHoy.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay registros hoy</p>
                ) : (
                  <div className="space-y-2">
                    {produccionesHoy.map(prod => (
                      <div key={prod.id} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">{prod.vaca?.nroArete}</span>
                        <span className="text-sm text-gray-500">{prod.turno}</span>
                        <span className="font-bold text-blue-600">{prod.litros} L</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'lactancias' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Lactancia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Litros</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lactancias.map(l => (
                  <tr key={l.id}>
                    <td className="px-6 py-4 text-sm">{l.vaca?.nroArete} - {l.vaca?.nombre || ''}</td>
                    <td className="px-6 py-4 text-sm">{l.numeroLactancia}</td>
                    <td className="px-6 py-4 text-sm">{new Date(l.fechaInicio).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">{l.diasProduccion || 0}</td>
                    <td className="px-6 py-4 text-sm">{l.totalLitros?.toFixed(1) || 0} L</td>
                    <td className="px-6 py-4 text-sm">{l.promedioDiario?.toFixed(1) || 0} L/día</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        l.estado === 'ACTIVA' ? 'bg-green-100 text-green-800' : 
                        l.estado === 'SECADA' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {l.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'produccion' && (
          <ProduccionLecheForm onSuccess={() => setActiveTab('dashboard')} />
        )}
        
        {activeTab === 'peso' && (
          <RegistroPesoForm onSuccess={() => setActiveTab('dashboard')} />
        )}
        
        {activeTab === 'nueva_lactancia' && (
          <LactanciaForm onSuccess={() => setActiveTab('lactancias')} />
        )}
      </div>
    </div>
  )
}

export default ProduccionPage