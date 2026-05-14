// frontend/src/pages/ReproduccionPage.jsx
import React, { useState } from 'react'
import { useReproduccion } from '../hooks/useReproduccion'
import InseminacionForm from '../components/InseminacionForm'
import ProximosPartosCard from '../components/ProximosPartosCard'
import DashboardCard from '../components/DashboardCard'

const ReproduccionPage = () => {
  const { inseminaciones, diagnosticos, reproducciones, vacasPrenadas, loading } = useReproduccion()
  const [activeTab, setActiveTab] = useState('inseminaciones')
  
  const tabs = [
    { id: 'inseminaciones', label: 'Inseminaciones', count: inseminaciones.length },
    { id: 'diagnosticos', label: 'Diagnósticos', count: diagnosticos.length },
    { id: 'partos', label: 'Partos', count: reproducciones.length },
    { id: 'nueva', label: '+ Nueva IA', special: true },
  ]
  
  if (loading) return <div className="flex justify-center items-center h-64">Cargando...</div>
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-800">🐄 Módulo de Reproducción</h1>
        <p className="text-gray-600">Gestión de inseminaciones, diagnósticos y partos</p>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Vacas Preñadas" value={vacasPrenadas.length} color="green" />
        <DashboardCard title="Inseminaciones" value={inseminaciones.length} color="blue" />
        <DashboardCard title="Partos este año" value={reproducciones.length} color="purple" />
        <ProximosPartosCard />
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              } ${tab.special ? 'bg-green-100 rounded-t' : ''}`}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content */}
      <div>
        {activeTab === 'inseminaciones' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hembra</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reproductor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Pajuela</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inseminaciones.map(ia => (
                  <tr key={ia.id}>
                    <td className="px-6 py-4 text-sm">{new Date(ia.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">{ia.hembra?.nroArete} - {ia.hembra?.nombre || 'Sin nombre'}</td>
                    <td className="px-6 py-4 text-sm">{ia.reproductor?.codigo || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{ia.numeroPajuela || '-'}</td>
                    <td className="px-6 py-4 text-sm">{ia.tecnicoInseminador || '-'}</td>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hembra</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días Gestación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {diagnosticos.map(d => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 text-sm">{new Date(d.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">{d.hembra?.nroArete}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        d.resultadoPrenez === 'POSITIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {d.resultadoPrenez}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{d.diasGestacion || '-'}</td>
                    <td className="px-6 py-4 text-sm">{d.metodo || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'nueva' && (
          <InseminacionForm onSuccess={() => setActiveTab('inseminaciones')} />
        )}
      </div>
    </div>
  )
}

export default ReproduccionPage