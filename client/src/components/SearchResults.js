import React from 'react';
import '../styles/SearchResults.css';

const SearchResults = ({ searchResults, onBookClick }) => {
    if (!searchResults || searchResults.length === 0) return null;

    return (
        <div className="search-results" onMouseDown={(e) => e.preventDefault()}>
            {searchResults.map((book) => (
                <div
                    className="search-result-item"
                    key={book.bookId}
                    onClick={() => onBookClick(book.bookId)}
                >
                    <img
                        src={book.image}
                        className="search-result-image"
                    />
                    <div className="search-result-details">
                        <p className="search-result-title">{book.bookTitle}</p>
                        <p className="search-result-author">{book.authorName}</p>
                        <p className="search-result-price">${book.price.toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;
