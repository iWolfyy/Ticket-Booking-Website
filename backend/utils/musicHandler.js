const axios = require('axios');

exports.fetchArtistImage = async (mbid) => {
    try {
        const API_KEY = process.env.FANART_API_KEY; 
        if (!API_KEY) return null;

        const response = await axios.get(`https://webservice.fanart.tv/v3/music/${mbid}`, {
            params: { api_key: API_KEY }
        });

        // Priority: 1. Background (1080p) -> 2. Thumb -> 3. Banner
        return response.data.artistbackground?.[0]?.url || 
               response.data.artistthumb?.[0]?.url || 
               response.data.musicbanner?.[0]?.url || "";
    } catch (error) {
        console.error("Fanart.tv Error:", error.message);
        return null;
    }
};

exports.fetchArtistDetails = async (artistName) => {
    try {
        const API_KEY = process.env.LASTFM_API_KEY;
        const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

        const infoRes = await axios.get(BASE_URL, {
            params: { method: 'artist.getinfo', artist: artistName, api_key: API_KEY, format: 'json' }
        });

        const artistInfo = infoRes.data.artist;
        const mbid = artistInfo?.mbid;

        // Fetch Discography
        const albumRes = await axios.get(BASE_URL, {
            params: { method: 'artist.gettopalbums', artist: artistName, api_key: API_KEY, limit: 8, format: 'json' }
        });

        // GET HIGH-RES IMAGE FROM FANART.TV
        let highResImage = "";
        if (mbid) {
            highResImage = await exports.fetchArtistImage(mbid);
        }

        const albums = albumRes.data.topalbums.album || [];

        return {
            description: artistInfo?.bio?.summary?.split('<a href')[0] || "",
            // Use Fanart image if found, otherwise fallback to Last.fm XL image
            bannerImage: highResImage || artistInfo?.image[3]['#text'] || "",
            discography: albums.map(alb => ({
                title: alb.name,
                image: alb.image[3]['#text'] || alb.image[2]['#text'],
                year: "N/A"
            }))
        };
    } catch (error) {
        console.error("Music Fetch Error:", error.message);
        return null;
    }
};