import { Box, Chip, Divider, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'

const ESTADO_OPCIONES = [
  { value: '',               label: 'Todos'          },
  { value: 'ACTIVA',         label: 'Activa'         },
  { value: 'EN_DESCANSO',    label: 'En Descanso'    },
  { value: 'MANTENIMIENTO',  label: 'Mantenimiento'  },
]

const TEMPORAL_OPCIONES = [
  { value: '',                             label: 'Todos'                   },
  { value: 'ultimos_movimientos',          label: 'Últimos movimientos'     },
  { value: 'animales_agregados_recientemente', label: 'Animales recientes'  },
  { value: 'movimientos_recientes',        label: 'Movimientos recientes'   },
]

export default function ParcelaFilters({ estado, temporal, onEstado, onTemporal }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
        <FilterListIcon sx={{ fontSize: 16 }} />
        <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Estado
        </Typography>
      </Box>

      {ESTADO_OPCIONES.map((op) => (
        <Chip
          key={op.value}
          label={op.label}
          size="small"
          onClick={() => onEstado(op.value)}
          color={estado === op.value ? 'success' : 'default'}
          variant={estado === op.value ? 'filled' : 'outlined'}
          sx={{ borderRadius: 1.5, fontWeight: estado === op.value ? 700 : 400, cursor: 'pointer' }}
        />
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
        <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Período
        </Typography>
      </Box>

      {TEMPORAL_OPCIONES.map((op) => (
        <Chip
          key={op.value}
          label={op.label}
          size="small"
          onClick={() => onTemporal(op.value)}
          color={temporal === op.value ? 'secondary' : 'default'}
          variant={temporal === op.value ? 'filled' : 'outlined'}
          sx={{ borderRadius: 1.5, fontWeight: temporal === op.value ? 700 : 400, cursor: 'pointer' }}
        />
      ))}
    </Box>
  )
}
