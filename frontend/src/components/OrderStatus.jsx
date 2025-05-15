import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { getOrderStatus } from '../services/orderService';
import io from 'socket.io-client';

const steps = ['Received', 'Preparing', 'Ready', 'Delivered'];

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:8080');

    const fetchOrderStatus = async () => {
      try {
        const orderData = await getOrderStatus(orderId);
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order status');
        setLoading(false);
      }
    };

    fetchOrderStatus();

    socket.on('connect', () => {
      socket.emit('join-order-room', orderId);
    });

    socket.on('order-status-update', (updatedOrder) => {
      if (updatedOrder.id === orderId) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'Order not found'}</Typography>
      </Box>
    );
  }

  const activeStep = steps.indexOf(order.status);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Order Status
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order #{order.id}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <List>
            {order.items.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${item.quantity}x ${item.name}`}
                  secondary={`$${(item.price * item.quantity).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>

          {order.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Special Instructions:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {order.notes}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">
              Total: ${order.total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderStatus; 