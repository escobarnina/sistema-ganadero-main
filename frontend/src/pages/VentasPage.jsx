import { useState } from 'react'
import { useVentas } from '../hooks/useVentas'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import VentaForm from '../components/VentaForm'
import PageHeader from '../components/ui/PageHeader'
import PageAlert from '../components/ui/PageAlert'
import EmptyState from '../components/ui/EmptyState'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, Typography,
} from '@mui/material'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'

export default function VentasPage() {
  const { notasVenta, clientes, animalesDisponibles, loading, error, crearNotaVenta, crearDetalleVenta } = useVentas()
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState(null)

  const handleCreate = async (formData, detalles) => {
    const result = await crearNotaVenta(formData)
    if (result.success && detalles.length > 0) {
      const notaVentaId = result.id
      for (const d of detalles) {
        await crearDetalleVenta({ notaVentaId, animalId: d.animalId, pesoVentaKg: d.pesoVentaKg, precioKg: d.precioKg })
      }
      setMessage({ type: 'success', text: 'Venta registrada exitosamente' })
      setShowForm(false)
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al registrar venta' })
    }
    setTimeout(() => setMessage(null), 3500)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <PageHeader
        title="Ventas"
        icon={PointOfSaleOutlinedIcon}
        onAdd={() => setShowForm(true)}
        addLabel="Nueva Venta"
      />

      <PageAlert message={message} onClose={() => setMessage(null)} />

      {notasVenta.length === 0 ? (
        <EmptyState
          icon={PointOfSaleOutlinedIcon}
          title="No hay ventas registradas"
          description="Registrá la primera venta de animales."
          onAction={() => setShowForm(true)}
          actionLabel="Registrar primera venta"
        />
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Observaciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notasVenta.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>{new Date(v.fechaVenta).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {[v.cliente?.nombre, v.cliente?.apellidos].filter(Boolean).join(' ') || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{v.observaciones || '—'}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {showForm && (
        <VentaForm
          clientes={clientes}
          animales={animalesDisponibles}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </Box>
  )
}
