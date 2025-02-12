const CartModel = require('../models/cartModel');

class CartController {
    static async getCart(req, res) {
        const userId = req.user.userId;
        try {
            let cart = await CartModel.getCartByUserId(userId);
            if (!cart) {
                cart = await CartModel.createCart(userId);
            }
            const items = await CartModel.getCartItems(cart.cartId);
            const itemsWithImages = items.map((item) => ({
                ...item,
                image: item.image
                    ? `data:image/png;base64,${Buffer.from(item.image).toString('base64')}`
                    : null,
            }));
            res.json({ cart, items: itemsWithImages });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addToCart(req, res) {
        const userId = req.user.userId;
        const { bookId, quantity } = req.body;
        try {
            let cart = await CartModel.getCartByUserId(userId);
            if (!cart) {
                cart = await CartModel.createCart(userId);
            }
            await CartModel.addItemToCart(cart.cartId, bookId, quantity);
            res.status(200).json({ message: 'Item added to cart' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async removeFromCart(req, res) {
        const { bookId } = req.body;
        const userId = req.user.userId;
        try {
            const cart = await CartModel.getCartByUserId(userId);
            await CartModel.removeItemFromCart(cart.cartId, bookId);
            res.status(200).json({ message: 'Item removed from cart' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    static async updateCartItem(req, res) {
        const { bookId, quantity } = req.body;
        const userId = req.user.userId;
        try {
            const cart = await CartModel.getCartByUserId(userId);
            if (quantity > 0) {
                await CartModel.updateItemQuantity(cart.cartId, bookId, quantity);
            } else {
                await CartModel.removeItemFromCart(cart.cartId, bookId);
            }
            res.status(200).json({ message: 'Cart updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
}

module.exports = CartController;
