import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* El contenido se ajusta automáticamente */}
      <main className="flex-1 bg-gray-100 min-h-screen overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}