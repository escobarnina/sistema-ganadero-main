import { useState } from 'react'
import { useSanidad } from '../hooks/useSanidad'
import LoadingSpinner      from '../components/LoadingSpinner'
import TratamientoForm     from '../components/TratamientoForm'
import DesparasitacionForm from '../components/DesparasitacionForm'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Tabs, Tab, Chip, Card, CardContent, Grid,
} from '@mui/material'
import HealthAndSafetyOutlinedIcon  from '@mui/icons-material/HealthAndSafetyOutlined'
import MedicalServicesOutlinedIcon  from '@mui/icons-material/MedicalServicesOutlined'
import BugReportOutlinedIcon        from '@mui/icons-material/BugReportOutlined'
import AssignmentOutlinedIcon       from '@mui/icons-material/AssignmentOutlined'
import NoteOutlinedIcon             from '@mui/icons-material/NoteOutlined'
import AddCircleOutlinedIcon        from '@mui/icons-material/AddCircleOutlined'

const KPI = ({ label, value, sub, accent }) => (
  <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${accent}`, borderRadius: 2 }}>
    <CardContent sx={{ p: '16px !important' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ color: accent, lineHeight: 1.2 }}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </CardContent>
  </Card>
)

export default function SanidadPage() {
  const { tratamientos, tratamientosActivos, desparasitaciones, diagnosticos, observaciones, loading } = useSanidad()
  const [tabIdx, setTabIdx] = useState(0)

  const TABS = [
    { label: 'Dashboard',       Icon: HealthAndSafetyOutlinedIcon },
    { label: 'Tratamientos',    Icon: MedicalServicesOutlinedIcon,  count: tratamientos.length },
    { label: 'Desparasitaciones', Icon: BugReportOutlinedIcon,       count: desparasitaciones.length },
    { label: 'Diagnósticos',    Icon: AssignmentOutlinedIcon,        count: diagnosticos.length },
    { label: 'Observaciones',   Icon: NoteOutlinedIcon,              count: observaciones.length },
    { label: '+ Tratamiento',   Icon: AddCircleOutlinedIcon },
    { label: '+ Desparasitación', Icon: AddCircleOutlinedIcon },
  ]

  if (loading) return <LoadingSpinner />

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header */}
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">Módulo de Sanidad</Typography>
        <Typography variant="body2" color="text.secondary">Tratamientos, desparasitaciones, diagnósticos y observaciones</Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <KPI label="Tratamientos activos" value={tratamientosActivos.length} accent="#E65100" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KPI label="Desparasitaciones" value={desparasitaciones.length} accent="#2E7D32" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KPI label="Diagnósticos" value={diagnosticos.length} accent="#6A1B9A" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KPI label="Observaciones" value={observaciones.length} accent="#00695C" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KPI label="Tratamientos totales" value={tratamientos.length} accent="#1565C0" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} variant="scrollable" scrollButtons="auto">
          {TABS.map(({ label, Icon, count }) => (
            <Tab
              key={label}
              icon={<Icon sx={{ fontSize: 17 }} />}
              iconPosition="start"
              label={count !== undefined ? `${label} (${count})` : label}
              sx={{ minHeight: 48, textTransform: 'none', fontWeight: 500, fontSize: 13 }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Dashboard */}
      {tabIdx === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#E65100', color: '#fff', px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>Tratamientos Activos</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {tratamientosActivos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>No hay tratamientos activos</Typography>
                ) : (
                  tratamientosActivos.map(t => (
                    <Box key={t.id} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{t.animal?.nroArete}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.diagnostico?.substring(0, 50)}…</Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="caption" color="text.secondary">{new Date(t.fecha).toLocaleDateString('es-PY')}</Typography>
                        <Chip size="small" label="Activo" sx={{ display: 'block', mt: 0.5, bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 500 }} />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#6A1B9A', color: '#fff', px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>Últimos Diagnósticos</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {diagnosticos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>No hay diagnósticos</Typography>
                ) : (
                  diagnosticos.slice(0, 5).map(d => (
                    <Box key={d.id} sx={{ borderBottom: '1px solid #F1F5F9', pb: 1, mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight={600}>{d.animal?.nroArete}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(d.fecha).toLocaleDateString('es-PY')}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{d.descripcion?.substring(0, 80)}…</Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tratamientos */}
      {tabIdx === 1 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Animal</TableCell>
                  <TableCell>Diagnóstico</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tratamientos.map(t => (
                  <TableRow key={t.id} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{t.animal?.nroArete}</Typography></TableCell>
                    <TableCell>{t.diagnostico?.substring(0, 50)}</TableCell>
                    <TableCell>{new Date(t.fecha).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell>
                      <Chip size="small" label={t.enTratamiento ? 'Activo' : 'Completado'}
                        sx={t.enTratamiento
                          ? { bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 500 }
                          : { bgcolor: '#DCFCE7', color: '#166534', fontWeight: 500 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Desparasitaciones */}
      {tabIdx === 2 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Animal</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Próxima</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {desparasitaciones.map(d => (
                  <TableRow key={d.id} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{d.animal?.nroArete}</Typography></TableCell>
                    <TableCell>{d.producto}</TableCell>
                    <TableCell>{new Date(d.fecha).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell>{d.fechaProxima ? new Date(d.fechaProxima).toLocaleDateString('es-PY') : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Diagnósticos */}
      {tabIdx === 3 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Animal</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Veterinario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diagnosticos.map(d => (
                  <TableRow key={d.id} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{d.animal?.nroArete}</Typography></TableCell>
                    <TableCell>{d.descripcion?.substring(0, 60)}</TableCell>
                    <TableCell>{new Date(d.fecha).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell>{[d.veterinario?.nombre, d.veterinario?.apellidos].filter(Boolean).join(' ') || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Observaciones */}
      {tabIdx === 4 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Animal</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {observaciones.map(o => (
                  <TableRow key={o.id} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{o.animal?.nroArete}</Typography></TableCell>
                    <TableCell>{o.descripcion?.substring(0, 80)}</TableCell>
                    <TableCell>{new Date(o.fecha).toLocaleDateString('es-PY')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {tabIdx === 5 && <TratamientoForm     onSuccess={() => setTabIdx(1)} />}
      {tabIdx === 6 && <DesparasitacionForm onSuccess={() => setTabIdx(2)} />}
    </Box>
  )
}
