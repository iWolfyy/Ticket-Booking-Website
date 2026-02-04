// frontend/src/services/eventService.js
import apiClient from '@/lib/axios';

export const eventService = {
  getFeatured: async () => {
    const { data } = await apiClient.get('/events?isFeatured=true');
    return data; // Your controller now returns the array directly
  },
  getMovies: async () => {
    const { data } = await apiClient.get('/events?category=movie');
    return data;
  },
  getTheatre: async () => {
    const { data } = await apiClient.get('/events?category=theatre');
    return data;
  },
  getConcerts: async () => {
    const { data } = await apiClient.get('/events?category=concert');
    return data;
  },
  getSports: async () => {
    const { data } = await apiClient.get('/events?category=sports');
    return data;
  },
  getEventById: async (id) => {
    const { data } = await apiClient.get(`/events/${id}`);
    return data;
  },
};