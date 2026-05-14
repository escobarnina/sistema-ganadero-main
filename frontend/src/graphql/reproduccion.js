// frontend/src/graphql/reproduccion.js
import { gql } from '@apollo/client'

// ==========================================
// QUERIES
// ==========================================

export const GET_INSEMINACIONES = gql`
  query GetInseminaciones {
    inseminaciones {
      id
      fecha
      numeroServicio
      numeroPajuela
      tecnicoInseminador
      observaciones
      hembra {
        id
        nombre
        nroArete
      }
      reproductor {
        id
        codigo
        nombre
      }
    }
  }
`

export const GET_MONTAS_NATURALES = gql`
  query GetMontasNaturales {
    montasNaturales {
      id
      fecha
      numeroServicio
      observaciones
      hembra {
        id
        nombre
        nroArete
      }
      reproductor {
        id
        codigo
        nombre
      }
    }
  }
`

export const GET_DIAGNOSTICOS_PRENEZ = gql`
  query GetDiagnosticosPrenez {
    diagnosticosPrenez {
      id
      fecha
      resultadoPrenez
      diasGestacion
      metodo
      hembra {
        id
        nombre
        nroArete
      }
    }
  }
`

export const GET_REPRODUCCIONES = gql`
  query GetReproducciones {
    reproducciones {
      id
      fechaServicio
      fechaPartoReal
      tipoParto
      numCrias
      estado
      observaciones
      madre {
        id
        nombre
        nroArete
      }
    }
  }
`

export const GET_VACAS_PREÑADAS = gql`
  query GetVacasPrenadas {
    vacasPrenadas {
      id
      fechaServicio
      fechaPartoEsperado
      madre {
        id
        nombre
        nroArete
      }
    }
  }
`

export const GET_PROXIMOS_PARTOS = gql`
  query GetProximosPartos($dias: Int) {
    proximosPartos(dias: $dias) {
      id
      fechaPartoEsperado
      estado
      madre {
        id
        nombre
        nroArete
      }
    }
  }
`

// ==========================================
// MUTATIONS
// ==========================================

export const CREATE_INSEMINACION = gql`
  mutation CrearInseminacionArtificial(
    $fincaId: ID!
    $hembraId: ID!
    $fecha: Date!
    $reproductorId: ID
    $numeroServicio: Int
    $numeroPajuela: String
    $tecnicoInseminador: String
    $observaciones: String
  ) {
    crearInseminacionArtificial(
      fincaId: $fincaId
      hembraId: $hembraId
      fecha: $fecha
      reproductorId: $reproductorId
      numeroServicio: $numeroServicio
      numeroPajuela: $numeroPajuela
      tecnicoInseminador: $tecnicoInseminador
      observaciones: $observaciones
    ) {
      inseminacion {
        id
        fecha
        hembra {
          nombre
        }
      }
    }
  }
`

export const CREATE_DIAGNOSTICO_PRENEZ = gql`
  mutation CrearDiagnosticoPrenez(
    $fincaId: ID!
    $hembraId: ID!
    $fecha: Date!
    $resultadoPrenez: String!
    $diasGestacion: Int
    $metodo: String
  ) {
    crearDiagnosticoPrenez(
      fincaId: $fincaId
      hembraId: $hembraId
      fecha: $fecha
      resultadoPrenez: $resultadoPrenez
      diasGestacion: $diasGestacion
      metodo: $metodo
    ) {
      diagnostico {
        id
        resultadoPrenez
      }
    }
  }
`

export const CREATE_REPRODUCCION = gql`
  mutation CrearReproduccion(
    $fincaId: ID!
    $madreId: ID!
    $fechaServicio: Date
    $fechaPartoReal: Date
    $tipoParto: String
    $numCrias: Int
    $estado: String
    $observaciones: String
  ) {
    crearReproduccion(
      fincaId: $fincaId
      madreId: $madreId
      fechaServicio: $fechaServicio
      fechaPartoReal: $fechaPartoReal
      tipoParto: $tipoParto
      numCrias: $numCrias
      estado: $estado
      observaciones: $observaciones
    ) {
      reproduccion {
        id
        estado
      }
    }
  }
`