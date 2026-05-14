// frontend/src/graphql/parcelas.js
import { gql } from '@apollo/client'

// ==========================================
// QUERIES
// ==========================================

export const GET_PARCELAS = gql`
  query GetParcelas($fincaId: ID!) {
    parcelas(fincaId: $fincaId) {
      id
      nombre
      estado
      tamano
      capacidadMaxima
      tipoPastura
      animalesActuales {
        id
        animal {
          id
          nroArete
          nombre
          sexo
        }
        fechaIngreso
      }
    }
  }
`

export const GET_PARCELA = gql`
  query GetParcela($id: ID!) {
    parcela(id: $id) {
      id
      nombre
      estado
      tamano
      capacidadMaxima
      tipoPastura
      animalesActuales {
        id
        animal {
          id
          nroArete
          nombre
          sexo
        }
        fechaIngreso
      }
    }
  }
`

export const GET_ANIMALES_EN_PARCELA = gql`
  query GetAnimalesEnParcela($parcelaId: ID!) {
    animalesEnParcela(parcelaId: $parcelaId) {
      id
      animal {
        id
        nroArete
        nombre
        sexo
        peso
        raza {
          nombre
        }
      }
      fechaIngreso
    }
  }
`

export const GET_ANIMALES_DISPONIBLES = gql`
  query GetAnimalesDisponibles($fincaId: ID!) {
    animalesActivos(fincaId: $fincaId) {
      id
      nroArete
      nombre
      sexo
      peso
      raza {
        nombre
      }
    }
  }
`

// ==========================================
// MUTATIONS - PARCELAS
// ==========================================

export const CREATE_PARCELA = gql`
  mutation CrearParcela(
    $fincaId: ID!
    $nombre: String!
    $tamano: Decimal
    $capacidadMaxima: Int
    $tipoPastura: String
    $estado: String
  ) {
    crearParcela(
      fincaId: $fincaId
      nombre: $nombre
      tamano: $tamano
      capacidadMaxima: $capacidadMaxima
      tipoPastura: $tipoPastura
      estado: $estado
    ) {
      parcela {
        id
        nombre
      }
      success
      message
    }
  }
`

export const UPDATE_PARCELA = gql`
  mutation ActualizarParcela(
    $id: ID!
    $nombre: String
    $tamano: Decimal
    $capacidadMaxima: Int
    $tipoPastura: String
    $estado: String
  ) {
    actualizarParcela(
      id: $id
      nombre: $nombre
      tamano: $tamano
      capacidadMaxima: $capacidadMaxima
      tipoPastura: $tipoPastura
      estado: $estado
    ) {
      parcela {
        id
        nombre
      }
      success
      message
    }
  }
`

export const DELETE_PARCELA = gql`
  mutation EliminarParcela($id: ID!) {
    eliminarParcela(id: $id) {
      success
      message
    }
  }
`

// ==========================================
// MUTATIONS - MOVIMIENTOS
// ==========================================

export const MOVER_ANIMAL_A_PARCELA = gql`
  mutation MoverAnimalAParcela(
    $fincaId: ID!
    $animalId: ID!
    $parcelaId: ID!
    $fechaIngreso: Date!
    $observaciones: String
  ) {
    moverAnimalAParcela(
      fincaId: $fincaId
      animalId: $animalId
      parcelaId: $parcelaId
      fechaIngreso: $fechaIngreso
      observaciones: $observaciones
    ) {
      movimiento {
        id
      }
      success
      message
    }
  }
`

export const SACAR_ANIMAL_DE_PARCELA = gql`
  mutation SacarAnimalDeParcela($movimientoId: ID!, $fechaSalida: Date!) {
    sacarAnimalDeParcela(movimientoId: $movimientoId, fechaSalida: $fechaSalida) {
      success
      message
    }
  }
`