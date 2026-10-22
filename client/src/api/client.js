const API_BASE = '/api'

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = localStorage.getItem('primevista_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        // Expired token: clear and broadcast
        localStorage.removeItem('primevista_token')
        localStorage.removeItem('primevista_user')
        window.dispatchEvent(new Event('auth_state_changed'))
      }

      const errorMessage = data?.message || data?.errors?.[0]?.message || 'An unexpected error occurred.'
      const error = new Error(errorMessage)
      error.status = response.status
      error.details = data
      throw error
    }

    return data
  } catch (error) {
    throw error
  }
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  del: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
}
