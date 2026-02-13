const axios = require('axios');

const fetchMovieFromTMDB = async (title) => {
    try {
        const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: { query: title, language: 'en-US' },
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                accept: 'application/json'
            }
        });

        if (searchResponse.data.results.length === 0) return null;
        const movieId = searchResponse.data.results[0].id;

        const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { append_to_response: 'credits,videos' },
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                accept: 'application/json'
            }
        });

        return detailsResponse.data;
    } catch (error) {
        console.error("TMDB Fetch Error:", error.message);
        return null;
    }
};

// --- SEARCH MOVIES IN FRONTEND---
const searchMovies = async (query) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: { query, language: 'en-US', page: 1 },
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                accept: 'application/json'
            }
        });
        return response.data; 
    } catch (error) {
        console.error("TMDB Search API Error:", error.message);
        return { results: [] };
    }
};

module.exports = { fetchMovieFromTMDB, searchMovies };