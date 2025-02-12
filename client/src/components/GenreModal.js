import React, { useState } from 'react';
import '../styles/Modal.css';

const GenreModal = ({ onClose, onAdd }) => {
    const [genreName, setGenreName] = useState('');
    const [error, setError] = useState('');

    const resetFields = () => setGenreName('');

    const validateFields = () => {
        if (!genreName.trim()) {
            setError('Genre name is required');
            return false;
        }
        return true;
    };

    const handleAddGenre = async () => {
        if (!validateFields()) return;

        const result = await onAdd(genreName);
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
                <h2>Add Genre</h2>
                {error && <p className="modal-error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Genre Name"
                    value={genreName}
                    onChange={(e) => setGenreName(e.target.value)}
                    onFocus={() => setError('')}
                />
                <button className="modal-button" onClick={handleAddGenre}>Submit</button>
            </div>
        </div>
    );
};

export default GenreModal;
