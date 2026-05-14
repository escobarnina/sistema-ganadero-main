// frontend/src/hooks/useReproduccion.js
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_INSEMINACIONES,
  GET_MONTAS_NATURALES,
  GET_DIAGNOSTICOS_PRENEZ,
  GET_REPRODUCCIONES,
  GET_VACAS_PREÑADAS,
  GET_PROXIMOS_PARTOS,
  CREATE_INSEMINACION,
  CREATE_DIAGNOSTICO_PRENEZ,
  CREATE_REPRODUCCION,
} from '../graphql/reproduccion'

export const useReproduccion = () => {
  // Queries
  const { data: inseminaciones, loading: loadingInseminaciones, refetch: refetchInseminaciones } = useQuery(GET_INSEMINACIONES)
  const { data: montasNaturales, loading: loadingMontas } = useQuery(GET_MONTAS_NATURALES)
  const { data: diagnosticos, loading: loadingDiagnosticos } = useQuery(GET_DIAGNOSTICOS_PRENEZ)
  const { data: reproducciones, loading: loadingReproducciones } = useQuery(GET_REPRODUCCIONES)
  const { data: vacasPrenadas, loading: loadingVacasPrenadas } = useQuery(GET_VACAS_PREÑADAS)
  const { data: proximosPartos, loading: loadingProximosPartos, refetch: refetchProximosPartos } = useQuery(GET_PROXIMOS_PARTOS, {
    variables: { dias: 30 }
  })

  // Mutations
  const [crearInseminacionMutation] = useMutation(CREATE_INSEMINACION)
  const [crearDiagnosticoMutation] = useMutation(CREATE_DIAGNOSTICO_PRENEZ)
  const [crearReproduccionMutation] = useMutation(CREATE_REPRODUCCION)

  // Función para crear inseminación
  const crearInseminacion = async (variables) => {
    try {
      const fincaId = localStorage.getItem('fincaId') || 'tu-finca-id-aqui'
      
      const { data } = await crearInseminacionMutation({
        variables: {
          fincaId: fincaId,
          hembraId: variables.hembraId,
          fecha: variables.fecha,
          reproductorId: variables.reproductorId,
          numeroServicio: variables.numeroServicio,
          numeroPajuela: variables.numeroPajuela,
          tecnicoInseminador: variables.tecnicoInseminador,
          observaciones: variables.observaciones
        }
      })
      
      await refetchInseminaciones()
      return { success: true, data: data?.crearInseminacionArtificial }
    } catch (error) {
      console.error('Error al crear inseminación:', error)
      return { success: false, error: error.message }
    }
  }

  // Función para crear diagnóstico de preñez
  const crearDiagnostico = async (variables) => {
    try {
      const fincaId = localStorage.getItem('fincaId') || 'tu-finca-id-aqui'
      
      const { data } = await crearDiagnosticoMutation({
        variables: {
          fincaId: fincaId,
          hembraId: variables.hembraId,
          fecha: variables.fecha,
          resultadoPrenez: variables.resultadoPrenez,
          diasGestacion: variables.diasGestacion,
          metodo: variables.metodo
        }
      })
      
      return { success: true, data: data?.crearDiagnosticoPrenez }
    } catch (error) {
      console.error('Error al crear diagnóstico:', error)
      return { success: false, error: error.message }
    }
  }

  // Función para crear reproducción (parto)
  const crearReproduccion = async (variables) => {
    try {
      const fincaId = localStorage.getItem('fincaId') || 'tu-finca-id-aqui'
      
      const { data } = await crearReproduccionMutation({
        variables: {
          fincaId: fincaId,
          madreId: variables.madreId,
          fechaServicio: variables.fechaServicio,
          fechaPartoReal: variables.fechaPartoReal,
          tipoParto: variables.tipoParto,
          numCrias: variables.numCrias,
          estado: variables.estado,
          observaciones: variables.observaciones
        }
      })
      
      await refetchProximosPartos()
      return { success: true, data: data?.crearReproduccion }
    } catch (error) {
      console.error('Error al crear parto:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    // Data
    inseminaciones: inseminaciones?.inseminaciones || [],
    montasNaturales: montasNaturales?.montasNaturales || [],
    diagnosticos: diagnosticos?.diagnosticosPrenez || [],
    reproducciones: reproducciones?.reproducciones || [],
    vacasPrenadas: vacasPrenadas?.vacasPrenadas || [],
    proximosPartos: proximosPartos?.proximosPartos || [],
    
    // Loading states
    loading: loadingInseminaciones || loadingMontas || loadingDiagnosticos || loadingReproducciones,
    
    // Functions
    crearInseminacion,
    crearDiagnostico,
    crearReproduccion,
    
    // Refetch
    refetchInseminaciones,
    refetchProximosPartos,
  }
}