import { useState } from 'react'
import { useReproduccion } from '../hooks/useReproduccion'
import LoadingSpinner     from '../components/LoadingSpinner'
import InseminacionForm   from '../components/InseminacionForm'
import PartoForm          from '../components/PartoForm'
import ProximosPartosCard from '../components/ProximosPartosCard'

import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Tabs, Tab, Chip, Card, CardContent, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider,
} from '@mui/material'
import ScienceOutlinedIcon       from '@mui/icons-material/ScienceOutlined'
import AssignmentOutlinedIcon    from '@mui/icons-material/AssignmentOutlined'
import ChildCareOutlinedIcon     from '@mui/icons-material/ChildCareOutlined'
import AddCircleOutlinedIcon     from '@mui/icons-material/AddCircleOutlined'
import PetsOutlinedIcon          from '@mui/icons-material/PetsOutlined'
import InfoOutlinedIcon          from '@mui/icons-material/InfoOutlined'
import CloseIcon                 from '@mui/icons-material/Close'

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
  { label: 'Registrar Parto', Icon: PetsOutlinedIcon },
]

const TIPO_PARTO_LABELS = {
  NORMAL:    { label: 'Normal',    color: '#DCFCE7', text: '#166534' },
  DISTOCICO: { label: 'Distócico', color: '#FEF3C7', text: '#92400E' },
  MULTIPLE:  { label: 'Múltiple', color: '#DBEAFE', text: '#1E40AF' },
  ABORTO:    { label: 'Aborto',    color: '#FEE2E2', text: '#991B1B' },
}

const ESTADO_LABELS = {
  PARIDA:  { label: 'Parida',  color: '#DCFCE7', text: '#166534' },
  ABORTO:  { label: 'Aborto',  color: '#FEE2E2', text: '#991B1B' },
  PRENADA: { label: 'Preñada', color: '#DBEAFE', text: '#1E40AF' },
  SERVIDA: { label: 'Servida', color: '#F3F4F6', text: '#374151' },
  VACIA:   { label: 'Vacía',   color: '#F3F4F6', text: '#374151' },
}

const TipoParto = ({ tipo }) => {
  const cfg = TIPO_PARTO_LABELS[tipo] || { label: tipo, color: '#F3F4F6', text: '#374151' }
  return <Chip size="small" label={cfg.label} sx={{ bgcolor: cfg.color, color: cfg.text, fontWeight: 500 }} />
}

const EstadoParto = ({ estado }) => {
  const cfg = ESTADO_LABELS[estado] || { label: estado, color: '#F3F4F6', text: '#374151' }
  return <Chip size="small" label={cfg.label} sx={{ bgcolor: cfg.color, color: cfg.text, fontWeight: 500 }} />
}

const fmt = (d) => d ? new Date(d).toLocaleDateString('es-PY') : '—'

