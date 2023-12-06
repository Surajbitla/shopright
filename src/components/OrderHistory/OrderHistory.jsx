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
    const hasOrders = filteredOrders.length>0;
    const noordersUrl = `${process.env.PUBLIC_URL}/${'images/noorders.jpg'}`;


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
            case 'Initiated':
                return 3;
            case 'Processed':
            case 'Picked Up':
                return 30;
            case 'Shipped':
            case 'Received':
                return 50;
            case 'Out for Delivery':
            case 'Refund Issued':
                return 70;
            case 'Delivered':
            case 'Refund Credited':
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
            case 'Cancelled Before Delivery':
            case 'Cancelled After Delivery':
                return 'Your order has been cancelled.';
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

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderForCancellation, setSelectedOrderForCancellation] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [customCancelReason, setCustomCancelReason] = useState('');

    const handleCancelClick = (order) => {
        setSelectedOrderForCancellation(order);
        console.log(order);
        setShowCancelModal(true);
        setCancelReason('');
        setCustomCancelReason('');
    };

    const cancelOrderItem = async () => {
        const finalReason = cancelReason === 'Other' ? customCancelReason : cancelReason;
        const orderItemId = selectedOrderForCancellation.order_item_id;
        try {
            await axios.post(`${apiUrl}/cancel-order-item`, { orderItemId: orderItemId });
            alert(`Order item cancelled for reason: ${finalReason}`);
            setShowCancelModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error cancelling order item:', error);
        }
    };

    const CancelOrderModal = () => {
        const orderStatus = selectedOrderForCancellation?.status || '';

        let cancellationMessage = '';
        switch (orderStatus) {
            case 'Ordered':
            case 'Processed':
            case 'Shipped':
                cancellationMessage = 'You will receive your refund within 2-3 working days.';
                break;
            case 'Out for Delivery':
                cancellationMessage = 'Product is Out for Delivery, Please do not open the product as this will guarantee a full refund. A delivery agent will come to pick up the order. You will receive a refund after we receive and check the product.';
                break;
            case 'Delivered':
                cancellationMessage = 'A delivery agent will come to pick up the order. You will get a refund only after we receive and check the product. If the product is in its original condition, you will get a full refund, otherwise a partial refund.';
                break;
            default:
                cancellationMessage = 'There was an issue with cancelling your order. Please contact customer service.';
        }
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <h3>Cancel Order</h3>
                    <p>Current Status: {orderStatus}</p>
                    <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                        <option value="">Select a reason</option>
                        <option value="Didn't like the product">Didn't like the product</option>
                        <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                        <option value="Order delayed">Order delayed</option>
                        <option value="Ordered by mistake">Ordered by mistake</option>
                        <option value="Other">Other</option>
                    </select>
                    {cancelReason === 'Other' && (
                        <textarea
                            // value={customCancelReason}
                            // onChange={(e) => setCustomCancelReason(e.target.value)}
                            placeholder="Please specify your reason"
                        ></textarea>
                    )}
                    <p>{cancellationMessage}</p>
                    <p>Total Refund: ${(parseFloat(selectedOrderForCancellation.price * selectedOrderForCancellation.quantity) + (parseFloat(selectedOrderForCancellation.price * selectedOrderForCancellation.quantity) * TAX_RATE)).toFixed(2)}</p>
                    <p>Refund will be processed to: {selectedOrderForCancellation.card_type} ending in {selectedOrderForCancellation.card_number.substr(-4)}</p>
                    <button onClick={cancelOrderItem}>Confirm Cancellation</button>
                    <button onClick={() => setShowCancelModal(false)}>Close</button>
                </div>
            </div>
        );
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
                            <option value="Cancelled Before Delivery">Cancelled Before Delivery</option>
                            <option value="Cancelled After Delivery">Cancelled After Delivery</option>

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
                {hasOrders ? (
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
                                <div className="order-info">
                                    <div className="status">Status: {getStatusMessage(order.status)}</div>
                                    {!(order.status === 'Cancelled After Delivery' || order.status === 'Cancelled Before Delivery') && (
                                        <button className="cancel-button-order-history" onClick={() => handleCancelClick(order)}>Cancel Order</button>
                                    )}
                                </div>
                                {(order.status === 'Cancelled After Delivery' || order.status === 'Cancelled Before Delivery') ? '' : (
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
                                    </div>)}
                                {expandedOrderId === order.order_id && (
                                    <>
                                        {order.status === 'Cancelled After Delivery' ? (
                                            <>
                                                <div className="progress-container">
                                                    <div className="progress-bar">
                                                        <div className="progress-bar-completed" style={{ width: `${getProgressPercentage(order.cancelled_status)}%` }}></div>
                                                    </div>
                                                    <div className="progress-stages">
                                                        <div className="progress-stage left">Initiated</div>
                                                        <div className="progress-stage">Picked Up</div>
                                                        <div className="progress-stage">Received</div>
                                                        <div className="progress-stage">Refund Issued</div>
                                                        <div className="progress-stage right">Refund Credited</div>
                                                    </div>
                                                </div>
                                                <div className="order-details-flex">
                                                    <div className="status-details">
                                                        <p>Initiated</p>
                                                        <p>Picked Up</p>
                                                        <p>Received</p>
                                                        <p>Refund Issued</p>
                                                        <p>Refund Credited</p>
                                                    </div>
                                                    <div className="date-details">
                                                        <p>{formatDate(order.initiated_date)}</p>
                                                        <p>{formatDate(order.picked_up_date)}</p>
                                                        <p>{formatDate(order.received_date)}</p>
                                                        <p>{formatDate(order.refund_issued_date)}</p>
                                                        <p>{formatDate(order.refund_credited_date)}</p>
                                                    </div>
                                                    <div className="payment-address-details">
                                                        <div className="payment-details-flex">Tracking Number: {order.order_item_id}</div>
                                                        <div className="payment-details-flex">Refund will be processed: {order.card_type} -  {`${order.card_number.slice(0, 4)} **** **** ${order.card_number.slice(-4)}`}</div>
                                                        <div className="address-details-flex">Pickup Address: {order.address_line}, {order.city}, {order.state}, {order.postal_code}</div>
                                                        <div className="address-details-flex">Refund Total: ${(parseFloat(order.price * order.quantity) + (parseFloat(order.price * order.quantity) * TAX_RATE)).toFixed(2)}</div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : order.status === 'Cancelled Before Delivery' ? (
                                            <>
                                                <div className="payment-details-flex">Refund has been credited, it will reflect in your payment method 2-3 business days</div>
                                                <div className="payment-details-flex">Tracking Number: {order.order_item_id}</div>
                                                <div className="payment-details-flex">Refund is processed to: {order.card_type} -  {`${order.card_number.slice(0, 4)} **** **** ${order.card_number.slice(-4)}`}</div>
                                                <div className="address-details-flex">Refund Total: ${(parseFloat(order.price * order.quantity) + (parseFloat(order.price * order.quantity) * TAX_RATE)).toFixed(2)}</div>
                                            </>
                                        ) :
                                            (
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
                                            )}
                                    </>
                                )}

                            </div>
                        </div>
                    ))}
                </div>)
                :(
                    <div className="no-orders"><img src={noordersUrl} alt="No products found" /></div>
                )}
            </div>
            {/* Modal for canceling order */}
            {showCancelModal && <CancelOrderModal />}
        </>
    );
};

export default OrderHistory;
