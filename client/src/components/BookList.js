import React from 'react';
import Pagination from './Pagination';
import BookCard from './BookCard';
import AddBookCard from './AddBookCard';
import FilterChips from './FilterChips';
import '../styles/BookList.css';

const BookList = ({ 
    books, 
    onBookClick, 
    totalBooks, 
    booksPerPage, 
    currentPage, 
    paginate, 
    onAddBookClick, 
    openLoginModal, 
    currentUser, 
    onAddToCart, 
    selectedGenre, 
    selectedAuthor, 
    clearGenreFilter, 
    clearAuthorFilter, 
    clearAllFilters 
}) => {
    const hasBooks = books.length > 0;

    return (
        <div className="book-list-container">
            <div className="top-controls">
                <div className="top-pagination-container">
                    <Pagination
                        booksPerPage={booksPerPage}
                        totalBooks={totalBooks}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </div>
                <FilterChips
                    selectedGenre={selectedGenre}
                    selectedAuthor={selectedAuthor}
                    onClearGenre={clearGenreFilter}
                    onClearAuthor={clearAuthorFilter}
                    onClearAll={clearAllFilters}
                />

                {!hasBooks && !currentUser?.isAdmin && (
                    <p className="no-books-message">No books found</p>
                )}
            </div>  

            <div className="book-list">
                {currentUser?.isAdmin ? (
                    <>
                        <AddBookCard onClick={onAddBookClick} />
                        {books.slice(0, booksPerPage - 1).map((book) => (
                            <BookCard
                                key={book.bookId}
                                book={book}
                                onClick={() => onBookClick(book.bookId)}
                                openLoginModal={openLoginModal}
                                currentUser={currentUser}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </>
                )
                    : books.map((book) => (
                        <BookCard
                            key={book.bookId}
                            book={book}
                            onClick={() => onBookClick(book.bookId)}
                            openLoginModal={openLoginModal}
                            currentUser={currentUser}
                            onAddToCart={onAddToCart}
                        />
                    ))
                }
            </div>
            <Pagination
                booksPerPage={booksPerPage}
                totalBooks={totalBooks}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default BookList;