// ---------------------------------------------------------------------------
// Diálogo de detalle de un parto
// ---------------------------------------------------------------------------
const PartoDetalle = ({ parto, onClose }) => {
  if (!parto) return null

  const reproductor = parto.inseminacion?.reproductor || parto.monta?.reproductor
  const tipoEvento  = parto.inseminacion ? 'Inseminación Artificial' : parto.monta ? 'Monta Natural' : '—'
  const fechaServicio = parto.inseminacion?.fecha || parto.monta?.fecha || parto.fechaServicio

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Detalle del Parto</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Row label="Madre"            value={parto.madre ? `${parto.madre.nroArete}${parto.madre.nombre ? ' — ' + parto.madre.nombre : ''}` : '—'} />
          <Row label="Padre (interno)"  value={parto.padre ? `${parto.padre.nroArete}${parto.padre.nombre ? ' — ' + parto.padre.nombre : ''}` : '—'} />
          <Row label="Reproductor"      value={reproductor ? `${reproductor.codigo}${reproductor.nombre ? ' — ' + reproductor.nombre : ''}` : '—'} />
          <Row label="Tipo evento"      value={tipoEvento} />
          <Row label="Fecha servicio"   value={fmt(fechaServicio)} />
          <Divider />
          <Row label="Fecha esperada"   value={fmt(parto.fechaPartoEsperado)} />
          <Row label="Fecha real"       value={fmt(parto.fechaPartoReal)} />
          <Row label="Tipo parto"       value={<TipoParto tipo={parto.tipoParto} />} />
          <Row label="Estado"           value={<EstadoParto estado={parto.estado} />} />
          <Row label="N° crías"         value={parto.numCrias ?? 0} />
          {parto.observaciones && <Row label="Observaciones" value={parto.observaciones} />}

          {parto.crias?.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Crías registradas
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {parto.crias.map(cria => (
                  <Box key={cria.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, bgcolor: '#F0FDF4', borderRadius: 1, border: '1px solid #BBF7D0' }}>
                    <Typography sx={{ fontSize: 18 }}>{cria.sexo === 'MACHO' ? '🐂' : '🐄'}</Typography>
                    <Box>
                      <Typography variant="body2" fontWeight={700} fontFamily="monospace">{cria.nroArete}</Typography>
                      {cria.nombre && <Typography variant="caption" color="text.secondary">{cria.nombre}</Typography>}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {cria.sexo} · Nacido: {fmt(cria.fechaNacimiento)} · {cria.origen}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {parto.tipoParto === 'ABORTO' && (
            <Box sx={{ p: 1.5, bgcolor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 1 }}>
              <Typography variant="body2" color="error.main">Aborto — sin crías registradas</Typography>
            </Box>
          )}

          {parto.crias?.length === 0 && parto.tipoParto !== 'ABORTO' && (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">Sin cría registrada</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" size="small">Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}

const Row = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 130, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, pt: 0.25 }}>
      {label}
    </Typography>
    {typeof value === 'string' || typeof value === 'number'
      ? <Typography variant="body2">{value}</Typography>
      : value
    }
  </Box>
)

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function ReproduccionPage() {
  const { inseminaciones, diagnosticos, reproducciones, vacasPrenadas, loading } = useReproduccion()
  const [tabIdx, setTabIdx]     = useState(0)
  const [detalleParto, setDetalleParto] = useState(null)

  if (loading) return <LoadingSpinner />

  const tabsWithCount = TABS.map((t, i) => ({
    ...t,
    count: i === 0 ? inseminaciones.length
         : i === 1 ? diagnosticos.length
         : i === 2 ? reproducciones.length
         : undefined,
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

      {/* Tab 0: Inseminaciones */}
      {tabIdx === 0 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hembra</TableCell>
                  <TableCell>Reproductor</TableCell>
                  <TableCell>N° Pajuela</TableCell>
                  <TableCell>Técnico</TableCell>
                  <TableCell>Resultado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inseminaciones.map(ia => (
                  <TableRow key={ia.id} hover>
                    <TableCell>{fmt(ia.fecha)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{ia.hembra?.nroArete}</Typography>
                      <Typography variant="caption" color="text.secondary">{ia.hembra?.nombre || ''}</Typography>
                    </TableCell>
                    <TableCell>{ia.reproductor?.codigo || '—'}</TableCell>
                    <TableCell>{ia.numeroPajuela || '—'}</TableCell>
                    <TableCell>{ia.tecnicoInseminador || '—'}</TableCell>
                    <TableCell>
                      {ia.resultado && ia.resultado !== 'PENDIENTE'
                        ? <Chip size="small" label={ia.resultado} sx={{ fontSize: 11 }} />
                        : <Typography variant="caption" color="text.disabled">Pendiente</Typography>
                      }
                    </TableCell>
                  </TableRow>
                ))}
                {inseminaciones.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 3 }}>Sin inseminaciones registradas</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Tab 1: Diagnósticos */}
      {tabIdx === 1 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hembra</TableCell>
                  <TableCell>Resultado</TableCell>
                  <TableCell>Días gestación</TableCell>
                  <TableCell>Método</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diagnosticos.map(d => (
                  <TableRow key={d.id} hover>
                    <TableCell>{fmt(d.fecha)}</TableCell>
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
                {diagnosticos.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 3 }}>Sin diagnósticos registrados</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Tab 2: Partos */}
      {tabIdx === 2 && (
        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha parto</TableCell>
                  <TableCell>Madre</TableCell>
                  <TableCell>Padre / Reproductor</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>N° crías</TableCell>
                  <TableCell>Crías</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reproducciones.map(r => {
                  const reproductor = r.inseminacion?.reproductor || r.monta?.reproductor
                  const padreMostrar = r.padre
                    ? `${r.padre.nroArete}${r.padre.nombre ? ' — ' + r.padre.nombre : ''}`
                    : reproductor
                      ? `${reproductor.codigo}${reproductor.nombre ? ' — ' + reproductor.nombre : ''}`
                      : '—'

                  let criasMostrar
                  if (r.tipoParto === 'ABORTO') {
                    criasMostrar = <Typography variant="caption" color="error.main">Aborto — sin cría</Typography>
                  } else if (!r.crias || r.crias.length === 0) {
                    criasMostrar = <Typography variant="caption" color="text.disabled">Sin cría registrada</Typography>
                  } else {
                    criasMostrar = (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        {r.crias.map(c => (
                          <Typography key={c.id} variant="caption" fontFamily="monospace">
                            {c.sexo === 'MACHO' ? '🐂' : '🐄'} {c.nroArete}{c.nombre ? ` — ${c.nombre}` : ''}
                          </Typography>
                        ))}
                      </Box>
                    )
                  }

                  return (
                    <TableRow key={r.id} hover>
                      <TableCell>{fmt(r.fechaPartoReal)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{r.madre?.nroArete || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.madre?.nombre || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{padreMostrar}</Typography>
                      </TableCell>
                      <TableCell><TipoParto tipo={r.tipoParto} /></TableCell>
                      <TableCell align="center">{r.numCrias ?? 0}</TableCell>
                      <TableCell>{criasMostrar}</TableCell>
                      <TableCell><EstadoParto estado={r.estado} /></TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          title="Ver detalle"
                          onClick={() => setDetalleParto(r)}
                          sx={{ color: 'primary.main' }}
                        >
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {reproducciones.length === 0 && (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ color: 'text.secondary', py: 3 }}>Sin partos registrados</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Tab 3: Nueva IA */}
      {tabIdx === 3 && <InseminacionForm onSuccess={() => setTabIdx(0)} />}

      {/* Tab 4: Registrar Parto */}
      {tabIdx === 4 && <PartoForm onSuccess={() => setTabIdx(2)} />}

      {/* Diálogo detalle parto */}
      {detalleParto && (
        <PartoDetalle parto={detalleParto} onClose={() => setDetalleParto(null)} />
      )}
    </Box>
  )
}
