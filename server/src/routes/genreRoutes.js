const express = require('express');
const GenreController = require('../controllers/genreController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', GenreController.getAllGenres);

router.post('/', authMiddleware, GenreController.addGenre);

module.exports = router;
