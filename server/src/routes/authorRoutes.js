const express = require('express');
const AuthorController = require('../controllers/authorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', AuthorController.getAllAuthors);

router.post('/', authMiddleware, AuthorController.addAuthor);

module.exports = router;
