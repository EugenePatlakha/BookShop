import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Routes, Route, useMatch, useLocation, useNavigate, Outlet, matchPath, useSearchParams } from 'react-router-dom';

import SearchBar from './SearchBar';
import SideBar from './SideBar';
import BookList from './BookList';
import BookDetailWrapper from './BookDetailWrapper';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import GenreModal from './GenreModal';
import AuthorModal from './AuthorModal';
import BookModal from './BookModal';
import CartNotification from './CartNotification';
import OrderNotification from './OrderNotification';
import CartPanel from './CartPanel';
import OrderForm from './OrderForm';
import Footer from './Footer';

import '../styles/BookStore.css';

const BookStore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [cartNotification, setCartNotification] = useState({ visible: false, count: 0, total: 0 });
    const [orderNotification, setOrderNotification] = useState({ visible: false });
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const hideNotificationTimeout = useRef(null);

    const location = useLocation();
    const state = location.state;

    const isMainPage = location.pathname === '/';
    const [searchParams, setSearchParams] = useSearchParams();

    const initialPage = isMainPage ? parseInt(searchParams.get('page') || '1', 10) : 1;
    const [currentPage, setCurrentPage] = useState(initialPage);

    const isBookDetail = useMatch('/books/:id');
    const isOrder = useMatch('/order');
    
    const booksPerPage = 12;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/books')
            .then((response) => {
                setBooks(response.data);
                setFilteredBooks(response.data);
            })
            .catch((error) => console.error('Error fetching books:', error));

        axios.get('/api/genres')
            .then((response) => setGenres(response.data))
            .catch((error) => console.error('Error fetching genres:', error));

        axios.get('/api/authors')
            .then((response) => setAuthors(response.data))
            .catch((error) => console.error('Error fetching authors:', error));
    }, []);

    useEffect(() => {
        let filtered = books;
    
        if (selectedGenre) {
            filtered = filtered.filter((book) => book.genreName === selectedGenre);
        }
    
        if (selectedAuthor) {
            filtered = filtered.filter((book) => book.authorName === selectedAuthor);
        }
    
        setFilteredBooks(filtered);
    }, [books, selectedGenre, selectedAuthor]);

    useEffect(() => {
        if (searchQuery) {
            setSearchResults(
                books.filter((book) =>
                    book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.authorName.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, books]);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                handleLogout();
            }
            return Promise.reject(error);
          }
        );
      
        return () => {
          axios.interceptors.response.eject(interceptor);
        };
      }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setCurrentUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => setCartNotification({
                visible: false,
                count: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
                total: response.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                items: response.data.items
            }))
            .catch((err) => console.error('Error fetching cart:', err));
        }
    }, [currentUser]);

    useEffect(() => {
        if (isOrder && cartNotification.items && cartNotification.items.length === 0) {
            navigate('/');
        }
    }, [cartNotification.items, isOrder, navigate]);

    useEffect(() => {
        if (isMainPage) {
            setSearchParams({ page: currentPage });
        }
    }, [currentPage, setSearchParams, isMainPage]);

    const handleGenreSelect = (genreName) => {
        setSelectedGenre(genreName);
        setCurrentPage(1);
        navigate('/');
    };

    const handleAuthorSelect = (authorName) => {
        setSelectedAuthor(authorName);
        setCurrentPage(1);
        navigate('/');
    };

    const clearGenreFilter = () => setSelectedGenre('');
    const clearAuthorFilter = () => setSelectedAuthor('');
    
    const clearAllFilters = () => {
        setSelectedGenre('');
        setSelectedAuthor('');
    };

    const handleLogin = async (userLoginData) => {
        try {
            const response = await axios.post('/api/users/login', userLoginData);
            const { token, user } = response.data;
    
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
    
            setCurrentUser({ firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin });
            navigate('/');
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const handleRegister = async (userRegisterData) => {
        try {
            const response = await axios.post('/api/users/register', userRegisterData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setCurrentUser(response.data.user);
            navigate('/');
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Registration failed'};
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/');
    };

    const handleAddGenre = async (genreName) => {
        try {
            await axios.post('/api/genres', { genreName }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const response = await axios.get('/api/genres');
            setGenres(response.data);
            navigate('/');
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Error adding genre' };
        }
    };
    

    const handleAddAuthor = async (authorName) => {
        try {
            await axios.post('/api/authors', { authorName }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const response = await axios.get('/api/authors');
            setAuthors(response.data);
            navigate('/');
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Error adding author' };
        }
    };

    const handleAddBook = async (formData) => {
        try {
            await axios.post('/api/books', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const response = await axios.get('/api/books');
            setBooks(response.data);
            navigate('/');
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Error adding book' };
        }
    };
    

    const handlePlaceOrder = async (orderData) => {
        try {
            await axios.post('/api/order/create', orderData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchCartData();

            setOrderNotification({ visible: true, message: 'Order placed successfully!' });

            if (hideNotificationTimeout.current) clearTimeout(hideNotificationTimeout.current);
            hideNotificationTimeout.current = setTimeout(() => {
                setOrderNotification({ visible: false });
            }, 4000);

            navigate('/');
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Error creating order'};
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const resetToFirstPage = () => {
        clearAllFilters();
        setCurrentPage(1);
        navigate('/');
    };

    const handleAddToCart = (book) => {
        axios.post('/api/cart/add', { bookId: book.bookId, quantity: 1 }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => {
            axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                setCartNotification({
                    visible: true,
                    count: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
                    total: response.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                    items: response.data.items
                });
            })
            .catch((err) => console.error('Error fetching updated cart:', err));

            if (hideNotificationTimeout.current) clearTimeout(hideNotificationTimeout.current);
            hideNotificationTimeout.current = setTimeout(() => {
                setCartNotification((prev) => ({ ...prev, visible: false }));
            }, 4000);
        })
        .catch((err) => console.error('Error adding to cart:', err));
    };
    
    const handleUpdateCart = (bookId, quantity) => {
        axios.post('/api/cart/update', { bookId, quantity }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => fetchCartData())
        .catch((err) => console.error('Error updating cart:', err));
    };
    
    const handleRemoveFromCart = (bookId) => {
        axios.post('/api/cart/remove', { bookId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(() => fetchCartData())
        .catch((err) => console.error('Error removing item:', err));
    };
    
    const fetchCartData = () => {
        axios.get('/api/cart', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => setCartNotification({
            count: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
            total: response.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            items: response.data.items
        }))
        .catch((err) => console.error('Error fetching cart:', err));
    };

    let showSidebar = true;

    if (isBookDetail || isOrder) {
        showSidebar = false;
    }

    if (state?.backgroundLocation) {
        const backgroundPath = state.backgroundLocation.pathname;
        const detailBackgroundMatch = matchPath('/books/:id', backgroundPath);
        const orderBackgroundMatch = matchPath('/order', backgroundPath);
        if (detailBackgroundMatch || orderBackgroundMatch) {
            showSidebar = false;
        }
    }

    return (
        <div className="bookstore-container">
          <Routes location={state?.backgroundLocation || location}>
            <Route
              path="/"
              element={
                <>
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onLoginClick={() => navigate('/login', { state: { backgroundLocation: location } })}
                    onLogout={handleLogout}
                    currentUser={currentUser}
                    toggleCart={() => navigate('/cart', { state: { backgroundLocation: location } })}
                    searchResults={searchResults}
                    onBookClick={(id) => navigate(`/books/${id}`)}
                    resetToFirstPage={resetToFirstPage}
                  />
                  <div className="main-content">
                    {showSidebar && (
                      <SideBar
                        genres={genres}
                        authors={authors}
                        onAddGenreClick={() => navigate('/add-genre', { state: { backgroundLocation: location } })}
                        onAddAuthorClick={() => navigate('/add-author', { state: { backgroundLocation: location } })}
                        currentUser={currentUser}
                        selectedGenre={selectedGenre}
                        selectedAuthor={selectedAuthor}
                        onGenreSelect={handleGenreSelect}
                        onAuthorSelect={handleAuthorSelect}
                      />
                    )}
                    <Outlet />
                  </div>
                  <CartNotification
                    visible={cartNotification.visible}
                    count={cartNotification.count}
                    total={cartNotification.total}
                    onCheckout={() => navigate('/order')}
                  />
                  <OrderNotification
                    visible={orderNotification.visible}
                    message={orderNotification.message}
                  />
                </>
              }
            >
              <Route
                index
                element={
                  <BookList
                    books={filteredBooks.slice(
                      (currentPage - 1) * booksPerPage,
                      currentPage * booksPerPage
                    )}
                    onBookClick={(id) => navigate(`/books/${id}`)}
                    totalBooks={filteredBooks.length}
                    booksPerPage={booksPerPage}
                    currentPage={currentPage}
                    paginate={paginate}
                    onAddBookClick={() => navigate('/add-book', { state: { backgroundLocation: location } })}
                    openLoginModal={() => navigate('/login', { state: { backgroundLocation: location } })}
                    currentUser={currentUser}
                    onAddToCart={handleAddToCart}
                    selectedGenre={selectedGenre}
                    selectedAuthor={selectedAuthor}
                    clearGenreFilter={clearGenreFilter}
                    clearAuthorFilter={clearAuthorFilter}
                    clearAllFilters={clearAllFilters}
                  />
                }
              />
              <Route
                path="books/:id"
                element={
                  <BookDetailWrapper
                    books={books}
                    currentUser={currentUser}
                    onAddToCart={handleAddToCart}
                    openLoginModal={() => navigate('/login', { state: { backgroundLocation: location } })}
                  />
                }
              />
              <Route
                path="order"
                element={
                  <OrderForm
                    cartItems={cartNotification.items || []}
                    total={cartNotification.total}
                    updateCart={handleUpdateCart}
                    removeFromCart={handleRemoveFromCart}
                    placeOrder={handlePlaceOrder}
                  />
                }
              />
            </Route>
          </Routes>
      
          {state?.backgroundLocation && (
            <Routes>
              <Route
                path="login"
                element={
                  <LoginModal
                    onClose={() => navigate(state.backgroundLocation)}
                    onRegister={() =>
                      navigate('/register', { state: { backgroundLocation: state.backgroundLocation } })
                    }
                    onLogin={handleLogin}
                  />
                }
              />
              <Route
                path="register"
                element={
                  <RegisterModal
                    onClose={() => navigate(state.backgroundLocation)}
                    onLogin={() =>
                      navigate('/login', { state: { backgroundLocation: state.backgroundLocation } })
                    }
                    onRegister={handleRegister}
                  />
                }
              />
              <Route
                path="add-genre"
                element={
                  currentUser && currentUser.isAdmin ? (
                    <GenreModal
                      onClose={() => navigate(state.backgroundLocation)}
                      onAdd={handleAddGenre}
                    />
                  ) : null
                }
              />
              <Route
                path="add-author"
                element={
                  currentUser && currentUser.isAdmin ? (
                    <AuthorModal
                      onClose={() => navigate(state.backgroundLocation)}
                      onAdd={handleAddAuthor}
                    />
                  ) : null
                }
              />
              <Route
                path="add-book"
                element={
                  currentUser && currentUser.isAdmin ? (
                    <BookModal
                      onClose={() => navigate(state.backgroundLocation)}
                      onAdd={handleAddBook}
                      genres={genres}
                      authors={authors}
                    />
                  ) : null
                }
              />
              <Route
                path="cart"
                element={
                  <CartPanel
                    cartItems={cartNotification.items || []}
                    total={cartNotification.total}
                    onClose={() => navigate(state.backgroundLocation)}
                    updateCart={handleUpdateCart}
                    removeFromCart={handleRemoveFromCart}
                    onCheckout={() => navigate('/order')}
                  />
                }
              />
            </Routes>
          )}
          <Footer />
        </div>
    );      
};

export default BookStore;