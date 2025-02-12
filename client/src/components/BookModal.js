import React, { useState } from 'react';
import '../styles/Modal.css';

const BookModal = ({ onClose, onAdd, genres, authors }) => {
    const [bookTitle, setBookTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState(''); 
    const [error, setError] = useState('');

    const resetFields = () => {
        setBookTitle('');
        setGenre('');
        setAuthor('');
        setPrice('');
        setImage(null);
        setDescription('');
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const validateFields = () => {
        if (!bookTitle.trim() || !genre || !author || !price || !description.trim()) {
            setError('All fields are required');
            return false;
        }
        if (isNaN(price) || parseFloat(price) <= 0) {
            setError('Price must be a positive number');
            return false;
        }
        return true;
    };

    const handleAddBook = async () => {
        if (!validateFields()) return;

        const formData = new FormData();
        formData.append('title', bookTitle);
        formData.append('genreId', genre);
        formData.append('authorId', author);
        formData.append('price', price);
        formData.append('description', description);
        if (image) formData.append('image', image);

        const result = await onAdd(formData);
        if (result.success) {
            resetFields();
            onClose();
        } else {
            setError(result.error || 'An unexpected error occurred');
        }
    };

    return (
        <div className="modal-overlay" onClick={() => { resetFields(); onClose(); }}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>Add Book</h2>
                {error && <p className="modal-error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Book Title"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    onFocus={() => setError('')}
                />
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    onFocus={() => setError('')}
                >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                        <option key={g.genreId} value={g.genreId}>
                            {g.genreName}
                        </option>
                    ))}
                </select>
                <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    onFocus={() => setError('')}
                >
                    <option value="">Select Author</option>
                    {authors.map((a) => (
                        <option key={a.authorId} value={a.authorId}>
                            {a.authorName}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onFocus={() => setError('')}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={() => setError('')}
                />
                <div className="file-input-container">
                    <label htmlFor="file-upload" className="file-upload-label">
                        Choose File
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        className="file-upload-input"
                        onChange={handleFileChange}
                    />
                    <span className="file-name">
                        {image ? image.name : 'No file chosen'}
                    </span>
                </div>
                <button className="modal-button" onClick={handleAddBook}>Submit</button>
            </div>
        </div>
    );
};

export default BookModal;
