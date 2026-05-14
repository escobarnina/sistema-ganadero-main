// frontend/src/components/PieChart.jsx
import React from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ labels, data, colors }) => {
  const defaultColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec489a']
  
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors || defaultColors,
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

export default PieChart