const API_URL = "http://localhost:4000/api"; // Importante colocar la url de tu api

const parseErrorMessage = async (response) => {
  let message = `Error HTTP: ${response.status}`;
  try {
    const errorData = await response.json();
    if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      message = errorData.errors.map((item) => item.msg || item.message || String(item)).join(' | ');
    } else {
      message = errorData.error || errorData.msg || errorData.message || message;
    }
  } catch {
    try {
      const rawText = await response.text();
      if (rawText) message = rawText;
    } catch {
    }
  }
  return message;
};

const shouldLogoutByAuthError = (status, message) => {
  const normalized = (message || '').toLowerCase();
  return status === 401 || status === 403 || normalized.includes('token inválido') || normalized.includes('token invalido');
};

const forceLoginByInvalidToken = () => {
  localStorage.removeItem('token');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        if (shouldLogoutByAuthError(response.status, message)) {
          forceLoginByInvalidToken();
        }
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } catch (error) {
      console.error("Error en GET:", error);
      throw error;
    }
  },

  
  post: async (endpoint, body) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        if (shouldLogoutByAuthError(response.status, message)) {
          forceLoginByInvalidToken();
        }
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("Error en POST:", error);
      throw error;
    }
  }
};