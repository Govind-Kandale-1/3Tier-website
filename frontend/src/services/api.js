import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const employeeAPI = {
  // Get all employees
  getAll: () => api.get('/employees'),
  
  // Get single employee
  getById: (id) => api.get(`/employees/${id}`),
  
  // Create employee
  create: (data) => api.post('/employees', data),
  
  // Update employee
  update: (id, data) => api.put(`/employees/${id}`, data),
  
  // Delete employee
  delete: (id) => api.delete(`/employees/${id}`)
};

export default api;
