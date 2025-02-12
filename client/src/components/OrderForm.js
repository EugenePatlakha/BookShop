import React, { useState, useEffect } from 'react';
import '../styles/OrderForm.css';

const OrderForm = ({ cartItems, total, updateCart, removeFromCart, placeOrder }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+380');
    const [country, setCountry] = useState('Ukraine');
    const [city, setCity] = useState('');
    const [comments, setComments] = useState('');
    const [error, setError] = useState('');
    const [localQuantities, setLocalQuantities] = useState(
        cartItems.reduce((acc, item) => {
            acc[item.bookId] = item.quantity;
            return acc;
        }, {})
    );

    useEffect(() => {
        const updatedQuantities = cartItems.reduce((acc, item) => {
            acc[item.bookId] = item.quantity;
            return acc;
        }, {});
        setLocalQuantities(updatedQuantities);
    }, [cartItems]);

    const validateFields = () => {
        if (!firstName.trim()) {
            setError('First Name is required');
            return false;
        }
        if (!lastName.trim()) {
            setError('Last Name is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return false;
        }
        if (!phoneNumber.startsWith('+380') || phoneNumber.length !== 13) {
            setError('Phone number must start with +380 and be 13 characters long');
            return false;
        }
        if (!city || city === 'Select your city') {
            setError('City is required');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateFields()) return;

        const orderData = {
            firstName,
            lastName,
            phoneNumber,
            email,
            country,
            city,
            comments,
        };

        const result = await placeOrder(orderData);
        if (result.success) {
            setError('');
        } else {
            setError(result.error || 'An unexpected error occurred');
        }
    };

    const handlePhoneChange = (e) => {
        const input = e.target.value.replace(/\D/g, '');
        if (input.startsWith('380')) {
            setPhoneNumber('+' + input);
        }
    };

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
                [bookId]: cartItems.find((item) => item.bookId === bookId).quantity,
            }));
        } else {
            updateCart(bookId, Number(value));
        }
    };

    return (
        <div className="order-form-container">
            <div className="order-form-left">
                <h1 className="order-form-header">Checkout</h1>
                {error && <p className="checkout-error-message">{error}</p>}
                <div className="order-section">
                    <h3>Contact Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                onFocus={() => setError('')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                onFocus={() => setError('')}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                maxLength="13"
                                placeholder="Enter your phone"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                onFocus={() => setError('')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setError('')}
                            />
                        </div>
                    </div>
                </div>
                <div className="order-section">
                    <h3>Shipping Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Country *</label>
                            <select disabled value={country} onFocus={() => setError('')}>
                                <option>Ukraine</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>City *</label>
                            <select value={city} onChange={(e) => setCity(e.target.value)} onFocus={() => setError('')}>
                                <option>Select your city</option>
                                <option>Kyiv</option>
                                <option>Lviv</option>
                                <option>Odesa</option>
                                <option>Dnipro</option>
                                <option>Kharkiv</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Order Comments</label>
                        <textarea
                            placeholder="Enter your comment..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            onFocus={() => setError('')}
                        />
                    </div>
                </div>
            </div>
            <div className="order-form-right">
                <h3>Your Order</h3>
                <div className="order-items">
                    {cartItems.map((item) => (
                        <div className="order-item" key={item.bookId}>
                            <img src={item.image} className="order-item-image" alt="Book Cover" />
                            <div className="order-item-details">
                                <p className="order-item-title">{item.bookTitle}</p>
                                <p className="order-item-author">{item.author}</p>
                                <p className="order-item-price">${item.price}</p>
                            </div>
                            <div className="order-item-controls">
                                <input
                                    type="number"
                                    value={localQuantities[item.bookId] || ''}
                                    onChange={(e) =>
                                        handleInputChange(item.bookId, e.target.value)
                                    }
                                    onBlur={() => handleBlurOrEnter(item.bookId)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleBlurOrEnter(item.bookId);
                                    }}
                                />
                                <button onClick={() => removeFromCart(item.bookId)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-summary">
                    <p>Total: ${total.toFixed(2)}</p>
                    <button className="submit-order-button" onClick={handlePlaceOrder}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
