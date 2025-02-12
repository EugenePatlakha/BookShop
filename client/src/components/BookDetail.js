import React from 'react';
import '../styles/BookDetail.css';

const BookDetail = ({ book, openLoginModal, currentUser, onAddToCart }) => {
    
    const handleBuyClick = () => {
        if (!currentUser) {
            openLoginModal();
        } else {
            onAddToCart(book);
        }
    };

    return (
        <div className="book-detail">
            <div className="book-detail-content">
                <img
                    src={book.image}
                    className="book-detail-image"
                />
                <div className="book-info">
                    <h1>{book.bookTitle}</h1>
                    <p><strong>Author:</strong> {book.authorName}</p>
                    <p><strong>Genre:</strong> {book.genreName}</p>
                    <p><strong>Description:</strong></p>
                    {book.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                </div>
                <div className="book-buy-section">
                    <h2 className="book-detail-price">${book.price}</h2>
                    <button onClick={handleBuyClick} className="buy-detail-button">Buy</button>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
