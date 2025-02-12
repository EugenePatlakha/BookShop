const AuthorModel = require('../models/authorModel');

class AuthorController {
    static async getAllAuthors(req, res) {
        try {
            const authors = await AuthorModel.getAllAuthors();
            res.json(authors);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addAuthor(req, res) {
        const { authorName } = req.body;
        if (!authorName) {
            return res.status(400).json({ error: 'Author name is required' });
        }

        try {
            await AuthorModel.addAuthor(authorName);
            res.status(201).json({ message: 'Author added successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = AuthorController;
