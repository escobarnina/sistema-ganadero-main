import { useState } from 'react'
import { useVacunas } from '../hooks/useVacunas'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import VacunaForm from '../components/VacunaForm'
import PageHeader from '../components/ui/PageHeader'
import PageAlert from '../components/ui/PageAlert'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import StatusChip from '../components/ui/StatusChip'
import EmptyState from '../components/ui/EmptyState'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Typography, IconButton, Tooltip,
} from '@mui/material'
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

export default function VacunasPage() {
  const { vacunas, loading, error, crearVacuna, actualizarVacuna, eliminarVacuna } = useVacunas()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const notify = (result) => {
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleCreate = async (data) => {
    const r = await crearVacuna(data)
    notify(r)
    if (r.success) closeForm()
  }

  const handleUpdate = async (data) => {
    const r = await actualizarVacuna(editing.id, data)
    notify(r)
    if (r.success) closeForm()
  }

  const handleDelete = async () => {
    const r = await eliminarVacuna(confirmId)
    notify(r)
    setConfirmId(null)
  }

  const openAdd = () => { setEditing(null); setShowForm(true) }
  const openEdit = (v) => { setEditing(v); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <PageHeader
        title="Vacunas"
        icon={MedicalServicesOutlinedIcon}
        onAdd={openAdd}
        addLabel="Nueva Vacuna"
      />

      <PageAlert message={message} onClose={() => setMessage(null)} />

      {vacunas.length === 0 ? (
        <EmptyState
          icon={MedicalServicesOutlinedIcon}
          title="No hay vacunas registradas"
          description="Registrá la primera vacuna para empezar el programa sanitario."
          onAction={openAdd}
          actionLabel="Crear primera vacuna"
        />
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Dosis</TableCell>
                  <TableCell>Vía</TableCell>
                  <TableCell>Intervalo</TableCell>
                  <TableCell>Edad Mín.</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vacunas.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{v.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{v.descripcion || '—'}</Typography>
                    </TableCell>
                    <TableCell>{v.dosisRecomendada}</TableCell>
                    <TableCell>{v.viaAplicacion}</TableCell>
                    <TableCell>{v.intervaloDias} días</TableCell>
                    <TableCell>{v.edadMinimaMeses} meses</TableCell>
                    <TableCell><StatusChip value={v.activo} /></TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" color="warning" onClick={() => openEdit(v)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => setConfirmId(v.id)}>
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
        <VacunaForm
          vacuna={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={closeForm}
        />
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar vacuna?"
        message="Esta acción no se puede deshacer."
      />
    </Box>
  )
}
