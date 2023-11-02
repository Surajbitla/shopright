import React, { useState } from 'react';
import Filters from './Filters';
import ProductList from './ProductList';
import Pagination from './Pagination';
import './Products.css';
import productData from './data.json'; // Make sure the path to your JSON file is correct
import Navbar from "../Navbar/Navbar";
import AutoScrollProducts from './AutoScrollProducts';


function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);
  const [sortCriteria, setSortCriteria] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchTerm, setSearchTerm] = useState('');
  const noproductsUrl = `${process.env.PUBLIC_URL}/${'images/nodatafound.png'}`;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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

  const filteredProducts = productData
    .filter(product => 
      product.price >= minPrice && 
      product.price <= maxPrice &&
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const hasProducts = currentProducts.length > 0;

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  

  const topProducts = productData.slice(0, 4); // Assuming you want to rotate through the first 4 products

  return (
    <>
      <Navbar />
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
            <AutoScrollProducts products={productData} />
          <div className="search-sort-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="sort-by-container">
              <label htmlFor="sort-by">Sort by: </label>
              <select id="sort-by" value={sortCriteria} onChange={handleSortChange}>
                <option value="default">Default</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              <button onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? '▲' : '▼'}
              </button>
            </div>
          </div>
          {hasProducts ? (
            <ProductList products={currentProducts} />
          ) : (
            <div className="no-products"><img src={noproductsUrl} alt="No products found" /></div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
        </main>
      </div>
    </>
  );
}

export default Products;
