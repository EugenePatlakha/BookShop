import React, { useState } from 'react';
import '../styles/Modal.css';

const AuthorModal = ({ onClose, onAdd }) => {
    const [authorName, setAuthorName] = useState('');
    const [error, setError] = useState('');

    const resetFields = () => setAuthorName('');

    const validateFields = () => {
        if (!authorName.trim()) {
            setError('Author name is required');
            return false;
        }
        return true;
    };

    const handleAddAuthor = async () => {
        if (!validateFields()) return;

        const result = await onAdd(authorName);
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
                <h2>Add Author</h2>
                {error && <p className="modal-error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Author Name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    onFocus={() => setError('')}
                />
                <button className="modal-button" onClick={handleAddAuthor}>Submit</button>
            </div>
        </div>
    );
};

export default AuthorModal;
