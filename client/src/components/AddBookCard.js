import React from 'react';
import '../styles/BookCard.css';

const AddBookCard = ({ onClick }) => {
    return (
        <div className="book-card add-book-card" onClick={onClick}>
            <div className="add-icon">+</div>
        </div>
    );
};

export default AddBookCard;
