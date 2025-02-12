const { sql, poolPromise } = require('../config/db');

class CartModel {
    static async getCartByUserId(userId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT * FROM Carts WHERE userId = @userId
            `);
        return result.recordset[0];
    }

    static async createCart(userId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                INSERT INTO Carts (userId) OUTPUT INSERTED.cartId VALUES (@userId)
            `);
        return result.recordset[0];
    }

    static async addItemToCart(cartId, bookId, quantity = 1) {
        const pool = await poolPromise;
        await pool.request()
            .input('cartId', sql.Int, cartId)
            .input('bookId', sql.Int, bookId)
            .input('quantity', sql.Int, quantity)
            .query(`
                MERGE CartItems AS target
                USING (SELECT @cartId AS cartId, @bookId AS bookId) AS source
                ON target.cartId = source.cartId AND target.bookId = source.bookId
                WHEN MATCHED THEN
                    UPDATE SET quantity = quantity + @quantity
                WHEN NOT MATCHED THEN
                    INSERT (cartId, bookId, quantity) VALUES (@cartId, @bookId, @quantity);
            `);
    }

    static async getCartItems(cartId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('cartId', sql.Int, cartId)
            .query(`
                SELECT 
                    ci.cartItemId,
                    ci.quantity,
                    b.bookId,
                    b.bookTitle,
                    b.price,
                    b.image,
                    a.authorName
                FROM CartItems ci
                JOIN Books b ON ci.bookId = b.bookId
                JOIN Authors a ON b.author = a.authorId
                WHERE ci.cartId = @cartId
            `);
        return result.recordset;
    }
    static async removeItemFromCart(cartId, bookId) {
        const pool = await poolPromise;
        await pool.request()
            .input('cartId', sql.Int, cartId)
            .input('bookId', sql.Int, bookId)
            .query(`DELETE FROM CartItems WHERE cartId = @cartId AND bookId = @bookId`);
    }
    
    static async updateItemQuantity(cartId, bookId, quantity) {
        const pool = await poolPromise;
        await pool.request()
            .input('cartId', sql.Int, cartId)
            .input('bookId', sql.Int, bookId)
            .input('quantity', sql.Int, quantity)
            .query(`UPDATE CartItems SET quantity = @quantity WHERE cartId = @cartId AND bookId = @bookId`);
    }

    static async clearCart(cartId) {
        const pool = await poolPromise;
        await pool.request()
            .input('cartId', sql.Int, cartId)
            .query(`
                DELETE FROM CartItems WHERE cartId = @cartId;
            `);
    }
}

module.exports = CartModel;
