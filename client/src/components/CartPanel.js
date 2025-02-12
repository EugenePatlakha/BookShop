import React, { useState, useEffect } from 'react';
import '../styles/CartPanel.css';

const CartPanel = ({ cartItems, total, onClose, updateCart, removeFromCart, onCheckout }) => {
    const [localQuantities, setLocalQuantities] = useState({});
    const [lastValidQuantities, setLastValidQuantities] = useState({});

    useEffect(() => {
        const initialQuantities = cartItems.reduce((acc, item) => {
            acc[item.bookId] = item.quantity;
            return acc;
        }, {});
        setLocalQuantities(initialQuantities);
        setLastValidQuantities(initialQuantities);
    }, [cartItems]);

    const handleInputChange = (bookId, value) => {
        setLocalQuantities((prev) => ({
            ...prev,
            [bookId]: value,
        }));
    };

    const handleBlurOrEnter = (bookId) => {
        const value = localQuantities[bookId];
        if (!value || isNaN(value) || Number(value) < 1) {
            setLocalQuantities((prev) => ({
                ...prev,
                [bookId]: lastValidQuantities[bookId],
            }));
        } else {
            const validValue = Number(value);
            setLastValidQuantities((prev) => ({
                ...prev,
                [bookId]: validValue,
            }));
            updateCart(bookId, validValue);
        }
    };

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-panel open" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-cart" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.cartItemId}>
                                <img
                                    src={item.image}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <p className="cart-item-title">{item.bookTitle}</p>
                                    <p className="cart-item-author">{item.authorName}</p>
                                    <p className="cart-item-price">${item.price}</p>
                                </div>
                                <div className="cart-item-controls">
                                    <input
                                        type="number"
                                        value={localQuantities[item.bookId] || ''}
                                        onChange={(e) => handleInputChange(item.bookId, e.target.value)}
                                        onBlur={() => handleBlurOrEnter(item.bookId)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleBlurOrEnter(item.bookId);
                                        }}
                                    />
                                    <button onClick={() => removeFromCart(item.bookId)}>Remove</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty</p>
                    )}
                </div>
                <div className="cart-footer">
                    <p>Total: ${total.toFixed(2)}</p>
                    <button className="checkout-button" onClick={onCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPanel;
