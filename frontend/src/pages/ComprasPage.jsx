import { useState } from 'react'
import { useCompras } from '../hooks/useCompras'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage   from '../components/ErrorMessage'
import CompraForm     from '../components/CompraForm'
import PageHeader     from '../components/ui/PageHeader'
import PageAlert      from '../components/ui/PageAlert'
import ConfirmDialog  from '../components/ui/ConfirmDialog'
import EmptyState     from '../components/ui/EmptyState'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Chip, IconButton, Tooltip,
} from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import DeleteOutlinedIcon       from '@mui/icons-material/DeleteOutlined'
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined'
import GrassOutlinedIcon           from '@mui/icons-material/GrassOutlined'

export default function ComprasPage() {
  const {
    notasCompra, proveedores, medicamentos, alimentos,
    loading, error,
    crearNotaCompra, crearDetalleCompra, crearDetalleCompraAlimento, eliminarNotaCompra,
  } = useCompras()
  const [showForm, setShowForm]   = useState(false)
  const [message, setMessage]     = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const notify = (r) => {
    setMessage({ type: r.success ? 'success' : 'error', text: r.message || (r.success ? 'Operación exitosa' : 'Error') })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleCreate = async (formData, detalles) => {
    const result = await crearNotaCompra(formData)
    if (result.success && detalles.length > 0) {
      const notaCompraId = result.id
      for (const d of detalles) {
        if (formData.tipoCompra === 'MEDICAMENTO') {
          await crearDetalleCompra({ notaCompraId, medicamentoId: d.productoId, precioUnitario: d.precioUnitario, cantidad: d.cantidad })
        } else {
          await crearDetalleCompraAlimento({ notaCompraId, alimentoId: d.productoId, precioUnitario: d.precioUnitario, cantidad: d.cantidad })
        }
      }
      notify({ success: true, message: 'Compra registrada exitosamente' })
      setShowForm(false)
    } else {
      notify({ success: false, message: result.message || 'Error al registrar compra' })
    }
  }

  const handleDelete = async () => {
    const r = await eliminarNotaCompra(confirmId)
    notify(r)
    setConfirmId(null)
  }

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage message={error.message} />

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <PageHeader
        title="Compras de Insumos"
        icon={ShoppingCartOutlinedIcon}
        onAdd={() => setShowForm(true)}
        addLabel="Nueva Compra"
      />

      <PageAlert message={message} onClose={() => setMessage(null)} />

      {notasCompra.length === 0 ? (
        <EmptyState
          icon={ShoppingCartOutlinedIcon}
          title="No hay compras registradas"
          description="Registrá la primera compra de insumos."
          onAction={() => setShowForm(true)}
          actionLabel="Registrar primera compra"
        />
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Observaciones</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notasCompra.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{new Date(c.fechaCompra).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {[c.proveedor?.nombre, c.proveedor?.apellidos].filter(Boolean).join(' ') || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={c.tipoCompra === 'MEDICAMENTO' ? <MedicalServicesOutlinedIcon sx={{ fontSize: '14px !important' }} /> : <GrassOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                        label={c.tipoCompra === 'MEDICAMENTO' ? 'Medicamentos' : 'Alimentos'}
                        size="small"
                        sx={{ bgcolor: c.tipoCompra === 'MEDICAMENTO' ? '#EDE9FE' : '#DCFCE7', color: c.tipoCompra === 'MEDICAMENTO' ? '#6D28D9' : '#166534', fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{c.observaciones || '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => setConfirmId(c.id)}>
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {showForm && (
        <CompraForm
          proveedores={proveedores}
          medicamentos={medicamentos}
          alimentos={alimentos}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar compra?"
        message="Esta acción no se puede deshacer."
      />
    </Box>
  )
}
