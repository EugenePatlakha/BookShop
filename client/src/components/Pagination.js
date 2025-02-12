import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({ booksPerPage, totalBooks, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="pagination-container">
            <ul className="pagination">
                <li
                    className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                >
                    &lt;
                </li>
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={`page-item ${currentPage === number ? 'active' : ''}`}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </li>
                ))}
                <li
                    className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}
                    onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
                >
                    &gt;
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
