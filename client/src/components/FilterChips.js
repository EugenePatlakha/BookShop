import React from 'react';
import '../styles/FilterChips.css';

const FilterChips = ({ selectedGenre, selectedAuthor, onClearGenre, onClearAuthor, onClearAll }) => {
    if (!selectedGenre && !selectedAuthor) return null;

    return (
        <div className="filter-chips-container">
            <div className="filter-chip" onClick={onClearAll}>Clear</div>
            {selectedGenre && (
                <div className="filter-chip">
                    {selectedGenre} <span className="filter-chip-close" onClick={(e) => { e.stopPropagation(); onClearGenre(); }}>×</span>
                </div>
            )}
            {selectedAuthor && (
                <div className="filter-chip">
                    {selectedAuthor} <span className="filter-chip-close" onClick={(e) => { e.stopPropagation(); onClearAuthor(); }}>×</span>
                </div>
            )}
        </div>
    );
};

export default FilterChips;