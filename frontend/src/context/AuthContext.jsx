// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import { GET_MI_USUARIO, LOGIN, LOGOUT } from '../graphql/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const client = useApolloClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const { refetch: refetchUser } = useQuery(GET_MI_USUARIO, {
    skip: !token,
    onCompleted: (data) => {
      if (data?.miUsuario) {
        setUser(data.miUsuario)
      }
      setLoading(false)
    },
    onError: (error) => {
      console.error('Error fetching user:', error)
      setLoading(false)
      if (token) {
        logout()
      }
    }
  })

  const [loginMutation] = useMutation(LOGIN)
  const [logoutMutation] = useMutation(LOGOUT)

  useEffect(() => {
    if (token) {
      refetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (username, password) => {
    try {
      const { data } = await loginMutation({
        variables: { username, password }
      })
      
      const newToken = data?.tokenAuth?.token
      
      if (newToken) {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        // Esperar a que se cargue el usuario
        const userResult = await refetchUser()
        setUser(userResult.data?.miUsuario)
        return { success: true, user: userResult.data?.miUsuario }
      }
      return { success: false, message: 'Credenciales inválidas' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message }
    }
  }

  const logout = async () => {
    try {
      await logoutMutation()
    } catch (error) {
      console.error('Error en logout:', error)
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    await client.resetStore()
  }

  const tienePermiso = (permiso) => {
    if (!user?.rol?.permisosLista) return false
    return user.rol.permisosLista.includes(permiso)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    tienePermiso,
    userRole: user?.rol?.nombre,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}