import { api } from '@/boot/axios'

export const AuthService = {
  async getCurrentUser() {
    try {
      const response = await api.get('/user/me')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async login(credentials) {
    const response = await api.post('/login', credentials)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
    }
    return response.data
  },

  async register(userData) {
    const response = await api.post('/register', userData)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
    }
    return response.data
  },

  async logout() {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token')

      // Set the Authorization header for this request
      const response = await api.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Clear the token and header after successful logout
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']

      return response.data
    } catch (error) {
      // Even if the server request fails, clear the local auth state
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      throw error
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors
      }
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 0,
        message: 'No response from server',
        errors: null
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 0,
        message: error.message,
        errors: null
      }
    }
  }
} 