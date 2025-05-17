import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    // Create new order
    const createOrder = async (orderData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/orders`, orderData);
            setOrders([...orders, response.data]);
            setCurrentOrder(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const updateOrderStatus = async (orderId, status) => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_URL}/orders/${orderId}/status?status=${status}`);
            setOrders(orders.map(order => 
                order.id === orderId ? response.data : order
            ));
            if (currentOrder?.id === orderId) {
                setCurrentOrder(response.data);
            }
            setError(null);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update order status');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get order by ID
    const getOrderById = async (orderId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/orders/${orderId}`);
            setCurrentOrder(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch order');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get all active orders
    const getActiveOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/orders/active`);
            setOrders(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch active orders');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Clear current order
    const clearCurrentOrder = () => {
        setCurrentOrder(null);
    };

    const value = {
        orders,
        currentOrder,
        loading,
        error,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getActiveOrders,
        clearCurrentOrder
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}; 