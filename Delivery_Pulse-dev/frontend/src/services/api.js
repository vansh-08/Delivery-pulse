import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: sends cookies with requests
});

// DSR API calls
export const dsrAPI = {
  create: async (data) => {
    const response = await api.post('/dsrs', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/dsrs');
    return response.data;
  },

  getDSRsByEmployee: async () => {
    const response = await api.get('/dsrs/employee');
    return response.data;
  },

    getMyDSRs: async () => {
    const response = await api.get('/dsrs/my');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/dsrs/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/dsrs/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/dsrs/${id}`);
    return response.data;
  },
};

// Project API calls
export const projectAPI = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  getMyProjects: async () => {
    const response = await api.get('/projects/my-projects');
    return response.data;
  },
};

// Employee API calls
export const employeeAPI = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },
};

// Auth API calls
export const authAPI = {
  getUser: async () => {
    const response = await axios.get('http://localhost:3000/auth/user', {
      withCredentials: true
    });
    return response.data;
  },
  
  logout: async () => {
    window.location.href = 'http://localhost:3000/auth/logout';
  }
};

export default api;
