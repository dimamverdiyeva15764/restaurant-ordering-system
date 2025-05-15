import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByTable = async (tableId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/table/${tableId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order status:', error);
    throw error;
  }
}; 