import { useQuery, useMutation } from '@apollo/client'
import { 
  GET_ANIMALES, 
  CREATE_ANIMAL, 
  UPDATE_ANIMAL, 
  DELETE_ANIMAL, 
  GET_RAZAS, 
  GET_CATEGORIAS 
} from '../graphql/animales'

export const useAnimales = () => {
  const { data, loading, error, refetch } = useQuery(GET_ANIMALES)
  const { data: razasData, loading: loadingRazas } = useQuery(GET_RAZAS)
  const { data: categoriasData, loading: loadingCategorias } = useQuery(GET_CATEGORIAS)

  const [createAnimal] = useMutation(CREATE_ANIMAL)
  const [updateAnimal] = useMutation(UPDATE_ANIMAL)
  const [deleteAnimal] = useMutation(DELETE_ANIMAL)

  const crearAnimal = async (input) => {
    try {
      const variables = {
        fincaId: input.fincaId || 1,
        arete: input.arete,
        nombre: input.nombre,
        fechaNacimiento: input.fechaNacimiento,
        sexo: input.sexo,
        razaId: input.razaId ? parseInt(input.razaId) : null,
        categoriaId: input.categoriaId ? parseInt(input.categoriaId) : null,
        peso: input.peso ? parseFloat(input.peso) : null,
      }
      
      const result = await createAnimal({ variables })
      
      if (result.data?.crearAnimal?.success) {
        refetch()
        return { success: true, message: result.data.crearAnimal.message }
      }
      return { success: false, message: result.data?.crearAnimal?.message || 'Error al crear' }
    } catch (error) {
      console.error('Error creating animal:', error)
      return { success: false, message: error.message }
    }
  }

  const actualizarAnimal = async (id, input) => {
    try {
      const result = await updateAnimal({ 
        variables: { 
          id, 
          nombre: input.nombre,
          estado: input.estado,
          peso: input.peso ? parseFloat(input.peso) : null
        } 
      })
      if (result.data?.actualizarAnimal?.success) {
        refetch()
        return { success: true, message: result.data.actualizarAnimal.message }
      }
      return { success: false, message: result.data?.actualizarAnimal?.message || 'Error al actualizar' }
    } catch (error) {
      console.error('Error updating animal:', error)
      return { success: false, message: error.message }
    }
  }

  const eliminarAnimal = async (id) => {
    try {
      const result = await deleteAnimal({ variables: { id } })
      if (result.data?.eliminarAnimal?.success) {
        refetch()
        return { success: true, message: result.data.eliminarAnimal.message }
      }
      return { success: false, message: result.data?.eliminarAnimal?.message || 'Error al eliminar' }
    } catch (error) {
      console.error('Error deleting animal:', error)
      return { success: false, message: error.message }
    }
  }

  return {
    animales: data?.allAnimales || [],
    razas: razasData?.razas || [],
    categorias: categoriasData?.categoriasAnimales || [],
    loading: loading || loadingRazas || loadingCategorias,
    error,
    crearAnimal,
    actualizarAnimal,
    eliminarAnimal,
    refetch
  }
}