const express = require('express');
const router = express.Router();
const { universalSearch } = require('../controllers/searchController');

// Universal Search Route
router.get('/', universalSearch);

module.exports = router;