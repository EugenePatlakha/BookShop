import React from 'react';
import '../styles/Notification.css';

const OrderNotification = ({ visible, message }) => {
    return (
        visible && (
            <div className="notification">
                <p>{message}</p>
            </div>
        )
    );
};

export default OrderNotification;
