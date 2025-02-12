const { poolPromise } = require('../config/db');

class GenreModel {
    static async getAllGenres() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Genres');
        return result.recordset;
    }

    static async addGenre(genreName) {
        const pool = await poolPromise;
        await pool.request()
            .input('genreName', genreName)
            .query('INSERT INTO Genres (genreName) VALUES (@genreName)');
    }
}

module.exports = GenreModel;
