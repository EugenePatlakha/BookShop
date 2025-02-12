const { sql, poolPromise } = require('../config/db');

class OrderModel {
    static async createOrder({ userId, firstName, lastName, phoneNumber, email, country, city, comments }) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('firstName', sql.NVarChar(255), firstName)
            .input('lastName', sql.NVarChar(255), lastName)
            .input('phoneNumber', sql.NVarChar(20), phoneNumber)
            .input('email', sql.NVarChar(255), email)
            .input('country', sql.NVarChar(255), country)
            .input('city', sql.NVarChar(255), city)
            .input('comments', sql.NVarChar(sql.MAX), comments)
            .query(`
                INSERT INTO Orders (userId, firstName, lastName, phoneNumber, email, country, city, comments)
                OUTPUT INSERTED.orderId
                VALUES (@userId, @firstName, @lastName, @phoneNumber, @email, @country, @city, @comments)
            `);
        return result.recordset[0].orderId;
    }

    static async addOrderItem(orderId, bookId, quantity, price) {
        const pool = await poolPromise;
        await pool.request()
            .input('orderId', sql.Int, orderId)
            .input('bookId', sql.Int, bookId)
            .input('quantity', sql.Int, quantity)
            .input('price', sql.Decimal(10,2), price)
            .query(`
                INSERT INTO OrderItems (orderId, bookId, quantity, price)
                VALUES (@orderId, @bookId, @quantity, @price)
            `);
    }
}

module.exports = OrderModel;
