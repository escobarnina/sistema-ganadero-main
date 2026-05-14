import { gql } from '@apollo/client'

// ==========================================
// QUERIES
// ==========================================

export const GET_NOTAS_COMPRA = gql`
  query GetNotasCompra {
    notasCompra {
      id
      fechaCompra
      tipoCompra
      observaciones
      proveedor {
        id
        nombre
        apellidos
      }
    }
  }
`

export const GET_PROVEEDORES = gql`
  query GetProveedores {
    proveedores {
      id
      nombre
      apellidos
    }
  }
`

export const GET_MEDICAMENTOS = gql`
  query GetMedicamentos {
    medicamentos {
      id
      nombre
      stockCantidad
      precioCompra
    }
  }
`

export const GET_ALIMENTOS = gql`
  query GetAlimentos {
    alimentos {
      id
      nombre
      stockCantidad
      precioReferencia
    }
  }
`

export const GET_DETALLES_COMPRA = gql`
  query GetDetallesCompra($notaCompraId: ID!) {
    detallesCompra(notaCompraId: $notaCompraId) {
      id
      cantidad
      precioUnitario
      subtotal
      medicamento {
        id
        nombre
      }
      alimento {
        id
        nombre
      }
    }
  }
`

// ==========================================
// MUTATIONS
// ==========================================

export const CREATE_NOTA_COMPRA = gql`
  mutation CrearNotaCompra(
    $fincaId: ID!
    $proveedorId: ID
    $tipoCompra: String!
    $fechaCompra: Date!
    $observaciones: String
  ) {
    crearNotaCompra(
      fincaId: $fincaId
      proveedorId: $proveedorId
      tipoCompra: $tipoCompra
      fechaCompra: $fechaCompra
      observaciones: $observaciones
    ) {
      notaCompra {
        id
        fechaCompra
        tipoCompra
      }
      success
      message
    }
  }
`

export const CREATE_DETALLE_COMPRA = gql`
  mutation CrearDetalleCompra(
    $notaCompraId: ID!
    $medicamentoId: ID!
    $precioUnitario: Decimal!
    $cantidad: Decimal!
  ) {
    crearDetalleCompra(
      notaCompraId: $notaCompraId
      medicamentoId: $medicamentoId
      precioUnitario: $precioUnitario
      cantidad: $cantidad
    ) {
      detalleCompra {
        id
        cantidad
        precioUnitario
        subtotal
      }
      success
      message
    }
  }
`

export const CREATE_DETALLE_COMPRA_ALIMENTO = gql`
  mutation CrearDetalleCompraAlimento(
    $notaCompraId: ID!
    $alimentoId: ID!
    $precioUnitario: Decimal!
    $cantidad: Decimal!
  ) {
    crearDetalleCompraAlimento(
      notaCompraId: $notaCompraId
      alimentoId: $alimentoId
      precioUnitario: $precioUnitario
      cantidad: $cantidad
    ) {
      detalleCompraAlimento {
        id
        cantidad
        precioUnitario
        subtotal
      }
      success
      message
    }
  }
`

export const UPDATE_NOTA_COMPRA = gql`
  mutation ActualizarNotaCompra(
    $id: ID!
    $proveedorId: ID
    $fechaCompra: Date
    $observaciones: String
  ) {
    actualizarNotaCompra(
      id: $id
      proveedorId: $proveedorId
      fechaCompra: $fechaCompra
      observaciones: $observaciones
    ) {
      notaCompra {
        id
        fechaCompra
      }
      success
      message
    }
  }
`

export const DELETE_NOTA_COMPRA = gql`
  mutation EliminarNotaCompra($id: ID!) {
    eliminarNotaCompra(id: $id) {
      success
      message
    }
  }
`