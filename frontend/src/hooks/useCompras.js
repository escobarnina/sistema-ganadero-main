import { useQuery, useMutation } from '@apollo/client'
import { 
  GET_NOTAS_COMPRA, 
  CREATE_NOTA_COMPRA, 
  CREATE_DETALLE_COMPRA,
  CREATE_DETALLE_COMPRA_ALIMENTO,
  UPDATE_NOTA_COMPRA,
  DELETE_NOTA_COMPRA,
  GET_PROVEEDORES,
  GET_MEDICAMENTOS,
  GET_ALIMENTOS
} from '../graphql/compras'

export const useCompras = () => {
  const { data, loading, error, refetch } = useQuery(GET_NOTAS_COMPRA)
  const { data: proveedoresData } = useQuery(GET_PROVEEDORES)
  const { data: medicamentosData } = useQuery(GET_MEDICAMENTOS)
  const { data: alimentosData } = useQuery(GET_ALIMENTOS)

  const [createNotaCompra] = useMutation(CREATE_NOTA_COMPRA)
  const [createDetalleCompra] = useMutation(CREATE_DETALLE_COMPRA)
  const [createDetalleCompraAlimento] = useMutation(CREATE_DETALLE_COMPRA_ALIMENTO)
  const [updateNotaCompra] = useMutation(UPDATE_NOTA_COMPRA)
  const [deleteNotaCompra] = useMutation(DELETE_NOTA_COMPRA)

  const crearNotaCompra = async (input) => {
    try {
      const variables = { fincaId: "1", ...input }
      const result = await createNotaCompra({ variables })
      if (result.data?.crearNotaCompra?.success) {
        refetch()
        return { success: true, message: result.data.crearNotaCompra.message, id: result.data.crearNotaCompra.notaCompra.id }
      }
      return { success: false, message: result.data?.crearNotaCompra?.message || 'Error al crear' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const crearDetalleCompra = async (input) => {
    try {
      const result = await createDetalleCompra({ variables: input })
      if (result.data?.crearDetalleCompra?.success) {
        return { success: true, message: result.data.crearDetalleCompra.message }
      }
      return { success: false, message: result.data?.crearDetalleCompra?.message || 'Error al crear detalle' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const crearDetalleCompraAlimento = async (input) => {
    try {
      const result = await createDetalleCompraAlimento({ variables: input })
      if (result.data?.crearDetalleCompraAlimento?.success) {
        return { success: true, message: result.data.crearDetalleCompraAlimento.message }
      }
      return { success: false, message: result.data?.crearDetalleCompraAlimento?.message || 'Error al crear detalle' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const actualizarNotaCompra = async (id, input) => {
    try {
      const result = await updateNotaCompra({ variables: { id, ...input } })
      if (result.data?.actualizarNotaCompra?.success) {
        refetch()
        return { success: true, message: result.data.actualizarNotaCompra.message }
      }
      return { success: false, message: result.data?.actualizarNotaCompra?.message || 'Error al actualizar' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const eliminarNotaCompra = async (id) => {
    try {
      const result = await deleteNotaCompra({ variables: { id } })
      if (result.data?.eliminarNotaCompra?.success) {
        refetch()
        return { success: true, message: result.data.eliminarNotaCompra.message }
      }
      return { success: false, message: result.data?.eliminarNotaCompra?.message || 'Error al eliminar' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  return {
    notasCompra: data?.notasCompra || [],
    proveedores: proveedoresData?.proveedores || [],
    medicamentos: medicamentosData?.medicamentos || [],
    alimentos: alimentosData?.alimentos || [],
    loading,
    error,
    crearNotaCompra,
    crearDetalleCompra,
    crearDetalleCompraAlimento,
    actualizarNotaCompra,
    eliminarNotaCompra,
    refetch
  }
}