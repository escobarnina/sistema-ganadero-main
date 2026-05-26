import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ANIMAL_DETALLE } from '../graphql/animales'
import {
  Dialog, DialogContent, DialogTitle,
  IconButton, Tabs, Tab, Box,
  Typography, CircularProgress, Grid,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import StatusChip from './ui/StatusChip'
import AnimalGenealogySection from './AnimalGenealogySection'

const SEXO = { MACHO: 'Macho', HEMBRA: 'Hembra' }
const ORIGEN = { NACIDO_FINCA: 'Nacido en finca', COMPRADO: 'Comprado', DONADO: 'Donado' }
const TIPO_PROD = { CARNE: 'Carne', LECHE: 'Leche', DOBLE_PROPOSITO: 'Doble propósito' }

const TABS = ['General', 'Genealogía', 'Producción', 'Reproducción', 'Sanidad', 'Movimientos', 'Ventas/Bajas']

function TabPanel({ value, index, children }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ mb: 0.75 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

function TabStub({ mensaje }) {
  return (
    <Box sx={{ textAlign: 'center', py: 5 }}>
      <Typography variant="body2" color="text.disabled" fontStyle="italic">
        {mensaje}
      </Typography>
    </Box>
  )
}

export default function AnimalDetailModal({ animalId, onClose }) {
  const [tabIdx, setTabIdx] = useState(0)

  useEffect(() => { setTabIdx(0) }, [animalId])

  const { data, loading, error } = useQuery(GET_ANIMAL_DETALLE, {
    variables: { id: animalId },
    skip: !animalId,
    fetchPolicy: 'cache-and-network',
  })

  const animal = data?.animalDetalle

  return (
    <Dialog
      open={!!animalId}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
    >
      {/* Título */}
      <DialogTitle sx={{ pb: 0, pr: 6 }}>
        {loading && !animal ? (
          <Typography variant="h6" color="text.secondary">Cargando...</Typography>
        ) : animal ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                #{animal.nroArete}
              </Typography>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                {animal.nombre || 'Sin nombre'}
              </Typography>
            </Box>
            <StatusChip value={animal.estado} />
          </Box>
        ) : null}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs
          value={tabIdx}
          onChange={(_, v) => setTabIdx(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {TABS.map(tab => (
            <Tab
              key={tab}
              label={tab}
              sx={{ textTransform: 'none', fontSize: 13, minHeight: 44, minWidth: 80 }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Contenido */}
      <DialogContent sx={{ pt: 1 }}>
        {loading && !animal ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={36} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            Error al cargar el detalle del animal.
          </Typography>
        ) : !animal ? null : (
          <>
            {/* Tab 0 — General */}
            <TabPanel value={tabIdx} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoRow label="Arete" value={animal.nroArete} />
                  <InfoRow label="Nombre" value={animal.nombre} />
                  <InfoRow label="Sexo" value={SEXO[animal.sexo] ?? animal.sexo} />
                  <InfoRow label="Raza" value={animal.raza?.nombre} />
                  <InfoRow label="Categoría" value={animal.categoria?.nombre} />
                  <InfoRow label="Estado" value={animal.estado} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoRow label="Peso actual" value={animal.peso ? `${animal.peso} kg` : null} />
                  <InfoRow label="Peso al nacimiento" value={animal.pesoNacimiento ? `${animal.pesoNacimiento} kg` : null} />
                  <InfoRow label="Tipo de producción" value={TIPO_PROD[animal.tipoProduccion] ?? animal.tipoProduccion} />
                  <InfoRow label="Origen" value={ORIGEN[animal.origen] ?? animal.origen} />
                  <InfoRow
                    label="Fecha de nacimiento"
                    value={animal.fechaNacimiento
                      ? new Date(animal.fechaNacimiento).toLocaleDateString('es-PY')
                      : null}
                  />
                  <InfoRow
                    label="Fecha de ingreso"
                    value={animal.fechaIngreso
                      ? new Date(animal.fechaIngreso).toLocaleDateString('es-PY')
                      : null}
                  />
                </Grid>
              </Grid>
              {animal.observaciones && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" gutterBottom>
                    Observaciones
                  </Typography>
                  <Typography variant="body2">{animal.observaciones}</Typography>
                </Box>
              )}
            </TabPanel>

            {/* Tab 1 — Genealogía */}
            <TabPanel value={tabIdx} index={1}>
              <AnimalGenealogySection animal={animal} />
            </TabPanel>

            {/* Tabs stub */}
            <TabPanel value={tabIdx} index={2}>
              <TabStub mensaje="Sección Producción no implementada en esta vista." />
            </TabPanel>
            <TabPanel value={tabIdx} index={3}>
              <TabStub mensaje="Sección Reproducción no implementada en esta vista." />
            </TabPanel>
            <TabPanel value={tabIdx} index={4}>
              <TabStub mensaje="Sección Sanidad no implementada en esta vista." />
            </TabPanel>
            <TabPanel value={tabIdx} index={5}>
              <TabStub mensaje="Sección Movimientos no implementada en esta vista." />
            </TabPanel>
            <TabPanel value={tabIdx} index={6}>
              <TabStub mensaje="Historial de ventas/bajas no implementado en esta vista." />
            </TabPanel>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
