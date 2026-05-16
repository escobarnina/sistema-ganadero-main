// frontend/src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLayout } from '../context/LayoutContext'

// ── Iconos SVG inline (heroicons outline 24px) ────────────────────────────────
const PATHS = {
  dashboard:    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  animales:     'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  vacunas:      'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  vacunaciones: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  reproduccion: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  produccion:   'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  sanidad:      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  bajas:        'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  compras:      'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
  ventas:       'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z',
  clientes:     'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  proveedores:  'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1',
  alertas:      'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  rrhh:         'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  usuarios:     'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  roles:        'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  catalogos:    'M4 6h16M4 10h16M4 14h16M4 18h16',
  fincas:       'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
}

function Icon({ name, size = 15 }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <path d={d} />
    </svg>
  )
}

// ── Definición de grupos y módulos ────────────────────────────────────────────
const MENU_GROUPS = [
  {
    label: 'Principal',
    items: [
      { path: '/',          name: 'Dashboard',    icon: 'dashboard',    permiso: null },
    ],
  },
  {
    label: 'Ganadería',
    items: [
      { path: '/animales',     name: 'Animales',     icon: 'animales',     permiso: 'animales_ver' },
      { path: '/vacunas',      name: 'Vacunas',       icon: 'vacunas',      permiso: 'vacunas_ver' },
      { path: '/vacunaciones', name: 'Vacunaciones',  icon: 'vacunaciones', permiso: 'vacunaciones_ver' },
      { path: '/reproduccion', name: 'Reproducción',  icon: 'reproduccion', permiso: 'reproduccion_ver' },
      { path: '/produccion',   name: 'Producción',    icon: 'produccion',   permiso: 'produccion_ver' },
      { path: '/sanidad',      name: 'Sanidad',        icon: 'sanidad',      permiso: 'sanidad_ver' },
      { path: '/bajas',        name: 'Bajas',          icon: 'bajas',        permiso: 'animales_ver' },
    ],
  },
  {
    label: 'Comercio',
    items: [
      { path: '/compras',     name: 'Compras',     icon: 'compras',     permiso: 'compras_ver' },
      { path: '/ventas',      name: 'Ventas',       icon: 'ventas',      permiso: 'ventas_ver' },
      { path: '/clientes',    name: 'Clientes',     icon: 'clientes',    permiso: 'ventas_ver' },
      { path: '/proveedores', name: 'Proveedores',  icon: 'proveedores', permiso: 'compras_ver' },
    ],
  },
  {
    label: 'Administración',
    items: [
      { path: '/alertas',   name: 'Alertas',   icon: 'alertas',   permiso: 'alertas_ver' },
      { path: '/rrhh',      name: 'RRHH',       icon: 'rrhh',      permiso: 'rrhh_ver' },
      { path: '/usuarios',  name: 'Usuarios',   icon: 'usuarios',  permiso: 'usuarios_ver' },
      { path: '/roles',     name: 'Roles',       icon: 'roles',     permiso: 'roles_ver' },
      { path: '/catalogos', name: 'Catálogos',  icon: 'catalogos', permiso: 'configuracion_ver' },
      { path: '/fincas',    name: 'Fincas',      icon: 'fincas',    permiso: 'configuracion_ver' },
    ],
  },
]

// ── Componente principal ──────────────────────────────────────────────────────
export default function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen } = useLayout()
  const { tienePermiso, esAdministrador, user } = useAuth()

  const canSee = (item) => {
    if (!item.permiso) return true
    if (esAdministrador) return true
    return tienePermiso(item.permiso)
  }

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  const W = sidebarOpen ? 240 : 68

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden transition-all duration-300"
      style={{
        width: W,
        background: 'linear-gradient(180deg, #052e16 0%, #065f46 60%, #052e16 100%)',
        boxShadow: '4px 0 24px rgba(0,0,0,.28)',
      }}
    >
      {/* ── Logo / Brand ─────────────────────────────────── */}
      <div
        className="flex items-center gap-3 border-b border-white/10 flex-shrink-0"
        style={{ height: 56, padding: sidebarOpen ? '0 16px' : '0', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
      >
        <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight">GanadoSoft</p>
            <p className="text-green-400 text-[10px] font-medium">Sistema Ganadero</p>
          </div>
        )}
      </div>

      {/* ── Usuario ──────────────────────────────────────── */}
      {user && (
        <div
          className="mx-2 mt-2 mb-1 rounded-xl bg-white/5 border border-white/8 flex-shrink-0 overflow-hidden transition-all duration-300"
          style={{ padding: sidebarOpen ? '10px 12px' : '10px 0', justifyContent: sidebarOpen ? undefined : 'center', display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {(user.username || 'U')[0].toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden min-w-0">
              <p className="text-green-200 text-xs font-semibold truncate">{user.username}</p>
              <p className="text-green-500 text-[10px] truncate">{user.rol?.nombre || 'Sin rol'}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Navegación ───────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin">
        {MENU_GROUPS.map((group) => {
          const visible = group.items.filter(canSee)
          if (visible.length === 0) return null
          return (
            <div key={group.label}>
              {/* Label de grupo */}
              {sidebarOpen ? (
                <p className="text-green-700 text-[9px] font-bold uppercase tracking-widest px-2 pt-3 pb-1.5 select-none">
                  {group.label}
                </p>
              ) : (
                <div className="border-t border-white/8 mx-1 my-2" />
              )}

              {/* Items */}
              <div className="space-y-px">
                {visible.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={!sidebarOpen ? item.name : undefined}
                      className="flex items-center rounded-xl text-[12.5px] transition-all duration-150 group relative"
                      style={{
                        gap: sidebarOpen ? 10 : 0,
                        padding: sidebarOpen ? '8px 10px' : '9px 0',
                        justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        background: active ? 'rgba(134,239,172,.12)' : 'transparent',
                        color: active ? '#86efac' : '#6ee7b7',
                        fontWeight: active ? 600 : 400,
                        borderLeft: active && sidebarOpen ? '2px solid #4ade80' : '2px solid transparent',
                      }}
                    >
                      {/* Indicador activo colapsado */}
                      {!sidebarOpen && active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r bg-green-400" />
                      )}

                      <Icon name={item.icon} size={15} />
                      {sidebarOpen && <span className="truncate">{item.name}</span>}

                      {/* Tooltip colapsado */}
                      {!sidebarOpen && (
                        <span className="absolute left-14 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity">
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

      {/* ── Toggle expandir/colapsar ─────────────────────── */}
      <div className="p-2 border-t border-white/8 flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-green-400 hover:text-green-300 transition text-xs font-medium"
          style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform .3s', flexShrink: 0 }}>
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          {sidebarOpen && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  )
}
