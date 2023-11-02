import React from 'react';

function Filters({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }) {
  return (
    <div className="filters">
      <div className="filter-item">
        <label htmlFor="min-price">Min Price:</label>
        <input
          type="number"
          id="min-price"
          name="min-price"
          value={minPrice}
          onChange={onMinPriceChange}
          min="0"
        />
      </div>
      <div className="filter-item">
        <label htmlFor="max-price">Max Price:</label>
        <input
          type="number"
          id="max-price"
          name="max-price"
          value={maxPrice}
          onChange={onMaxPriceChange}
          min="0"
        />
      </div>
    </div>
  );
}

export default Filters;
