import apiClient from '@/lib/axios';
import { MOCK_EVENTS } from '@/data/mockdata'; // Ensure filename matches exactly

const fetchWithFallback = async (endpoint, mockKey) => {
  try {
    const { data } = await apiClient.get(endpoint);
    // If backend returns valid array, use it. Otherwise, fallback to mock.
    if (data && Array.isArray(data) && data.length > 0) return data;
    return MOCK_EVENTS[mockKey] || [];
  } catch (error) {
    console.warn(`Fetch failed for ${endpoint}, using mock data.`);
    return MOCK_EVENTS[mockKey] || [];
  }
};

export const eventService = {
  getFeatured: () => fetchWithFallback('/events/featured', 'featured'),
  getMovies: () => fetchWithFallback('/events/movies', 'movies'),
  getTheatre: () => fetchWithFallback('/events/theatre', 'theatre'),
  getConcerts: () => fetchWithFallback('/events/concerts', 'concerts'),
  getSports: () => fetchWithFallback('/events/sports', 'sports'),
};