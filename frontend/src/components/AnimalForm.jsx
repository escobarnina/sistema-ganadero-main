import { useState, useEffect } from 'react'

export default function AnimalForm({ animal, razas, categorias, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    fincaId: 1,                    // ← AGREGAR fincaId (obligatorio)
    arete: '',                     // ← Cambiado de nroArete a arete
    nombre: '',
    fechaNacimiento: '',
    sexo: 'MACHO',
    razaId: '',                    // ← Cambiado de idRaza a razaId
    categoriaId: '',               // ← Cambiado de idCategoria a categoriaId
    peso: '',
  })

  useEffect(() => {
    if (animal) {
      setFormData({
        fincaId: 1,
        arete: animal.arete || '',           // ← Cambiado
        nombre: animal.nombre || '',
        fechaNacimiento: animal.fechaNacimiento || '',
        sexo: animal.sexo || 'MACHO',
        razaId: animal.raza?.id || '',       // ← Cambiado
        categoriaId: animal.categoria?.id || '', // ← Cambiado
        peso: animal.peso || '',
      })
    }
  }, [animal])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const submitData = {
      fincaId: parseInt(formData.fincaId),
      arete: formData.arete,
      nombre: formData.nombre,
      fechaNacimiento: formData.fechaNacimiento,
      sexo: formData.sexo,
      razaId: formData.razaId ? parseInt(formData.razaId) : null,
      categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : null,
      peso: formData.peso ? parseFloat(formData.peso) : null,
    }
    
    onSubmit(submitData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {animal ? '✏️ Editar Animal' : '➕ Nuevo Animal'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arete *</label>
                <input
                  type="text"
                  name="arete"
                  value={formData.arete}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: TEST-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Torito"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento *</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                <select
                  name="razaId"
                  value={formData.razaId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar...</option>
                  {razas.map(raza => (
                    <option key={raza.id} value={raza.id}>{raza.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 350.5"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                {animal ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}