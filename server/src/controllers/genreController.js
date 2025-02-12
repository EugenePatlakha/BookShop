const GenreModel = require('../models/genreModel');

class GenreController {
    static async getAllGenres(req, res) {
        try {
            const genres = await GenreModel.getAllGenres();
            res.json(genres);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addGenre(req, res) {
        const { genreName } = req.body;
        if (!genreName) {
            return res.status(400).json({ error: 'Genre name is required' });
        }

        try {
            await GenreModel.addGenre(genreName);
            res.status(201).json({ message: 'Genre added successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = GenreController;
