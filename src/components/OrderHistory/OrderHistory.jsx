// OrderHistory.js
import React, { useState, useEffect } from 'react';
import './OrderHistory.css'; // Make sure to create and import your CSS file
import Navbar from "../Navbar/Navbar";
import axios from 'axios';
import config from '../../config';

const OrderHistory = () => {

    const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const TAX_RATE = 0.10; // 10% tax rate, adjust as needed

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
        let filtered = [...orders];
        if (filters.search) {
            filtered = filtered.filter(order =>
                order.product_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                `Order #${order.order_id}`.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.date) {
            filtered = filtered.filter(order => formatDate(order.order_date) === filters.date);
        }
        if (filters.status) {
            filtered = filtered.filter(order => order.status === filters.status);
        }
        setFilteredOrders(filtered);
    };

    const handleClearFilters = () => {
        setFilters({ search: '', date: '', status: '' });
        setFilteredOrders(orders);
    };

    const formatDate = (datetime) => {
        if (!datetime) return '';
        return datetime.split('T')[0];
    };

    const getProgressPercentage = (status) => {
        switch (status) {
            case 'Ordered':
                return 3;
            case 'Processed':
                return 30;
            case 'Shipped':
                return 50;
            case 'Out for Delivery':
                return 70;
            case 'Delivered':
                return 100;
            default:
                return 0;
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'Ordered':
                return 'Your order has been successfully placed and is now being prepared for processing.';
            case 'Processed':
                return 'Great news! Your order has been processed and is getting ready for dispatch.';
            case 'Shipped':
                return 'Your order is on the move! It has been shipped and is en route to its destination.';
            case 'Out for Delivery':
                return 'Almost there! Your package is out for delivery and will reach you soon.';
            case 'Delivered':
                return 'Your order has been delivered. We hope you enjoy your purchase!';
            default:
                return 'Your order status is currently being updated. Please check back soon for more details.';
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = JSON.parse(sessionStorage.getItem('user')).id;
                const response = await axios.get(`${apiUrl}/orders/${userId}`);
                setOrders(response.data);
                setFilteredOrders(response.data); // initially, filteredOrders is the same as orders
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Handle error appropriately
            }
        };

        fetchOrders();
    }, []);

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
                        <div key={`${order.order_id}-${order.order_item_id}`} className={`order-item ${expandedOrderId === order.order_id ? 'expanded' : ''}`} onClick={() => toggleOrder(order.order_id)}>
                            <img src={order.product_image} alt={order.product_name} className="product-image" />
                            <div className="order-details">
                                <p className="product-name">{order.product_name}</p>
                                <div className="order-info">
                                    <span className="order-id"> Order Number: {order.order_id}</span>
                                    {/* <span className="order-price"> {(order.price + (order.price * TAX_RATE)).toFixed(2)}</span> */}
                                    <span className="order-price">Total: ${(parseFloat(order.price * order.quantity) + (parseFloat(order.price * order.quantity) * TAX_RATE)).toFixed(2)}</span>

                                </div>
                                <div className="status">Quantity: {order.quantity}</div>
                                <div className="status">Status: {getStatusMessage(order.status)}</div>
                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div className="progress-bar-completed" style={{ width: `${getProgressPercentage(order.status)}%` }}></div>
                                    </div>
                                    <div className="progress-stages">
                                        <div className="progress-stage left">Ordered</div>
                                        <div className="progress-stage">Processed</div>
                                        <div className="progress-stage">Shipped</div>
                                        <div className="progress-stage">Out for Delivery</div>
                                        <div className="progress-stage right">Delivered</div>
                                    </div>
                                </div>
                                {expandedOrderId === order.order_id && (
                                    <>
                                        <div className="order-details-flex">
                                            <div className="status-details">
                                                <p>Ordered</p>
                                                <p>Processed</p>
                                                <p>Shipped</p>
                                                <p>Out for Delivery</p>
                                                <p>Delivered</p>
                                            </div>
                                            <div className="date-details">
                                                <p>{formatDate(order.order_date)}</p>
                                                <p>{formatDate(order.processed_date)}</p>
                                                <p>{formatDate(order.shipped_date)}</p>
                                                <p>{formatDate(order.out_for_delivery_date)}</p>
                                                <p>{formatDate(order.delivered_date)}</p>
                                            </div>
                                            <div className="payment-address-details">
                                                <div className="payment-details-flex">Tracking Number: {order.order_item_id}</div>
                                                <div className="payment-details-flex">Payment: {order.card_type} -  {`${order.card_number.slice(0, 4)} **** **** ${order.card_number.slice(-4)}`}</div>
                                                <div className="address-details-flex">Shipping Address: {order.address_line}, {order.city}, {order.state}, {order.postal_code}</div>
                                                <div className="address-details-flex">Order Total: {order.total_price}</div>
                                            </div>
                                        </div>
                                    </>
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
