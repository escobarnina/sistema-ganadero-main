// frontend/src/App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { client } from './apollo/client'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import AnimalesPage from './pages/AnimalesPage'
import VacunacionesPage from './pages/VacunacionesPage'
import ClientesPage from './pages/ClientesPage'
import ProveedoresPage from './pages/ProveedoresPage'
import ComprasPage from './pages/ComprasPage'
import CatalogosPage from './pages/CatalogosPage'
import VentasPage from './pages/VentasPage'
import MuerteBajaPage from './pages/MuerteBajaPage'
import ReproduccionPage from './pages/ReproduccionPage'
import ProduccionPage from './pages/ProduccionPage'
import SanidadPage from './pages/SanidadPage'
import VacunasPage from './pages/VacunasPage'
import AlertasPage from './pages/AlertasPage'
import RrhhPage from './pages/RrhhPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import LoadingSpinner from './components/LoadingSpinner'
import UsuariosPage from './pages/UsuariosPage'
import RolesPage from './pages/RolesPage'
import FincaPage from './pages/FincaPage'

// Componente principal que usa el contexto
function AppContent() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-20 transition-all duration-300">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/catalogos" element={<CatalogosPage />} />
          <Route path="/vacunas" element={<VacunasPage />} />
          <Route path="/animales" element={<AnimalesPage />} />
          <Route path="/vacunaciones" element={<VacunacionesPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/compras" element={<ComprasPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/bajas" element={<MuerteBajaPage />} />
          <Route path="/reproduccion" element={<ReproduccionPage />} />
          <Route path="/produccion" element={<ProduccionPage />} />
          <Route path="/sanidad" element={<SanidadPage />} />
          <Route path="/alertas" element={<AlertasPage />} />
          <Route path="/rrhh" element={<RrhhPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/fincas" element={<FincaPage />} />



          
        </Routes>
      </main>
    </div>
  )
}

// App principal con los providers
function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App