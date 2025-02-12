import React from 'react';
import '../styles/BookCard.css';

const BookCard = ({ book, onClick, openLoginModal, currentUser, onAddToCart }) => {
    
    const handleBuyClick = (e) => {
        e.stopPropagation();
        if (!currentUser) {
            openLoginModal();
        } else {
            onAddToCart(book);
        }
    };


    return (
        <div className="book-card" onClick={onClick}>
            <img
                src={book.image}
                className="book-image-card" 
            />
            <h4 className="book-title">{book.bookTitle}</h4>
            <p className="book-author">{book.authorName}</p>
            <p className="book-price">${book.price}</p>
            <button className="buy-button-book-card" onClick={handleBuyClick}>Buy</button>
        </div>
    );
};

export default BookCard;
