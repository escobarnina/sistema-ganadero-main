import { gql } from '@apollo/client'

// ==========================================
// QUERIES
// ==========================================

export const GET_NOTAS_VENTA = gql`
  query GetNotasVenta {
    notasVenta {
      id
      fechaVenta
      guiaSalida
      observaciones
      cliente {
        id
        nombre
        apellidos
        ci
      }
    }
  }
`

export const GET_CLIENTES = gql`
  query GetClientes {
    clientes {
      id
      nombre
      apellidos
      ci
      telefono
    }
  }
`

export const GET_ANIMALES_DISPONIBLES = gql`
  query GetAnimalesDisponibles {
    animalesDisponibles {
      id
      nroArete
      nombre
      peso
      estado
      raza {
        nombre
      }
    }
  }
`

export const GET_DETALLES_VENTA = gql`
  query GetDetallesVenta($notaVentaId: ID!) {
    detallesVenta(notaVentaId: $notaVentaId) {
      id
      pesoVentaKg
      precioKg
      subtotal
      animal {
        id
        nroArete
        nombre
        peso
      }
    }
  }
`

export const GET_MUERTES_BAJAS = gql`
  query GetMuertesBajas {
    muertesBajas {
      id
      fechaBaja
      causa
      tipo
      descripcion
      pesoEstimadoKg
      animal {
        id
        nroArete
        nombre
        peso
        raza {
          nombre
        }
      }
    }
  }
`

// ==========================================
// MUTATIONS
// ==========================================

export const CREATE_NOTA_VENTA = gql`
  mutation CrearNotaVenta(
    $fincaId: ID!
    $clienteId: ID
    $fechaVenta: Date!
    $guiaSalida: String
    $observaciones: String
  ) {
    crearNotaVenta(
      fincaId: $fincaId
      clienteId: $clienteId
      fechaVenta: $fechaVenta
      guiaSalida: $guiaSalida
      observaciones: $observaciones
    ) {
      notaVenta {
        id
        fechaVenta
      }
      success
      message
    }
  }
`

export const CREATE_DETALLE_VENTA = gql`
  mutation CrearDetalleVenta(
    $notaVentaId: ID!
    $animalId: ID!
    $pesoVentaKg: Decimal!
    $precioKg: Decimal!
  ) {
    crearDetalleVenta(
      notaVentaId: $notaVentaId
      animalId: $animalId
      pesoVentaKg: $pesoVentaKg
      precioKg: $precioKg
    ) {
      detalleVenta {
        id
        subtotal
      }
      success
      message
    }
  }
`

export const CREATE_MUERTE_BAJA = gql`
  mutation CrearMuerteBaja(
    $fincaId: ID!
    $animalId: ID!
    $fechaBaja: Date!
    $tipo: String!
    $causa: String!
    $descripcion: String
    $pesoEstimadoKg: Decimal
  ) {
    crearMuerteBaja(
      fincaId: $fincaId
      animalId: $animalId
      fechaBaja: $fechaBaja
      tipo: $tipo
      causa: $causa
      descripcion: $descripcion
      pesoEstimadoKg: $pesoEstimadoKg
    ) {
      muerteBaja {
        id
        fechaBaja
        tipo
      }
      success
      message
    }
  }
`

export const DELETE_MUERTE_BAJA = gql`
  mutation EliminarMuerteBaja($id: ID!) {
    eliminarMuerteBaja(id: $id) {
      success
      message
    }
  }
`

export const UPDATE_MUERTE_BAJA = gql`
  mutation ActualizarMuerteBaja(
    $id: ID!
    $fechaBaja: Date
    $tipo: String
    $causa: String
    $descripcion: String
    $pesoEstimadoKg: Decimal
  ) {
    actualizarMuerteBaja(
      id: $id
      fechaBaja: $fechaBaja
      tipo: $tipo
      causa: $causa
      descripcion: $descripcion
      pesoEstimadoKg: $pesoEstimadoKg
    ) {
      muerteBaja {
        id
        tipo
        causa
        fechaBaja
        descripcion
        pesoEstimadoKg
      }
      success
      message
    }
  }
`