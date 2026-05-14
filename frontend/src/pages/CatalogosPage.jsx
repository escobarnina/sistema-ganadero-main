import { useState } from 'react'
import MedicamentosList from '../components/catalogos/MedicamentosList'
import AlimentosList from '../components/catalogos/AlimentosList'
import RazasList from '../components/catalogos/RazasList'
import CategoriasList from '../components/catalogos/CategoriasList'
import VeterinariosList from '../components/catalogos/VeterinariosList'
import ReproductoresList from '../components/catalogos/ReproductoresList'

const tabs = [
  { id: 'medicamentos', name: '💊 Medicamentos', component: MedicamentosList },
  { id: 'alimentos', name: '🌾 Alimentos', component: AlimentosList },
  { id: 'razas', name: '🐄 Razas', component: RazasList },
  { id: 'categorias', name: '📋 Categorías', component: CategoriasList },
  { id: 'veterinarios', name: '👨‍⚕️ Veterinarios', component: VeterinariosList },
  { id: 'reproductores', name: '🧬 Reproductores', component: ReproductoresList },
]

export default function CatalogosPage() {
  const [activeTab, setActiveTab] = useState('medicamentos')

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Catálogos</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido activo */}
      {ActiveComponent && <ActiveComponent />}
    </div>
  )
}