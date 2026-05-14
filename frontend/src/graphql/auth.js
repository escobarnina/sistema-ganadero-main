// frontend/src/graphql/auth.js
import { gql } from '@apollo/client'

export const GET_MI_USUARIO = gql`
  query GetMiUsuario {
    miUsuario {
      id
      username
      email
      firstName
      lastName
      nombreCompleto
      telefono
      isActive
      rol {
        id
        nombre
        permisosLista
      }
    }
  }
`

// 👇 CAMBIAR: usa tokenAuth en lugar de login
export const LOGIN = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`

// 👇 AGREGAR: verificar token
export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`

// 👇 AGREGAR: refrescar token
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      payload
    }
  }
`