import { useState } from 'react'
import { useProduccion } from '../hooks/useProduccion'
import LoadingSpinner      from '../components/LoadingSpinner'
import LactanciaForm       from '../components/LactanciaForm'
import ProduccionLecheForm from '../components/ProduccionLecheForm'
import RegistroPesoForm    from '../components/RegistroPesoForm'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Tabs, Tab, Chip, Card, CardContent, Grid,
} from '@mui/material'
import LocalDrinkOutlinedIcon    from '@mui/icons-material/LocalDrinkOutlined'
import PetsOutlinedIcon          from '@mui/icons-material/PetsOutlined'
import BarChartOutlinedIcon      from '@mui/icons-material/BarChartOutlined'
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined'
import AddCircleOutlinedIcon     from '@mui/icons-material/AddCircleOutlined'
import EmojiEventsOutlinedIcon   from '@mui/icons-material/EmojiEventsOutlined'

const KPI = ({ label, value, sub, accent }) => (
  <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${accent}`, borderRadius: 2 }}>
    <CardContent sx={{ p: '16px !important' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ color: accent, lineHeight: 1.2 }}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </CardContent>
  </Card>
)

const TABS = [
  { label: 'Dashboard',            Icon: BarChartOutlinedIcon },
  { label: 'Lactancias',           Icon: PetsOutlinedIcon },
  { label: 'Registrar Producción', Icon: LocalDrinkOutlinedIcon },
  { label: 'Registro Peso',        Icon: FitnessCenterOutlinedIcon },
  { label: '+ Nueva Lactancia',    Icon: AddCircleOutlinedIcon },
]

export default function ProduccionPage() {
  const { lactancias, produccionesHoy, produccionTotalHoy, top5Vacas, loading } = useProduccion()
  const [tabIdx, setTabIdx] = useState(0)

  if (loading) return <LoadingSpinner />

  const lactanciasActivas = lactancias.filter(l => l.estado === 'ACTIVA')
  const promedio = lactancias.length > 0
    ? (lactancias.reduce((s, l) => s + (l.promedioDiario || 0), 0) / lactancias.length).toFixed(1)
    : '0'

  const tabsWithCount = TABS.map((t, i) => ({ ...t, count: i === 1 ? lactancias.length : undefined }))

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Módulo de Producción Lechera</Typography>
        <Typography variant="body2" color="text.secondary">Gestión de lactancias, producción diaria y pesos</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <KPI label="Producción hoy" value={`${produccionTotalHoy || 0} L`} sub={`${produccionesHoy.length} registros`} accent="#1565C0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI label="Lactancias activas" value={lactanciasActivas.length} accent="#2E7D32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI label="Total lactancias" value={lactancias.length} accent="#6A1B9A" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPI label="Promedio por vaca" value={`${promedio} L/día`} accent="#E65100" />
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} variant="scrollable" scrollButtons="auto">
          {tabsWithCount.map(({ label, Icon, count }) => (
            <Tab key={label} icon={<Icon sx={{ fontSize: 17 }} />} iconPosition="start"
              label={count !== undefined ? `${label} (${count})` : label}
              sx={{ minHeight: 48, textTransform: 'none', fontWeight: 500, fontSize: 13 }} />
          ))}
        </Tabs>
      </Box>

      {/* Dashboard */}
      {tabIdx === 0 && (
        <Grid container spacing={2}>
          {top5Vacas && top5Vacas.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <EmojiEventsOutlinedIcon sx={{ color: '#E65100', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={700}>Top 5 Vacas — Producción Hoy</Typography>
                </Box>
                {top5Vacas.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', py: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#E65100', width: 24 }}>#{idx + 1}</Typography>
                      <Typography variant="body2">{item.vaca?.nroArete} — {item.vaca?.nombre || 'Sin nombre'}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="primary">{item.litros} L</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#1565C0', color: '#fff', px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>Lactancias Activas</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {lactanciasActivas.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>No hay lactancias activas</Typography>
                ) : lactanciasActivas.map(l => (
                  <Box key={l.id} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{l.vaca?.nroArete}</Typography>
                      <Typography variant="caption" color="text.secondary">Lactancia #{l.numeroLactancia}</Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="caption" color="text.secondary">Inicio: {new Date(l.fechaInicio).toLocaleDateString('es-PY')}</Typography>
                      <Typography variant="body2" fontWeight={700} color="primary" display="block">
                        {parseFloat(l.promedioDiario || 0).toFixed(1)} L/día
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#1565C0', color: '#fff', px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>Producción de Hoy</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {produccionesHoy.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>No hay registros hoy</Typography>
                ) : produccionesHoy.map(p => (
                  <Box key={p.id} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', py: 0.75 }}>
                    <Typography variant="body2" fontWeight={600}>{p.vaca?.nroArete}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.turno}</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary">{p.litros} L</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Lactancias */}
      {tabIdx === 1 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Vaca</TableCell><TableCell>N° Lactancia</TableCell>
                  <TableCell>Fecha inicio</TableCell><TableCell>Días</TableCell>
                  <TableCell>Total litros</TableCell><TableCell>Promedio</TableCell><TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lactancias.map(l => (
                  <TableRow key={l.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{l.vaca?.nroArete}</Typography>
                      <Typography variant="caption" color="text.secondary">{l.vaca?.nombre || ''}</Typography>
                    </TableCell>
                    <TableCell>{l.numeroLactancia}</TableCell>
                    <TableCell>{new Date(l.fechaInicio).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell>{l.diasProduccion || 0}</TableCell>
                    <TableCell>{parseFloat(l.totalLitros || 0).toFixed(1)} L</TableCell>
                    <TableCell>{parseFloat(l.promedioDiario || 0).toFixed(1)} L/día</TableCell>
                    <TableCell>
                      <Chip size="small" label={l.estado}
                        sx={l.estado === 'ACTIVA'
                          ? { bgcolor: '#DCFCE7', color: '#166534', fontWeight: 500 }
                          : l.estado === 'SECADA'
                          ? { bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 500 }
                          : { bgcolor: '#F1F5F9', color: '#475569', fontWeight: 500 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {tabIdx === 2 && <ProduccionLecheForm onSuccess={() => setTabIdx(0)} />}
      {tabIdx === 3 && <RegistroPesoForm    onSuccess={() => setTabIdx(0)} />}
      {tabIdx === 4 && <LactanciaForm       onSuccess={() => setTabIdx(1)} />}
    </Box>
  )
}
