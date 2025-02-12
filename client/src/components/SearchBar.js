import React, { useState, useRef } from 'react';
import SearchResults from './SearchResults';
import '../styles/SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery, onLoginClick, onLogout, currentUser, toggleCart, searchResults, onBookClick, resetToFirstPage }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleBookClick = (bookId) => {
        onBookClick(bookId);
        setSearchQuery('');
        setIsFocused(false);
        inputRef.current?.blur();
    };

    return (
        <div className="search-bar">
            <div className="search-container">
                <div className="logo" onClick={resetToFirstPage}>BookShop</div>
                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {searchQuery && searchResults.length > 0 && isFocused && (
                        <SearchResults
                            searchResults={searchResults}
                            onBookClick={handleBookClick}
                        />
                    )}
                </div>
            </div>
            {currentUser ? (
                <div className="user-info">
                    <button className="cart-button-search-bar" onClick={toggleCart}>Cart</button>
                    <span className="user-name">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
                    <button className="logout-button-search-bar" onClick={onLogout}>Logout</button>
                </div>
            ) : (
                <button className="login-button-search-bar" onClick={onLoginClick}>
                    Login
                </button>
            )}
        </div>
    );
};

export default SearchBar;
