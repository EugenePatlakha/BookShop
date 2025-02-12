const { sql, poolPromise } = require('../config/db');

class UserModel {
    static async addUser({ firstName, lastName, email, passwordHash }) {
        const pool = await poolPromise;
        await pool.request()
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('email', sql.NVarChar, email)
            .input('passwordHash', sql.NVarChar, passwordHash)
            .query(`
                INSERT INTO Users (firstName, lastName, email, passwordHash)
                VALUES (@firstName, @lastName, @email, @passwordHash)
            `);
    }

    static async getUserByEmail(email) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`
                SELECT * FROM Users WHERE email = @email
            `);
        return result.recordset[0];
    }
}

module.exports = UserModel;
