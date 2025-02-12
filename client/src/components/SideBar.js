import React, { useState, useEffect } from 'react';
import '../styles/SideBar.css';

const SideBar = ({ genres, authors, onAddGenreClick, onAddAuthorClick, currentUser, selectedGenre, selectedAuthor, onGenreSelect, onAuthorSelect }) => {
    const [localSelectedGenre, setLocalSelectedGenre] = useState(null);
    const [localSelectedAuthor, setLocalSelectedAuthor] = useState(null);
    const isAdmin = currentUser?.isAdmin;

    useEffect(() => {
        setLocalSelectedGenre(selectedGenre);
    }, [selectedGenre]);

    useEffect(() => {
        setLocalSelectedAuthor(selectedAuthor);
    }, [selectedAuthor]);

    return (
        <aside className="sidebar">
            <h3>
                Genres
                {isAdmin && (
                    <button className="add-btn-sidebar" onClick={onAddGenreClick}>+</button>
                )}
            </h3>
            <ul>
                {genres.map((genre) => (
                    <li
                        key={genre.genreId}
                        className={localSelectedGenre === genre.genreName ? 'selected' : ''}
                        onClick={() =>
                            selectedGenre === genre.genreName
                                ? onGenreSelect('')
                                : onGenreSelect(genre.genreName)
                        }
                    >
                        {genre.genreName}
                    </li>
                ))}
            </ul>

            <h3>
                Authors
                {isAdmin && (
                    <button className="add-btn-sidebar" onClick={onAddAuthorClick}>+</button>
                )}
            </h3>
            <ul>
                {authors.map((author) => (
                    <li
                        key={author.authorId}
                        className={localSelectedAuthor === author.authorName ? 'selected' : ''}
                        onClick={() =>
                            selectedAuthor === author.authorName
                                ? onAuthorSelect('')
                                : onAuthorSelect(author.authorName)
                        }
                    >
                        {author.authorName}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SideBar;
