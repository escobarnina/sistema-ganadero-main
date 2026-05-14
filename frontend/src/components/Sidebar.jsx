import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const menuGroups = [
  {
    label: 'Principal',
    items: [
      { path: '/',             name: 'Dashboard',      permiso: 'dashboard_ver' },
      { path: '/catalogos',    name: 'Catalogos',      permiso: 'catalogos_ver' },
      { path: '/vacunas',      name: 'Vacunas',        permiso: 'vacunas_ver' },
      { path: '/animales',     name: 'Animales',       permiso: 'animales_ver' },
      { path: '/vacunaciones', name: 'Vacunaciones',   permiso: 'vacunaciones_ver' },
    ],
  },
  {
    label: 'Comercio',
    items: [
      { path: '/clientes',    name: 'Clientes',    permiso: 'clientes_ver' },
      { path: '/proveedores', name: 'Proveedores', permiso: 'proveedores_ver' },
      { path: '/compras',     name: 'Compras',     permiso: 'compras_ver' },
      { path: '/ventas',      name: 'Ventas',      permiso: 'ventas_ver' },
    ],
  },
  {
    label: 'Ganaderia',
    items: [
      { path: '/reproduccion', name: 'Reproduccion', permiso: 'reproduccion_ver' },
      { path: '/produccion',   name: 'Produccion',   permiso: 'produccion_ver' },
      { path: '/sanidad',      name: 'Sanidad',       permiso: 'sanidad_ver' },
      { path: '/alertas',      name: 'Alertas',       permiso: 'alertas_ver' },
      { path: '/rrhh',         name: 'RRHH',          permiso: 'rrhh_ver' },
      { path: '/bajas',        name: 'Muertes y Bajas', permiso: 'muertes_ver' },
    ],
  },
  {
    label: 'Administracion',
    items: [
      { path: '/usuarios', name: 'Usuarios', permiso: 'usuarios_ver', soloAdmin: true },
      { path: '/roles',    name: 'Roles',    permiso: 'roles_ver',    soloAdmin: true },
      { path: '/fincas',   name: 'Fincas',   permiso: 'fincas_ver' },
    ],
  },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const { logout, tienePermiso, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin =
    user?.rol?.nombre === 'ADMINISTRADOR' ||
    user?.rol?.nombre === 'SUPER_ADMIN' ||
    user?.rol?.nombre === 'ADMIN_FINCA'

  const canSee = (item) => {
    if (item.soloAdmin && !isAdmin) return false
    if (!item.permiso) return true
    return tienePermiso(item.permiso)
  }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname === path

  return (
    <>
      <aside
        className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          width: isOpen ? '240px' : '68px',
          background: 'linear-gradient(180deg, #052e16 0%, #064e3b 55%, #052e16 100%)',
          boxShadow: '4px 0 20px rgba(0,0,0,.25)',
        }}
      >
        {/* Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-5 w-6 h-6 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg transition z-10 flex-shrink-0"
        >
          <svg
            width="10" height="10" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
            style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform .3s' }}
          >
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Logo */}
        <div
          className="flex items-center gap-3 border-b border-white/10 flex-shrink-0"
          style={{ padding: isOpen ? '18px 16px' : '18px 0', justifyContent: isOpen ? 'flex-start' : 'center' }}
        >
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0 shadow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight tracking-wide">GanadoSoft</p>
              <p className="text-green-400 text-[10px]">Sistema Ganadero</p>
            </div>
          )}
        </div>

        {/* User info */}
        {isOpen && user && (
          <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(user.username || 'U')[0].toUpperCase()}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-green-300 text-xs font-semibold truncate">{user.username}</p>
                <p className="text-green-500 text-[9px] truncate">{user.rol?.nombre || 'Sin rol'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
          {menuGroups.map((group) => {
            const visibleItems = group.items.filter(canSee)
            if (visibleItems.length === 0) return null

            return (
              <div key={group.label}>
                {isOpen && (
                  <p className="text-green-700 text-[9px] font-bold uppercase tracking-widest px-3 mb-1.5">
                    {group.label}
                  </p>
                )}
                {!isOpen && (
                  <div className="border-t border-white/8 mx-2 mb-2" />
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={!isOpen ? item.name : undefined}
                        className="flex items-center gap-3 rounded-xl text-[13px] transition-all duration-150 group relative"
                        style={{
                          padding: isOpen ? '8px 12px' : '8px 0',
                          justifyContent: isOpen ? 'flex-start' : 'center',
                          background: active ? 'rgba(134,239,172,.1)' : 'transparent',
                          color: active ? '#86efac' : '#6ee7b7',
                          fontWeight: active ? '600' : '400',
                          borderLeft: active ? '2px solid #4ade80' : '2px solid transparent',
                        }}
                      >
                        {/* Indicador punto */}
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all"
                          style={{ background: active ? '#4ade80' : 'rgba(110,231,183,.25)' }}
                        />
                        {isOpen && (
                          <span className="truncate">{item.name}</span>
                        )}
                        {/* Tooltip colapsado */}
                        {!isOpen && (
                          <span
                            className="absolute left-14 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                            style={{ boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
                          >
                            {item.name}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-white/8 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-red-900/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 transition text-xs font-medium"
            style={{ justifyContent: isOpen ? 'flex-start' : 'center' }}
            title={!isOpen ? 'Cerrar sesion' : undefined}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            {isOpen && <span>Cerrar sesion</span>}
          </button>
        </div>
      </aside>

      {/* Overlay movil */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(true)}
        />
      )}
    </>
  )
}