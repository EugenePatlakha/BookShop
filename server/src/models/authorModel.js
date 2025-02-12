const { poolPromise } = require('../config/db');

class AuthorModel {
    static async getAllAuthors() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Authors');
        return result.recordset;
    }

    static async addAuthor(authorName) {
        const pool = await poolPromise;
        await pool.request()
            .input('authorName', authorName)
            .query('INSERT INTO Authors (authorName) VALUES (@authorName)');
    }
}

module.exports = AuthorModel;
