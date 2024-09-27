import axios from 'axios';

const API_BASE_URL = 'http://localhost:80/api';


const token = localStorage.getItem('token'); 
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}


const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data; 
    } catch (error) {
      throw error.response.data; 
    }
  },
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data; 
    } catch (error) {
      throw error.response.data; 
    }
  },
  getClients: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clientes`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  addClient: async (clientData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/clientes`, clientData);
      return response.data; 
    } catch (error) {
      throw error.response.data; 
    }
  },
  deleteClient: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/clientes/${id}`);
    } catch (error) {
      throw error.response.data; 
    }
  },
  updateClient: async (clientData) => {
    const response = await axios.put(`${API_BASE_URL}/clientes/${clientData.id}`, clientData);
    return response.data;
  },
  
  getEstados: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/estados`);
      return response.data; 
    } catch (error) {
      throw error.response.data; 
    }
  },
  
 
  getCidades: async (estadoId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/estados/${estadoId}/cidades`);
      return response.data; 
    } catch (error) {
      throw error.response.data; 
    }
  }
};

export default authService; 
