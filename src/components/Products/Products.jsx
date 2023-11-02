import React, { useState } from 'react';
import Filters from './Filters';
import ProductList from './ProductList';
import Pagination from './Pagination';
import './Products.css';
import productData from './data.json'; // Make sure the path to your JSON file is correct

function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);
  const [sortCriteria, setSortCriteria] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending or 'desc' for descending

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Assuming 1000 is the max price in your product data
  // Sort the products based on the criteria and order

  const handleMinPriceChange = (event) => {
    const value = Math.max(0, parseInt(event.target.value, 10));
    if (value <= maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (event) => {
    const value = Math.max(minPrice, parseInt(event.target.value, 10));
    setMaxPrice(value);
  };

  const filteredProducts = productData.filter(product => product.price >= minPrice && product.price <= maxPrice);

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortCriteria === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortCriteria === 'name') {
      return sortOrder === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    return 0;
  });

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Function to handle sort change
  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  // Function to toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  return (
    <div className="products-layout">
      <aside className="filters-panel">
        <Filters
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
        />
      </aside>
      <main className="products-main">
        <div className="sorting-controls">
          <label htmlFor="sort-by">Sort by: </label>
          <select id="sort-by" value={sortCriteria} onChange={handleSortChange}>
            <option value="default">Default</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
          <button onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? '🔼' : '🔽'}
          </button>
        </div>
        <ProductList products={currentProducts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
      </main>
    </div>
  );
}

export default Products;
