// frontend/src/pages/DashboardPage.jsx
import React from 'react'
import { useDashboard } from '../hooks/useDashboard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ChartCard from '../components/ChartCard'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import LineChart from '../components/LineChart'

const DashboardPage = () => {
  const { 
    totalAnimales, 
    totalVacunas, 
    totalVacunaciones, 
    animalesActivos,
    proximasVacunaciones,
    vacunacionesPorMes,
    animalesPorCategoria,
    animalesPorSexo,
    vacunasPorTipo,
    ventasPorMes,
    produccionPorMes,
    loading,
    error 
  } = useDashboard()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Animales</div>
          <div className="text-2xl font-bold text-blue-700">{totalAnimales}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Animales Activos</div>
          <div className="text-2xl font-bold text-green-700">{animalesActivos}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Total Vacunas</div>
          <div className="text-2xl font-bold text-purple-700">{totalVacunas}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="text-sm text-gray-500">Vacunaciones</div>
          <div className="text-2xl font-bold text-orange-700">{totalVacunaciones}</div>
        </div>
      </div>

      {/* Gráficos - Primera fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Vacunaciones por Mes */}
        <ChartCard title="📅 Vacunaciones por Mes" icon="💉">
          <BarChart
            labels={vacunacionesPorMes.labels}
            data={vacunacionesPorMes.values}
            title="Cantidad de Vacunaciones"
            backgroundColor="#f59e0b"
          />
        </ChartCard>

        {/* Ventas por Mes */}
        <ChartCard title="💰 Ventas por Mes" icon="📊">
          <LineChart
            labels={ventasPorMes.labels}
            data={ventasPorMes.values}
            title="Monto en Gs."
            color="#10b981"
          />
        </ChartCard>
      </div>

      {/* Gráficos - Segunda fila */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Animales por Categoría */}
        <ChartCard title="🐄 Animales por Categoría" icon="📋">
          <PieChart
            labels={animalesPorCategoria.labels}
            data={animalesPorCategoria.values}
          />
        </ChartCard>

        {/* Animales por Sexo */}
        <ChartCard title="⚧ Animales por Sexo" icon="👥">
          <PieChart
            labels={animalesPorSexo.labels}
            data={animalesPorSexo.values}
            colors={['#3b82f6', '#ec489a']}
          />
        </ChartCard>

        {/* Vacunas por Tipo */}
        <ChartCard title="💉 Vacunas por Vía de Aplicación" icon="💊">
          <PieChart
            labels={vacunasPorTipo.labels}
            data={vacunasPorTipo.values}
          />
        </ChartCard>
      </div>

      {/* Producción por Mes */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="🥛 Producción de Leche por Mes" icon="📈">
          <BarChart
            labels={produccionPorMes.labels}
            data={produccionPorMes.values}
            title="Litros Producidos"
            backgroundColor="#8b5cf6"
          />
        </ChartCard>
      </div>

      {/* Próximas Vacunaciones */}
      {proximasVacunaciones.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">⚠️ Próximas Vacunaciones (30 días)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Animal</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vacuna</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fecha Próxima</th>
                </tr>
              </thead>
              <tbody>
                {proximasVacunaciones.map(v => (
                  <tr key={v.id}>
                    <td className="px-4 py-2 text-sm">{v.animal?.nroArete} - {v.animal?.nombre}</td>
                    <td className="px-4 py-2 text-sm">{v.vacuna?.nombre}</td>
                    <td className="px-4 py-2 text-sm">{new Date(v.fechaProxima).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage