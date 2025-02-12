import React from 'react';
import '../styles/Notification.css';

const CartNotification = ({ visible, count, total, onCheckout }) => {
    return (
        visible && (
            <div className="notification">
                <p>Item added to cart</p>
                <p>Items in cart: {count}</p>
                <p>Total: ${total.toFixed(2)}</p>
                <button className="notification-button" onClick={onCheckout}>Proceed to Checkout</button>
            </div>
        )
    );
};


export default CartNotification;
