// frontend/src/components/ChartCard.jsx
import React from 'react'

const ChartCard = ({ title, children, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <div className="h-64">
        {children}
      </div>
    </div>
  )
}

export default ChartCard