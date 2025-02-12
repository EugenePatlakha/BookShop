const express = require('express');
const { BookController, upload } = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', BookController.getAllBooks);

router.get('/:id', BookController.getBookById);

router.post('/', upload.single('image'),  authMiddleware, BookController.addBook);

module.exports = router;
