const fetch = require('node-fetch'); // Use require for CommonJS

const API_BASE_URL = 'https://api.themoviedb.org/3/movie';

const endpoints = {
    playing: 'now_playing',
    popular: 'popular',
    top: 'top_rated',
    upcoming: 'upcoming'
};

async function fetchMovies(type, apiKey) {
    const endpoint = endpoints[type];
    if (!endpoint) {
        throw new Error(`Invalid movie type specified: ${type}`);
    }

    const url = `${API_BASE_URL}/${endpoint}?api_key=${apiKey}&language=en-US&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
            // Authorization header is not needed when using api_key query param
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Attempt to get more specific error from TMDB response body
            let errorBody = {};
            try {
                errorBody = await response.json();
            } catch (e) { /* ignore json parsing error */ }
            const statusMessage = errorBody.status_message || response.statusText;
            throw new Error(`API request failed: ${response.status} ${statusMessage}`);
        }
        const data = await response.json();
        return data.results || []; // Return results array or empty array if missing
    } catch (error) {
        // Re-throw network errors or errors from the API response handling
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
}

module.exports = { fetchMovies };
