import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import './Admin.css';


const Admin = () => {
    const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [selectedOrderItem, setSelectedOrderItem] = useState('');
    const [newStatus, setNewStatus] = useState('');

    const [dateFields, setDateFields] = useState({
        processed_date: '',
        shipped_date: '',
        out_for_delivery_date: '',
        delivered_date: ''
    });

    useEffect(() => {
        axios.get(`${apiUrl}/api/users`).then(response => {
            setUsers(response.data);
        });
    }, []);

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        if (userId) {
            axios.get(`${apiUrl}/api/orders/user/${userId}`).then(response => {
                setOrders(response.data);
            });
        }
    };

    const handleOrderChange = (e) => {
        const orderId = e.target.value;
        setSelectedOrder(orderId);
        if (orderId) {
            axios.get(`${apiUrl}/api/order-items/${orderId}`).then(response => {
                setOrderItems(response.data);
            });
        }
    };

    const handleOrderItemChange = (e) => {
        setSelectedOrderItem(e.target.value);
    };

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleDateChange = (e) => {
        setDateFields({ ...dateFields, [e.target.name]: e.target.value });
    };

    const handleUpdateOrderItem = () => {
        axios.post(`${apiUrl}/api/update-order-item`, {
            orderItemId: selectedOrderItem,
            newStatus: newStatus,
            dateFields: dateFields
        }).then(() => {
            alert('Order item updated successfully');
            // Additional logic to refresh the list or UI elements
        }).catch(err => {
            alert('Error updating order item');
            console.error(err);
        });
    };

    return (
        <div className='admin-container'>
            <h1>Admin Order Management</h1>
            <div>
                <label>User: </label>
                <select value={selectedUser} onChange={handleUserChange}>
                    <option value="">Select a User</option>
                    {users.map(user => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
                </select>
            </div>
            <div>
                <label>Order: </label>
                <select value={selectedOrder} onChange={handleOrderChange}>
                    <option value="">Select an Order</option>
                    {orders.map(order => <option key={order.order_id} value={order.order_id}>Order #{order.order_id}</option>)}
                </select>
            </div>
            <div>
                <label>Order Item: </label>
                <select value={selectedOrderItem} onChange={handleOrderItemChange}>
                    <option value="">Select an Order Item</option>
                    {orderItems.map(item => <option key={item.order_item_id} value={item.order_item_id}>Item ID {item.order_item_id} - Product ID {item.product_id}</option>)}
                </select>
            </div>
            <div>
                <label>Status: </label>
                <select value={newStatus} onChange={handleStatusChange}>
                    <option value="">Select Status</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Processed">Processed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>
            <div>
                <label>Processed Date: </label>
                <input type="date" name="processed_date" value={dateFields.processed_date} onChange={handleDateChange} />
                <label>Shipped Date: </label>
                <input type="date" name="shipped_date" value={dateFields.shipped_date} onChange={handleDateChange} />
                <label>Out for Delivery Date: </label>
                <input type="date" name="out_for_delivery_date" value={dateFields.out_for_delivery_date} onChange={handleDateChange} />
                <label>Delivered Date: </label>
                <input type="date" name="delivered_date" value={dateFields.delivered_date} onChange={handleDateChange} />
            </div>
            <button onClick={handleUpdateOrderItem}>Update Order Item</button>
        </div>
    );
};

export default Admin;
