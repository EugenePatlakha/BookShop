const BookModel = require('../models/bookModel');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

class BookController {
    static async getAllBooks(req, res) {
        try {
            const books = await BookModel.getAllBooks();
            const booksWithImages = books.map((book) => ({
                ...book,
                image: book.image ? `data:image/png;base64,${Buffer.from(book.image).toString('base64')}` : null,
            }));
            res.json(booksWithImages);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getBookById(req, res) {
        const { id } = req.params;
        try {
            const book = await BookModel.getBookById(id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addBook(req, res) {
        const { title, genreId, authorId, price, description } = req.body;
        if (!title || !genreId || !authorId || !price || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }
    
        try {
            const imageBuffer = req.file ? req.file.buffer : null;
    
            await BookModel.addBook({
                bookTitle: title,
                genre: parseInt(genreId),
                author: parseInt(authorId),
                price: parseFloat(price),
                description: description,
                image: imageBuffer,
            });
    
            res.status(201).json({ message: 'Book added successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = {
    BookController,
    upload
};
