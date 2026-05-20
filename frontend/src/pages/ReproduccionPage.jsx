import { useState } from 'react'
import { useReproduccion } from '../hooks/useReproduccion'
import LoadingSpinner     from '../components/LoadingSpinner'
import InseminacionForm   from '../components/InseminacionForm'
import ProximosPartosCard from '../components/ProximosPartosCard'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Tabs, Tab, Chip, Card, CardContent, Grid,
} from '@mui/material'
import ScienceOutlinedIcon       from '@mui/icons-material/ScienceOutlined'
import AssignmentOutlinedIcon    from '@mui/icons-material/AssignmentOutlined'
import ChildCareOutlinedIcon     from '@mui/icons-material/ChildCareOutlined'
import AddCircleOutlinedIcon     from '@mui/icons-material/AddCircleOutlined'

const KPI = ({ label, value, accent }) => (
  <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${accent}`, borderRadius: 2 }}>
    <CardContent sx={{ p: '16px !important' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ color: accent }}>{value}</Typography>
    </CardContent>
  </Card>
)

const TABS = [
  { label: 'Inseminaciones', Icon: ScienceOutlinedIcon },
  { label: 'Diagnósticos',   Icon: AssignmentOutlinedIcon },
  { label: 'Partos',         Icon: ChildCareOutlinedIcon },
  { label: '+ Nueva IA',     Icon: AddCircleOutlinedIcon },
]

export default function ReproduccionPage() {
  const { inseminaciones, diagnosticos, reproducciones, vacasPrenadas, loading } = useReproduccion()
  const [tabIdx, setTabIdx] = useState(0)

  if (loading) return <LoadingSpinner />

  const tabsWithCount = TABS.map((t, i) => ({
    ...t,
    count: i === 0 ? inseminaciones.length : i === 1 ? diagnosticos.length : i === 2 ? reproducciones.length : undefined,
  }))

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">Módulo de Reproducción</Typography>
        <Typography variant="body2" color="text.secondary">Gestión de inseminaciones, diagnósticos y partos</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><KPI label="Vacas preñadas"  value={vacasPrenadas.length}  accent="#2E7D32" /></Grid>
        <Grid item xs={12} sm={6} md={3}><KPI label="Inseminaciones"  value={inseminaciones.length} accent="#1565C0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><KPI label="Partos este año" value={reproducciones.length} accent="#6A1B9A" /></Grid>
        <Grid item xs={12} sm={6} md={3}><ProximosPartosCard /></Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} variant="scrollable" scrollButtons="auto">
          {tabsWithCount.map(({ label, Icon, count }) => (
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

      {tabIdx === 0 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell><TableCell>Hembra</TableCell>
                  <TableCell>Reproductor</TableCell><TableCell>N° Pajuela</TableCell><TableCell>Técnico</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inseminaciones.map(ia => (
                  <TableRow key={ia.id} hover>
                    <TableCell>{new Date(ia.fecha).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{ia.hembra?.nroArete}</Typography>
                      <Typography variant="caption" color="text.secondary">{ia.hembra?.nombre || ''}</Typography>
                    </TableCell>
                    <TableCell>{ia.reproductor?.codigo || '—'}</TableCell>
                    <TableCell>{ia.numeroPajuela || '—'}</TableCell>
                    <TableCell>{ia.tecnicoInseminador || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {tabIdx === 1 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell><TableCell>Hembra</TableCell>
                  <TableCell>Resultado</TableCell><TableCell>Días gestación</TableCell><TableCell>Método</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diagnosticos.map(d => (
                  <TableRow key={d.id} hover>
                    <TableCell>{new Date(d.fecha).toLocaleDateString('es-PY')}</TableCell>
                    <TableCell><Typography variant="body2" fontWeight={600}>{d.hembra?.nroArete}</Typography></TableCell>
                    <TableCell>
                      <Chip size="small" label={d.resultadoPrenez}
                        sx={d.resultadoPrenez === 'POSITIVO'
                          ? { bgcolor: '#DCFCE7', color: '#166534', fontWeight: 500 }
                          : { bgcolor: '#FEE2E2', color: '#991B1B', fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>{d.diasGestacion || '—'}</TableCell>
                    <TableCell>{d.metodo || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {tabIdx === 2 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow><TableCell>Fecha</TableCell><TableCell>Madre</TableCell><TableCell>Cría</TableCell></TableRow>
              </TableHead>
              <TableBody>
                {reproducciones.map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.fechaParto ? new Date(r.fechaParto).toLocaleDateString('es-PY') : '—'}</TableCell>
                    <TableCell><Typography variant="body2" fontWeight={600}>{r.madre?.nroArete || r.hembra?.nroArete || '—'}</Typography></TableCell>
                    <TableCell>{r.cria?.nroArete || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {tabIdx === 3 && <InseminacionForm onSuccess={() => setTabIdx(0)} />}
    </Box>
  )
}
