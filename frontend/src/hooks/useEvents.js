import { useState, useEffect } from 'react';
import axios from 'axios';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Change this URL when your backend is ready
        // const { data } = await axios.get('http://localhost:5000/api/events/featured');
        // setEvents(data);

        // Simulated delay for testing loading states
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, loading };
};