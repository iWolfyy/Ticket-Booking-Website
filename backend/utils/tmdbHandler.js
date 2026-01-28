const axios = require('axios');

const fetchMovieFromTMDB = async (title) => {
    try {
        // 1. Search for the movie to get the ID
        const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: { query: title, language: 'en-US' },
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                accept: 'application/json'
            }
        });

        if (searchResponse.data.results.length === 0) return null;

        const movieId = searchResponse.data.results[0].id;

        // 2. Fetch full details including credits
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

module.exports = { fetchMovieFromTMDB };