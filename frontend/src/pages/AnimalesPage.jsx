// frontend/src/pages/AnimalesPage.jsx
import { useState } from 'react'
import { useAnimales } from '../hooks/useAnimales'
import { useParcelas } from '../hooks/useParcelas'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import AnimalForm from '../components/AnimalForm'
import ParcelaForm from '../components/ParcelaForm'
import MoverAnimalForm from '../components/MoverAnimalForm'
import ReportesButtons from '../components/ReportesButtons'
import { generarPDFAnimales, generarExcelAnimales } from '../services/reportesService'
import { useFincas } from '../hooks/useFincas'

export default function AnimalesPage() {
  const { animales, razas, categorias, loading, error, crearAnimal, actualizarAnimal, eliminarAnimal } = useAnimales()
  const { parcelas, crearParcela, actualizarParcela, eliminarParcela, moverAnimalAParcela, sacarAnimalDeParcela, loading: loadingParcelas } = useParcelas()
  const { fincaActual } = useFincas()
  
  const [activeTab, setActiveTab] = useState('animales')
  const [showForm, setShowForm] = useState(false)
  const [showParcelaForm, setShowParcelaForm] = useState(false)
  const [showMoverForm, setShowMoverForm] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [editingParcela, setEditingParcela] = useState(null)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [message, setMessage] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)
  const [reporteLoading, setReporteLoading] = useState(false)

  const tabs = [
    { id: 'animales', label: '🐄 Animales', count: animales.length },
    { id: 'parcelas', label: '📍 Parcelas', count: parcelas.length },
  ]

  // Funciones para Reportes
  const handlePDFAnimales = async () => {
    setReporteLoading(true)
    try {
      generarPDFAnimales(animales, fincaActual?.nombre || 'Mi Finca')
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el reporte PDF')
    }
    setReporteLoading(false)
  }

  const handleExcelAnimales = async () => {
    setReporteLoading(true)
    try {
      generarExcelAnimales(animales, fincaActual?.nombre || 'Mi Finca')
    } catch (error) {
      console.error('Error generando Excel:', error)
      alert('Error al generar el reporte Excel')
    }
    setReporteLoading(false)
  }

  // Funciones para Animales
  const handleCreateAnimal = async (data) => {
    const result = await crearAnimal(data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowForm(false)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEditAnimal = (animal) => {
    setEditingAnimal(animal)
    setShowForm(true)
  }

  const handleUpdateAnimal = async (data) => {
    const result = await actualizarAnimal(editingAnimal.id, data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowForm(false)
      setEditingAnimal(null)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteAnimal = async (id) => {
    const result = await eliminarAnimal(id)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    setShowConfirm(null)
    setTimeout(() => setMessage(null), 3000)
  }

  // Funciones para Parcelas
  const handleCreateParcela = async (data) => {
    const result = await crearParcela(data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowParcelaForm(false)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEditParcela = (parcela) => {
    setEditingParcela(parcela)
    setShowParcelaForm(true)
  }

  const handleUpdateParcela = async (data) => {
    const result = await actualizarParcela(editingParcela.id, data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowParcelaForm(false)
      setEditingParcela(null)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteParcela = async (id, nombre) => {
    if (window.confirm(`¿Eliminar la parcela "${nombre}"?`)) {
      const result = await eliminarParcela(id)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleMoverAnimal = async (data) => {
    const result = await moverAnimalAParcela(data)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setShowMoverForm(false)
      setSelectedAnimal(null)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSacarAnimal = async (movimientoId, fechaSalida) => {
    if (window.confirm('¿Retirar este animal de la parcela?')) {
      const result = await sacarAnimalDeParcela(movimientoId, fechaSalida)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading || loadingParcelas) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🐄 Gestión Ganadera</h1>
        <div className="flex gap-2">
          {activeTab === 'animales' && (
            <ReportesButtons 
              onPDF={handlePDFAnimales}
              onExcel={handleExcelAnimales}
              loading={reporteLoading}
            />
          )}
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* ========================================== */}
      {/* TAB ANIMALES */}
      {/* ========================================== */}
      {activeTab === 'animales' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingAnimal(null)
                setShowForm(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              + Nuevo Animal
            </button>
          </div>

          {animales.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay animales registrados</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-green-600 hover:text-green-700"
              >
                + Crear el primer animal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animales.map((animal) => (
                <div key={animal.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Arete: {animal.nroArete}</p>
                      <h3 className="text-lg font-bold text-gray-800">{animal.nombre || 'Sin nombre'}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      animal.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {animal.estado}
                    </span>
                  </div>
                  
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="text-gray-500">Raza:</span> {animal.raza?.nombre || 'N/A'}</p>
                    <p><span className="text-gray-500">Categoría:</span> {animal.categoria?.nombre || 'N/A'}</p>
                    <p><span className="text-gray-500">Peso:</span> {animal.peso ? `${animal.peso} kg` : 'N/A'}</p>
                    <p><span className="text-gray-500">Sexo:</span> {animal.sexo === 'MACHO' ? 'Macho' : 'Hembra'}</p>
                    <p><span className="text-gray-500">Nacimiento:</span> {animal.fechaNacimiento ? new Date(animal.fechaNacimiento).toLocaleDateString() : 'N/A'}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAnimal(animal)
                        setShowMoverForm(true)
                      }}
                      className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition text-sm"
                    >
                      📍 Mover a Parcela
                    </button>
                    <button
                      onClick={() => handleEditAnimal(animal)}
                      className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setShowConfirm(animal.id)}
                      className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>

                  {showConfirm === animal.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-4">¿Eliminar animal?</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro de eliminar a "{animal.nombre || animal.nroArete}"?</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDeleteAnimal(animal.id)}
                            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================== */}
      {/* TAB PARCELAS */}
      {/* ========================================== */}
      {activeTab === 'parcelas' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingParcela(null)
                setShowParcelaForm(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              + Nueva Parcela
            </button>
          </div>

          {parcelas.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay parcelas registradas</p>
              <button
                onClick={() => setShowParcelaForm(true)}
                className="mt-4 text-green-600 hover:text-green-700"
              >
                + Crear la primera parcela
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {parcelas.map((parcela) => (
                <div key={parcela.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gradient-to-r from-green-600 to-green-800 px-4 py-3 text-white">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{parcela.nombre}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        parcela.estado === 'ACTIVA' ? 'bg-green-200 text-green-800' : 
                        parcela.estado === 'EN_DESCANSO' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {parcela.estado === 'ACTIVA' ? '✅ Activa' : 
                         parcela.estado === 'EN_DESCANSO' ? '😴 En Descanso' : '🔧 Mantenimiento'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">🌾 Tamaño</p>
                        <p className="font-medium">{parcela.tamano} ha</p>
                      </div>
                      <div>
                        <p className="text-gray-500">🐄 Capacidad</p>
                        <p className="font-medium">{parcela.capacidadMaxima} animales</p>
                      </div>
                      <div>
                        <p className="text-gray-500">🌿 Pastura</p>
                        <p className="font-medium">{parcela.tipoPastura || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">📊 Ocupación</p>
                        <p className="font-medium">{parcela.animalesActuales?.length || 0} / {parcela.capacidadMaxima}</p>
                      </div>
                    </div>

                    {parcela.animalesActuales && parcela.animalesActuales.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">🐄 Animales actuales:</p>
                        <div className="space-y-2">
                          {parcela.animalesActuales.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">{item.animal?.nroArete}</span>
                                <span className="text-xs text-gray-500 ml-2">({item.animal?.sexo === 'MACHO' ? '♂' : '♀'})</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-xs text-gray-500">Desde: {new Date(item.fechaIngreso).toLocaleDateString()}</span>
                                <button
                                  onClick={() => handleSacarAnimal(item.id, new Date().toISOString().split('T')[0])}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Retirar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEditParcela(parcela)}
                        className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 transition text-sm"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteParcela(parcela.id, parcela.nombre)}
                        className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition text-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================== */}
      {/* MODALES */}
      {/* ========================================== */}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-2xl w-full">
            <AnimalForm
              animal={editingAnimal}
              razas={razas}
              categorias={categorias}
              onSubmit={editingAnimal ? handleUpdateAnimal : handleCreateAnimal}
              onCancel={() => {
                setShowForm(false)
                setEditingAnimal(null)
              }}
            />
          </div>
        </div>
      )}

      {showParcelaForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <ParcelaForm
              parcelaParaEditar={editingParcela}
              onSubmit={editingParcela ? handleUpdateParcela : handleCreateParcela}
              onCancel={() => {
                setShowParcelaForm(false)
                setEditingParcela(null)
              }}
            />
          </div>
        </div>
      )}

      {showMoverForm && selectedAnimal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <MoverAnimalForm
              animal={selectedAnimal}
              parcelas={parcelas}
              onSubmit={handleMoverAnimal}
              onCancel={() => {
                setShowMoverForm(false)
                setSelectedAnimal(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}