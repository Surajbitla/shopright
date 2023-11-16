// OrderHistory.js
import React, { useState } from 'react';
import './OrderHistory.css'; // Make sure to create and import your CSS file
import Navbar from "../Navbar/Navbar";

const OrderHistory = () => {
    const orders = [
        {
            id: 1,
            orderNumber: 'Order #12345',
            productName: 'Product A',
            productImage: 'images/1.jpg',
            status: 'Shipped',
            progress: 50,
            price: '$29.99',
            orderedDate: '2023-01-01',
            processedDate: '2023-01-02',
            shippedDate: '2023-01-03',
            outForDeliveryDate: '',
            deliveredDate: ''
        },
        {
            id: 2,
            orderNumber: 'Order #12346',
            productName: 'Product B',
            productImage: 'images/2.jpg', // Replace with actual image path
            status: 'Delivered',
            progress: 100,
            price: '$19.99',
            orderedDate: '2023-01-01',
            processedDate: '2023-01-02',
            shippedDate: '2023-01-03',
            outForDeliveryDate: '2023-01-04',
            deliveredDate: '2023-01-04'
        },
        {
            id: 3,
            orderNumber: 'Order #12347',
            productName: 'Product C',
            productImage: 'images/1.jpg', // Replace with actual image path
            status: 'Processed',
            progress: 30,
            price: '$39.99',
            orderedDate: '2023-01-01',
            processedDate: '2023-01-02',
            shippedDate: '',
            outForDeliveryDate: '',
            deliveredDate: ''
        },
        {
            id: 4,
            orderNumber: 'Order #12348',
            productName: 'Product D',
            productImage: 'images/4.jpg', // Replace with actual image path
            status: 'Processed',
            progress: 30,
            price: '$49.99',
            orderedDate: '2023-01-01',
            processedDate: '2023-01-02',
            shippedDate: '',
            outForDeliveryDate: '',
            deliveredDate: ''
        },
        {
            id: 5,
            orderNumber: 'Order #12349',
            productName: 'Product E',
            productImage: 'images/5.jpg', // Replace with actual image path
            status: 'Processed',
            progress: 30,
            price: '$24.99',
            orderedDate: '2023-01-01',
            processedDate: '2023-01-02',
            shippedDate: '',
            outForDeliveryDate: '',
            deliveredDate: ''
        },
        // ... more orders
    ];
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const toggleOrder = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null); // Collapse if the same order is clicked again
        } else {
            setExpandedOrderId(orderId); // Expand the clicked order
        }
    };

    const [filters, setFilters] = useState({
        search: '',
        date: '',
        status: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleApplyFilters = () => {
        let filteredOrders = [...orders];

        // Filter by search text (product name or order number)
        if (filters.search) {
            filteredOrders = filteredOrders.filter(order =>
                order.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.orderNumber.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Filter by date
        // This assumes you have a 'date' field in your order object in YYYY-MM-DD format
        if (filters.date) {
            filteredOrders = filteredOrders.filter(order =>
                order.date === filters.date
            );
        }

        // Filter by status
        if (filters.status) {
            filteredOrders = filteredOrders.filter(order =>
                order.status === filters.status
            );
        }

        // Update the orders state to reflect the filtered orders
        // Assuming you have a state to store the filtered orders
        setFilteredOrders(filteredOrders);
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            date: '',
            status: '',
        });
        setFilteredOrders(orders); // Resetting the filtered orders to the original list
    };

    return (
        <>
            <Navbar />
            <div className="login-background">
                <div className="title">
                    <h2>My Orders</h2>
                </div>
            </div>
            <div className="order-history-container">
                {/* Left section for filters */}
                <div className="filters-section">
                    {/* Add your filters here */}
                    <h3>Filters</h3>
                    {/* Filter by Search */}
                    <div className="filter-option">
                        <label className="filter-label">Search:</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </div>
                    {/* Filter by Date */}
                    <div className="filter-option">
                        <label className="filter-label">Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </div>
                    {/* Filter by Status */}
                    <div className="filter-option">
                        <label className="filter-label">Status:</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="filter-input"
                        >
                            <option value="">All</option>
                            <option value="Ordered">Ordered</option>
                            <option value="Processed">Processed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    {/* Apply Filters Button */}
                    <button className="apply-button" onClick={handleApplyFilters}>
                        Apply Filters
                    </button>
                    <button className="clear-button" onClick={handleClearFilters}>
                        Clear Filters
                    </button>
                </div>

                {/* Right section for orders */}
                <div className="orders-section">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className={`order-item ${expandedOrderId === order.id ? 'expanded' : ''}`} onClick={() => toggleOrder(order.id)}>
                            <img src={order.productImage} alt={order.productName} className="product-image" />
                            <div className="order-details">
                                <p className="product-name">{order.productName}</p>
                                <div className="order-info">
                                    <span className="order-id">{order.orderNumber}</span>
                                    <span className="order-price">{order.price}</span>
                                </div>
                                <div className="status">{order.status}</div>
                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div className="progress-bar-completed" style={{ width: `${order.progress}%` }}></div>
                                    </div>
                                    <div className="progress-stages">
                                        <div className="progress-stage left">Ordered</div>
                                        <div className="progress-stage">Processed</div>
                                        <div className="progress-stage">Shipped</div>
                                        <div className="progress-stage">Out for Delivery</div>
                                        <div className="progress-stage right">Delivered</div>
                                    </div>
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className="order-details-flex">
                                        <div className="status-details">
                                            <p>Ordered</p>
                                            <p>Processed</p>
                                            <p>Shipped</p>
                                            <p>Out for Delivery</p>
                                            <p>Delivered</p>
                                        </div>
                                        <div className="date-details">
                                            <p>{order.orderedDate}</p>
                                            <p>{order.processedDate}</p>
                                            <p>{order.shippedDate}</p>
                                            <p>{order.outForDeliveryDate}</p>
                                            <p>{order.deliveredDate}</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default OrderHistory;
