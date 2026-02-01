import { useState, useEffect } from 'react';
import axios from 'axios';

export const useEvents = (category = null) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // If category is provided, fetch specific events, otherwise fetch featured
        const baseUrl = 'http://localhost:5000/api/events';
        const url = category 
          ? `${baseUrl}?category=${category}` 
          : `${baseUrl}/featured`;

        const { data } = await axios.get(url);
        setEvents(data);
        setLoading(false);

        // Simulated delay
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [category]);

  return { events, loading };
};