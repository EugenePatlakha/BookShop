const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');

class OrderController {
    static async createOrder(req, res) {
        const userId = req.user.userId;
        const { firstName, lastName, phoneNumber, email, country, city, comments } = req.body;

        if (!firstName || !firstName.trim()) {
            return res.status(400).json({ error: 'First Name is required' });
        }
        if (!lastName || !lastName.trim()) {
            return res.status(400).json({ error: 'Last Name is required' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (!phoneNumber || !phoneNumber.startsWith('+380') || phoneNumber.length !== 13) {
            return res.status(400).json({ error: 'Phone number must start with +380 and be 13 characters long' });
        }

        if (!country || country !== 'Ukraine') {
            return res.status(400).json({ error: 'Invalid country selected' });
        }

        if (!city || city === 'Select your city') {
            return res.status(400).json({ error: 'City is required' });
        }

        try {
            let cart = await CartModel.getCartByUserId(userId);
            if (!cart) {
                return res.status(400).json({ error: 'No cart found for user' });
            }

            const cartItems = await CartModel.getCartItems(cart.cartId);
            if (cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const orderId = await OrderModel.createOrder({
                userId,
                firstName,
                lastName,
                phoneNumber,
                email,
                country,
                city,
                comments
            });

            for (const item of cartItems) {
                await OrderModel.addOrderItem(orderId, item.bookId, item.quantity, item.price);
            }

            await CartModel.clearCart(cart.cartId);

            res.json({ message: 'Order created successfully', orderId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = OrderController;
