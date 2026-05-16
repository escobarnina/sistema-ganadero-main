// frontend/src/pages/DashboardPage.jsx
import { useDashboard } from '../hooks/useDashboard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ChartCard from '../components/ChartCard'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import LineChart from '../components/LineChart'

// ── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon, gradient, textColor }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white ${gradient}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-4xl font-extrabold mt-1 tracking-tight">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
      {/* decorative blob */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
    </div>
  )
}

// ── SVG icons ────────────────────────────────────────────────────────────────
const IconCow = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 8c0-2.2 1.8-4 4-4s4 1.8 4 4v8H4V8z" /><path d="M12 12h4l3 4h-7v-4z" />
    <circle cx="7" cy="19" r="1.5" /><circle cx="14" cy="19" r="1.5" />
  </svg>
)
const IconCheck = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconVaccine = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M10 2v4M14 2v4M3 10h18M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10" />
  </svg>
)
const IconSyringe = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <line x1="22" y1="2" x2="14" y2="10" /><line x1="17" y1="7" x2="7" y2="17" />
    <line x1="11" y1="11" x2="9" y2="13" /><path d="M3 21l4-4" /><path d="M9 17l-4 4" />
  </svg>
)

// ── Wrapper seguro para gráficos (no renderiza si no hay datos) ───────────────
function ChartWrapper({ labels = [], children }) {
  if (!labels || labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin datos disponibles
      </div>
    )
  }
  return children
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const {
    totalAnimales, totalVacunas, totalVacunaciones, animalesActivos,
    proximasVacunaciones,
    vacunacionesPorMes, animalesPorCategoria, animalesPorSexo,
    vacunasPorTipo, ventasPorMes, produccionPorMes,
    loading, error, refetchStats,
  } = useDashboard()

  if (loading) return <LoadingSpinner />
  if (error && !totalAnimales && !totalVacunas)
    return <ErrorMessage message={error.message} onRetry={refetchStats} />

  const kpis = [
    { label: 'Total Animales',    value: totalAnimales,     icon: <IconCow />,     gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { label: 'Animales Activos',  value: animalesActivos,   icon: <IconCheck />,   gradient: 'bg-gradient-to-br from-green-500 to-green-700' },
    { label: 'Vacunas Registradas', value: totalVacunas,    icon: <IconVaccine />, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700' },
    { label: 'Vacunaciones',       value: totalVacunaciones, icon: <IconSyringe />, gradient: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ChartCard title="Vacunaciones por Mes">
          <ChartWrapper labels={vacunacionesPorMes.labels}>
            <BarChart labels={vacunacionesPorMes.labels} data={vacunacionesPorMes.values}
              title="Cantidad" backgroundColor="#f59e0b" />
          </ChartWrapper>
        </ChartCard>
        <ChartCard title="Ventas por Mes">
          <ChartWrapper labels={ventasPorMes.labels}>
            <LineChart labels={ventasPorMes.labels} data={ventasPorMes.values}
              title="Monto (Gs.)" color="#10b981" />
          </ChartWrapper>
        </ChartCard>
      </div>

      {/* Gráficos fila 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ChartCard title="Animales por Categoría">
          <ChartWrapper labels={animalesPorCategoria.labels}>
            <PieChart labels={animalesPorCategoria.labels} data={animalesPorCategoria.values} />
          </ChartWrapper>
        </ChartCard>
        <ChartCard title="Animales por Sexo">
          <ChartWrapper labels={animalesPorSexo.labels}>
            <PieChart labels={animalesPorSexo.labels} data={animalesPorSexo.values}
              colors={['#3b82f6', '#ec4899']} />
          </ChartWrapper>
        </ChartCard>
        <ChartCard title="Vacunas por Vía de Aplicación">
          <ChartWrapper labels={vacunasPorTipo.labels}>
            <PieChart labels={vacunasPorTipo.labels} data={vacunasPorTipo.values} />
          </ChartWrapper>
        </ChartCard>
      </div>

      {/* Producción */}
      <ChartCard title="Producción de Leche por Mes">
        <ChartWrapper labels={produccionPorMes.labels}>
          <BarChart labels={produccionPorMes.labels} data={produccionPorMes.values}
            title="Litros" backgroundColor="#8b5cf6" />
        </ChartWrapper>
      </ChartCard>

      {/* Próximas vacunaciones */}
      {proximasVacunaciones.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-gray-800">
              Próximas Vacunaciones — próximos 30 días ({proximasVacunaciones.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">Animal</th>
                  <th className="px-5 py-3 text-left font-medium">Vacuna</th>
                  <th className="px-5 py-3 text-left font-medium">Fecha Próxima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {proximasVacunaciones.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {v.animal?.nroArete && <span className="text-gray-400 mr-1">#{v.animal.nroArete}</span>}
                      {v.animal?.nombre}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{v.vacuna?.nombre}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        {new Date(v.fechaProxima).toLocaleDateString('es-PY')}
                      </span>
                    </td>
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
