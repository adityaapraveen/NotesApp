import axios from 'axios';
import { getToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => client.post('/register', data).then(r => r.data);
export const loginUser = (data) => client.post('/login', data).then(r => r.data);

// Notes CRUD
export const getNotes = (params) => client.get('/notes', { params }).then(r => r.data);
export const getNoteById = (id) => client.get(`/notes/${id}`).then(r => r.data);
export const createNote = (data) => client.post('/notes', data).then(r => r.data);
export const updateNote = (id, data) => client.put(`/notes/${id}`, data).then(r => r.data);
export const deleteNote = (id) => client.delete(`/notes/${id}`).then(r => r.data);

// Sharing
export const shareNote = (id, data) => client.post(`/notes/${id}/share`, data).then(r => r.data);

// Search
export const searchNotes = (q) => client.get('/search', { params: { q } }).then(r => r.data);

// Memory Graph
export const getMemoryGraph = () => client.get('/notes/graph').then(r => r.data);
export const rebuildNoteGraph = (id) => client.post(`/notes/${id}/graph/rebuild`).then(r => r.data);

// About / Info
export const getAbout = () => client.get('/about').then(r => r.data);
export const getOpenApiSpec = () => client.get('/openapi.json').then(r => r.data);
