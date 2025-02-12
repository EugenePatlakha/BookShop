const express = require('express');
const CartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, CartController.getCart);

router.post('/add', authMiddleware, CartController.addToCart);
router.post('/remove', authMiddleware, CartController.removeFromCart);
router.post('/update', authMiddleware, CartController.updateCartItem);


module.exports = router;
