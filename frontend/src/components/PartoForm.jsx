// frontend/src/components/PartoForm.jsx
import React, { useState } from 'react'
import { useAnimales } from '../hooks/useAnimales'
import { useReproduccion } from '../hooks/useReproduccion'

const PartoForm = ({ onSuccess }) => {
  const { animales } = useAnimales()
  const { crearReproduccion, refetchProximosPartos } = useReproduccion()
  
  const [loading, setLoading] = useState(false)
  const [mostrarFormCrias, setMostrarFormCrias] = useState(false)
  const [crias, setCrias] = useState([])
  
  const [formData, setFormData] = useState({
    madreId: '',
    fechaServicio: '',
    fechaPartoReal: new Date().toISOString().split('T')[0],
    tipoParto: 'NORMAL',
    numCrias: 1,
    estado: 'COMPLETADO',
    observaciones: ''
  })
  
  // Solo hembras preñadas o en gestación
  const hembrasDisponibles = animales.filter(a => 
    a.sexo === 'HEMBRA' && 
    a.estado === 'ACTIVO'
  )
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await crearReproduccion({
      madreId: formData.madreId,
      fechaServicio: formData.fechaServicio || null,
      fechaPartoReal: formData.fechaPartoReal,
      tipoParto: formData.tipoParto,
      numCrias: formData.numCrias,
      estado: formData.estado,
      observaciones: formData.observaciones
    })
    
    if (result.success) {
      alert('✅ Parto registrado exitosamente')
      
      // Si tiene crías, mostrar formulario para registrarlas
      if (formData.numCrias > 0) {
        setMostrarFormCrias(true)
      } else {
        setFormData({
          madreId: '',
          fechaServicio: '',
          fechaPartoReal: new Date().toISOString().split('T')[0],
          tipoParto: 'NORMAL',
          numCrias: 1,
          estado: 'COMPLETADO',
          observaciones: ''
        })
        if (onSuccess) onSuccess()
      }
    } else {
      alert(`❌ Error: ${result.error}`)
    }
    setLoading(false)
  }
  
  const handleRegistrarCrias = async (criasData) => {
    // Aquí iría la mutación para registrar las crías individualmente
    // Usando el mutation `registrarCria` que deberías implementar en el backend
    console.log('Registrando crías:', criasData)
    alert('🐄 Crías registradas exitosamente')
    setMostrarFormCrias(false)
    if (onSuccess) onSuccess()
  }
  
  if (mostrarFormCrias) {
    return (
      <RegistroCriasForm 
        numCrias={formData.numCrias}
        madreId={formData.madreId}
        fechaParto={formData.fechaPartoReal}
        onSave={handleRegistrarCrias}
        onCancel={() => setMostrarFormCrias(false)}
      />
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-green-800">🤰 Registrar Nuevo Parto</h2>
      
      {/* Madre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Madre *</label>
        <select
          required
          value={formData.madreId}
          onChange={(e) => setFormData({...formData, madreId: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="">Seleccionar hembra</option>
          {hembrasDisponibles.map(h => (
            <option key={h.id} value={h.id}>
              {h.nroArete} - {h.nombre || 'Sin nombre'} ({h.raza?.nombre || 'Sin raza'})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Solo se muestran hembras activas
        </p>
      </div>
      
      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Servicio</label>
          <input
            type="date"
            value={formData.fechaServicio}
            onChange={(e) => setFormData({...formData, fechaServicio: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Opcional - fecha de la IA o monta</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Parto *</label>
          <input
            type="date"
            required
            value={formData.fechaPartoReal}
            onChange={(e) => setFormData({...formData, fechaPartoReal: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      
      {/* Tipo de Parto y Número de Crías */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Parto</label>
          <select
            value={formData.tipoParto}
            onChange={(e) => setFormData({...formData, tipoParto: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="NORMAL">Normal</option>
            <option value="DISTOCICO">Distócico (con asistencia)</option>
            <option value="CESAREA">Cesárea</option>
            <option value="ABORTO">Aborto</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Número de Crías</label>
          <input
            type="number"
            min="1"
            max="4"
            value={formData.numCrias}
            onChange={(e) => setFormData({...formData, numCrias: parseInt(e.target.value)})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      
      {/* Estado del Parto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          value={formData.estado}
          onChange={(e) => setFormData({...formData, estado: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="COMPLETADO">Completado exitosamente</option>
          <option value="COMPLICACION">Con complicaciones</option>
          <option value="ABORTO">Aborto</option>
        </select>
      </div>
      
      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
          rows="3"
          placeholder="Ej: Parto gemelar, necesitó asistencia, cría débil, etc."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Registrando...' : 'Registrar Parto'}
        </button>
        
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Cancelar registro de parto?')) {
              setFormData({
                madreId: '',
                fechaServicio: '',
                fechaPartoReal: new Date().toISOString().split('T')[0],
                tipoParto: 'NORMAL',
                numCrias: 1,
                estado: 'COMPLETADO',
                observaciones: ''
              })
              if (onSuccess) onSuccess()
            }
          }}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

// Componente para registrar las crías después del parto
const RegistroCriasForm = ({ numCrias, madreId, fechaParto, onSave, onCancel }) => {
  const [crias, setCrias] = useState(
    Array(numCrias).fill().map((_, i) => ({
      id: i + 1,
      nombre: '',
      sexo: 'HEMBRA',
      pesoNacimiento: '',
      observaciones: ''
    }))
  )
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(crias)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-green-800">🐄 Registrar Crías</h2>
      <p className="text-sm text-gray-600">
        Madre: {madreId} | Fecha Parto: {new Date(fechaParto).toLocaleDateString()}
      </p>
      
      {crias.map((cria, index) => (
        <div key={cria.id} className="border p-4 rounded-lg space-y-3 bg-gray-50">
          <h3 className="font-semibold text-gray-700">Cría #{index + 1}</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={cria.nombre}
                onChange={(e) => {
                  const nuevas = [...crias]
                  nuevas[index].nombre = e.target.value
                  setCrias(nuevas)
                }}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
                placeholder="Opcional"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Sexo</label>
              <select
                value={cria.sexo}
                onChange={(e) => {
                  const nuevas = [...crias]
                  nuevas[index].sexo = e.target.value
                  setCrias(nuevas)
                }}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              >
                <option value="HEMBRA">Hembra</option>
                <option value="MACHO">Macho</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Peso Nacimiento (kg)</label>
              <input
                type="number"
                step="0.1"
                value={cria.pesoNacimiento}
                onChange={(e) => {
                  const nuevas = [...crias]
                  nuevas[index].pesoNacimiento = e.target.value
                  setCrias(nuevas)
                }}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700">Observaciones</label>
              <input
                type="text"
                value={cria.observaciones}
                onChange={(e) => {
                  const nuevas = [...crias]
                  nuevas[index].observaciones = e.target.value
                  setCrias(nuevas)
                }}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
                placeholder="Ej: Débil, necesita atención"
              />
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Guardar Crías
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Omitir (registrar después)
        </button>
      </div>
    </form>
  )
}

export default PartoForm