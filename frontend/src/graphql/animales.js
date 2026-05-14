import { gql } from '@apollo/client'

// ==========================================
// QUERIES
// ==========================================

export const GET_ANIMALES = gql`
  query GetAnimales {
    allAnimales {
      id
      nroArete
      nombre
      sexo
      fechaNacimiento
      estado
      peso
      raza {
        id
        nombre
      }
      categoria {
        id
        nombre
      }
    }
  }
`

export const GET_RAZAS = gql`
  query GetRazas {
    razas {
      id
      nombre
    }
  }
`

export const GET_CATEGORIAS = gql`
  query GetCategorias {
    categoriasAnimales {
      id
      nombre
    }
  }
`

// ==========================================
// MUTATIONS
// ==========================================

export const CREATE_ANIMAL = gql`
  mutation CrearAnimal(
    $fincaId: Int!
    $arete: String!
    $nombre: String
    $fechaNacimiento: Date!
    $sexo: String!
    $razaId: Int!
    $categoriaId: Int!
    $peso: Decimal
  ) {
    crearAnimal(
      fincaId: $fincaId
      arete: $arete
      nombre: $nombre
      fechaNacimiento: $fechaNacimiento
      sexo: $sexo
      razaId: $razaId
      categoriaId: $categoriaId
      peso: $peso
    ) {
      animal {
        id
        nroArete
        nombre
      }
      success
      message
    }
  }
`

export const UPDATE_ANIMAL = gql`
  mutation ActualizarAnimal(
    $id: ID!
    $nombre: String
    $estado: String
    $peso: Decimal
  ) {
    actualizarAnimal(
      id: $id
      nombre: $nombre
      estado: $estado
      peso: $peso
    ) {
      animal {
        id
        nombre
        estado
        peso
      }
      success
      message
    }
  }
`

export const DELETE_ANIMAL = gql`
  mutation EliminarAnimal($id: ID!) {
    eliminarAnimal(id: $id) {
      success
      message
    }
  }
`