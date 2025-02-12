const { sql, poolPromise } = require('../config/db');

class BookModel {
    static async getAllBooks() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                Books.bookId,
                Books.bookTitle,
                Books.price,
                Books.image,
                Genres.genreName,
                Authors.authorName,
                Books.description
            FROM Books
            INNER JOIN Genres ON Books.genre = Genres.genreId
            INNER JOIN Authors ON Books.author = Authors.authorId
        `);
        return result.recordset;
    }

    static async getBookById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    Books.bookId,
                    Books.bookTitle,
                    Books.price,
                    Books.image,
                    Genres.genreName,
                    Authors.authorName,
                    Books.description
                FROM Books
                INNER JOIN Genres ON Books.genre = Genres.genreId
                INNER JOIN Authors ON Books.author = Authors.authorId
                WHERE Books.bookId = @id
            `);
        return result.recordset[0];
    }
    

    static async addBook({ bookTitle, genre, author, price, image, description }) {
        const pool = await poolPromise;
        await pool.request()
            .input('bookTitle', sql.NVarChar, bookTitle)
            .input('genre', sql.Int, genre)
            .input('author', sql.Int, author)
            .input('price', sql.Decimal(10, 2), price)
            .input('description', sql.NVarChar, description)
            .input('image', sql.VarBinary, image)
            .query(`
                INSERT INTO Books (bookTitle, genre, author, price, description, image)
                VALUES (@bookTitle, @genre, @author, @price, @description, @image)
            `);
    }
}    

module.exports = BookModel;
