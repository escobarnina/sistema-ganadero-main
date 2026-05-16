// frontend/src/components/Layout.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLayout } from '../context/LayoutContext'
import Sidebar from './Sidebar'

// Mapa de rutas → títulos de página
const PAGE_TITLES = {
  '/':            'Dashboard',
  '/dashboard':   'Dashboard',
  '/animales':    'Animales',
  '/vacunas':     'Vacunas',
  '/vacunaciones':'Vacunaciones',
  '/reproduccion':'Reproducción',
  '/produccion':  'Producción',
  '/sanidad':     'Sanidad',
  '/bajas':       'Bajas y Muertes',
  '/compras':     'Compras',
  '/ventas':      'Ventas',
  '/clientes':    'Clientes',
  '/proveedores': 'Proveedores',
  '/alertas':     'Alertas',
  '/rrhh':        'Recursos Humanos',
  '/usuarios':    'Gestión de Usuarios',
  '/roles':       'Roles y Permisos',
  '/catalogos':   'Catálogos',
  '/fincas':      'Gestión de Finca',
  '/unauthorized':'Acceso Denegado',
}

// Icono de menú / hamburguesa
function MenuIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <path d="M6 18L18 6M6 6l12 12" />
      ) : (
        <>
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

export default function Layout({ children }) {
  const { sidebarOpen, setSidebarOpen } = useLayout()
  const { user, logout, nombreCompleto } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()

  const pageTitle  = PAGE_TITLES[location.pathname] ?? 'Sistema Ganadero'
  const sidebarW   = sidebarOpen ? 240 : 68

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = (nombreCompleto || user?.username || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Área principal */}
      <div
        className="flex flex-col flex-1 overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarW }}
      >
        {/* ── Header superior ─────────────────────────────── */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-5 bg-white border-b border-gray-200 z-20"
          style={{ height: 56 }}
        >
          {/* Izquierda: toggle + título */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              title={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
            >
              <MenuIcon open={sidebarOpen} />
            </button>
            <h1 className="text-base font-semibold text-gray-800 truncate">
              {pageTitle}
            </h1>
          </div>

          {/* Derecha: usuario + logout */}
          <div className="flex items-center gap-3">
            {/* Badge de rol */}
            {user?.rol?.nombre && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                {user.rol.nombre}
              </span>
            )}

            {/* Avatar + nombre */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {nombreCompleto || user?.username}
              </span>
            </div>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium"
              title="Cerrar sesión"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* ── Contenido scrolleable ────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
