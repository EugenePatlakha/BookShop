import { useParams, useNavigate } from 'react-router-dom';

import BookDetail from './BookDetail';

const BookDetailWrapper = ({ books, currentUser, onAddToCart, openLoginModal }) => {
    const { id } = useParams();
    const book = books.find((b) => b.bookId === parseInt(id, 10));

    const navigate = useNavigate();

    if (!book) return <div>Book not found</div>;

    return (
        <BookDetail
            book={book}
            goBackToList={() => navigate('/')}
            openLoginModal={openLoginModal}
            currentUser={currentUser}
            onAddToCart={onAddToCart}
        />
    );
};

export default BookDetailWrapper;