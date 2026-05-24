import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

// Products
export const getProducts = (params = {}) =>
  api.get('/api/products', { params }).then(r => r.data);

export const getProduct = (id) =>
  api.get(`/api/products/${id}`).then(r => r.data);

// Prices
export const getPrices = (productId) =>
  api.get(`/api/prices/${productId}`).then(r => r.data);

// History
export const getHistory = (productId, range = '30D') =>
  api.get(`/api/history/${productId}`, { params: { range } }).then(r => r.data);

// Alerts
export const createAlert = (data) =>
  api.post('/api/alerts', data).then(r => r.data);

export const getAlerts = (email) =>
  api.get(`/api/alerts/${email}`).then(r => r.data);

export const deleteAlert = (id) =>
  api.delete(`/api/alerts/${id}`).then(r => r.data);

export default api;
