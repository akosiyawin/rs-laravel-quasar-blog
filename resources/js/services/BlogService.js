import { api } from '@/boot/axios'

export default {
  async getBlogs(params = {}) {
    try {
      const response = await api.get(`/blogs`, { params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async getBlog(id) {
    try {
      const response = await api.get(`/blogs/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async createBlog(blogData) {
    try {
      const response = await api.post(`/blogs`, blogData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async updateBlog(id, blogData) {
    try {
      const response = await api.put(`/blogs/${id}`, blogData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async deleteBlog(id) {
    try {
      await api.delete(`/blogs/${id}`)
      return true
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async changeStatus(id, status) {
    try {
      const response = await api.patch(`/blogs/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async archiveBlog(id) {
    try {
      const response = await api.post(`/blogs/${id}/archive`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async restoreBlog(id) {
    try {
      const response = await api.post(`/blogs/${id}/restore`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  async getDashboardStats() {
    try {
      const response = await api.get('/blogs/dashboard-stats')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
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