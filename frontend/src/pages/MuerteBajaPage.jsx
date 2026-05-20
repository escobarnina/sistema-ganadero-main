import { useState } from 'react'
import { useMuertesBajas } from '../hooks/useMuertesBajas'
import LoadingSpinner  from '../components/LoadingSpinner'
import ErrorMessage    from '../components/ErrorMessage'
import MuerteBajaForm  from '../components/MuerteBajaForm'
import PageHeader      from '../components/ui/PageHeader'
import PageAlert       from '../components/ui/PageAlert'
import ConfirmDialog   from '../components/ui/ConfirmDialog'
import EmptyState      from '../components/ui/EmptyState'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Chip, IconButton, Tooltip,
} from '@mui/material'
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined'
import EditOutlinedIcon         from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon       from '@mui/icons-material/DeleteOutlined'

const TIPO_CHIP = {
  MUERTE:   { label: 'Muerte',   sx: { bgcolor: '#FEE2E2', color: '#991B1B' } },
  ROBO:     { label: 'Robo',     sx: { bgcolor: '#FEF3C7', color: '#92400E' } },
  PERDIDA:  { label: 'Pérdida',  sx: { bgcolor: '#FEF3C7', color: '#92400E' } },
  DESCARTE: { label: 'Descarte', sx: { bgcolor: '#F1F5F9', color: '#475569' } },
  OTRO:     { label: 'Otro',     sx: { bgcolor: '#DBEAFE', color: '#1E40AF' } },
}

export default function MuerteBajaPage() {
  const { muertesBajas, animalesDisponibles, loading, error, crearMuerteBaja, actualizarMuerteBaja, eliminarMuerteBaja } = useMuertesBajas()
  const [showForm, setShowForm]   = useState(false)
  const [editando, setEditando]   = useState(null)
  const [message, setMessage]     = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const notify = (r) => {
    setMessage({ type: r.success ? 'success' : 'error', text: r.message || (r.success ? 'Operación exitosa' : 'Error') })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleCreate = async (data) => {
    const r = await crearMuerteBaja(data)
    notify(r)
    if (r.success) setShowForm(false)
  }

  const handleUpdate = async (data) => {
    const r = await actualizarMuerteBaja(editando.id, data)
    notify(r)
    if (r.success) setEditando(null)
  }

  const handleDelete = async () => {
    const r = await eliminarMuerteBaja(confirmId)
    notify(r)
    setConfirmId(null)
  }

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage message={error.message} />

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <PageHeader
        title="Muertes y Bajas"
        icon={RemoveCircleOutlinedIcon}
        onAdd={() => setShowForm(true)}
        addLabel="Registrar Baja"
      />

      <PageAlert message={message} onClose={() => setMessage(null)} />

      {muertesBajas.length === 0 ? (
        <EmptyState
          icon={RemoveCircleOutlinedIcon}
          title="No hay registros de bajas"
          description="Registrá aquí las muertes, robos, pérdidas o descartes de animales."
          onAction={() => setShowForm(true)}
          actionLabel="Registrar primera baja"
        />
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Animal</TableCell>
                  <TableCell>Arete</TableCell>
                  <TableCell>Raza</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Causa</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Peso Est.</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {muertesBajas.map((b) => {
                  const tipo = TIPO_CHIP[b.tipo] ?? { label: b.tipo, sx: {} }
                  return (
                    <TableRow key={b.id} hover>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{b.animal?.nombre || 'N/A'}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.disabled" sx={{ fontFamily: 'monospace' }}>#{b.animal?.nroArete || '—'}</Typography></TableCell>
                      <TableCell>{b.animal?.raza?.nombre || '—'}</TableCell>
                      <TableCell><Chip label={tipo.label} size="small" sx={{ ...tipo.sx, fontWeight: 500 }} /></TableCell>
                      <TableCell>{b.causa}</TableCell>
                      <TableCell>{new Date(b.fechaBaja).toLocaleDateString('es-PY')}</TableCell>
                      <TableCell>{b.pesoEstimadoKg ? `${b.pesoEstimadoKg} kg` : '—'}</TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{b.descripcion || '—'}</Typography></TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton size="small" color="warning" onClick={() => setEditando(b)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => setConfirmId(b.id)}>
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {showForm && (
        <MuerteBajaForm animales={animalesDisponibles} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}
      {editando && (
        <MuerteBajaForm animales={animalesDisponibles} initialData={editando} onSubmit={handleUpdate} onCancel={() => setEditando(null)} isEditing />
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar registro de baja?"
        message="Esta acción no se puede deshacer."
      />
    </Box>
  )
}
