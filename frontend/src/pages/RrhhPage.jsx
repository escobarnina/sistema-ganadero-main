// frontend/src/pages/RrhhPage.jsx
import React, { useState } from 'react'
import { useRrhh } from '../hooks/useRrhh'
import TipoEmpleadoForm from '../components/TipoEmpleadoForm'
import EmpleadoForm from '../components/EmpleadoForm'

const estadoConfig = {
  ACTIVO:     { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  INACTIVO:   { cls: 'bg-red-50 text-red-700 ring-red-600/20',            dot: 'bg-red-500'     },
  LICENCIA:   { cls: 'bg-amber-50 text-amber-700 ring-amber-600/20',      dot: 'bg-amber-500'   },
  VACACIONES: { cls: 'bg-blue-50 text-blue-700 ring-blue-600/20',         dot: 'bg-blue-500'    },
}

const getIniciales = (nombre = '') =>
  nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

const avatarColors = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-indigo-100 text-indigo-700',
]

const getAvatarColor = (id = '') =>
  avatarColors[id.charCodeAt(id.length - 1) % avatarColors.length]

const fmt = {
  fecha: (f) => f ? new Date(f).toLocaleDateString('es-PY') : '—',
  salario: (s) => s ? `Gs. ${parseFloat(s).toLocaleString('es-PY')}` : '—',
}

const RrhhPage = () => {
  const { tipos, empleados, eliminarTipo, eliminarEmpleado, loading } = useRrhh()
  const [activeTab, setActiveTab] = useState('empleados')
  const [showTipoModal, setShowTipoModal] = useState(false)
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false)
  const [editTipo, setEditTipo] = useState(null)
  const [editEmpleado, setEditEmpleado] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const handleEliminarTipo = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el tipo "${nombre}"?`)) return
    const r = await eliminarTipo(id)
    alert(r.success ? '✅ Tipo eliminado' : `❌ ${r.error}`)
  }

  const handleEliminarEmpleado = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar al empleado "${nombre}"?`)) return
    const r = await eliminarEmpleado(id)
    alert(r.success ? '✅ Empleado eliminado' : `❌ ${r.error}`)
  }

  const empleadosFiltrados = empleados.filter(e =>
    !busqueda ||
    e.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.ci?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.tipo?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const activos = empleados.filter(e => e.estado === 'ACTIVO').length

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recursos Humanos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestión de personal y cargos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total empleados</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{empleados.length}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Activos</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{activos}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tipos de cargo</p>
          <p className="mt-1 text-3xl font-bold text-indigo-600">{tipos.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[
          { id: 'empleados', label: 'Empleados', count: empleados.length },
          { id: 'tipos',     label: 'Tipos de cargo', count: tipos.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── EMPLEADOS ── */}
      {activeTab === 'empleados' && (
        <div>
          <div className="flex items-center justify-between mb-4 gap-3">
            <input
              type="text"
              placeholder="Buscar por nombre, CI o cargo…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="flex-1 max-w-xs text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => { setEditEmpleado(null); setShowEmpleadoModal(true) }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Nuevo empleado
            </button>
          </div>

          {empleadosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm bg-gray-50 rounded-xl">
              {busqueda ? 'Sin resultados para la búsqueda' : 'No hay empleados registrados'}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Empleado</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Contacto</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Ingreso</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Salario</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {empleadosFiltrados.map(emp => {
                    const cfg = estadoConfig[emp.estado] || estadoConfig.INACTIVO
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Empleado */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${getAvatarColor(emp.id)}`}>
                              {getIniciales(emp.nombreCompleto)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 leading-tight">{emp.nombreCompleto}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{emp.tipo?.nombre || '—'}</p>
                              {emp.ci && <p className="text-xs text-gray-400">CI {emp.ci}</p>}
                            </div>
                          </div>
                        </td>

                        {/* Contacto */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            {emp.telefono && (
                              <p className="text-gray-600">{emp.telefono}</p>
                            )}
                            {emp.email && (
                              <p className="text-gray-400 text-xs truncate max-w-[180px]">{emp.email}</p>
                            )}
                            {!emp.telefono && !emp.email && <span className="text-gray-300">—</span>}
                          </div>
                        </td>

                        {/* Ingreso */}
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                          {fmt.fecha(emp.fechaIngreso)}
                        </td>

                        {/* Salario */}
                        <td className="px-5 py-4 font-medium text-gray-700 whitespace-nowrap">
                          {fmt.salario(emp.salario)}
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${cfg.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {emp.estado}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => { setEditEmpleado(emp); setShowEmpleadoModal(true) }}
                              className="text-xs text-gray-500 hover:text-blue-600 font-medium px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarEmpleado(emp.id, emp.nombreCompleto)}
                              className="text-xs text-gray-400 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TIPOS DE CARGO ── */}
      {activeTab === 'tipos' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setEditTipo(null); setShowTipoModal(true) }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Nuevo tipo
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nombre</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Descripción</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Salario base</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tipos.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{t.nombre}</td>
                    <td className="px-5 py-4 text-gray-500">{t.descripcion || '—'}</td>
                    <td className="px-5 py-4 font-medium text-gray-700">
                      Gs. {parseFloat(t.salarioBase || 0).toLocaleString('es-PY')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        t.activo
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-gray-50 text-gray-500 ring-gray-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.activo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {t.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setEditTipo(t); setShowTipoModal(true) }}
                          className="text-xs text-gray-500 hover:text-blue-600 font-medium px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarTipo(t.id, t.nombre)}
                          className="text-xs text-gray-400 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors"
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
        </div>
      )}

      {/* Modal Tipo */}
      {showTipoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <TipoEmpleadoForm
              tipoParaEditar={editTipo}
              onSuccess={() => { setShowTipoModal(false); setEditTipo(null) }}
              onCancel={() => { setShowTipoModal(false); setEditTipo(null) }}
            />
          </div>
        </div>
      )}

      {/* Modal Empleado */}
      {showEmpleadoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-2xl w-full">
            <EmpleadoForm
              empleadoParaEditar={editEmpleado}
              onSuccess={() => { setShowEmpleadoModal(false); setEditEmpleado(null) }}
              onCancel={() => { setShowEmpleadoModal(false); setEditEmpleado(null) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RrhhPage
