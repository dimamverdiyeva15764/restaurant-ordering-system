import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Badge,
  Divider,
  List,
  ListItem,
  HStack,
} from '@chakra-ui/react';
import { getOrdersByTable } from '../../services/orderService';
import CustomerNavbar from './CustomerNavbar';

const OrderStatusBadge = ({ status }) => {
  const colorScheme = {
    pending: 'yellow',
    preparing: 'blue',
    ready: 'green',
    delivered: 'gray',
    cancelled: 'red',
  }[status.toLowerCase()] || 'gray';

  return (
    <Badge colorScheme={colorScheme} fontSize="0.8em" px={2}>
      {status}
    </Badge>
  );
};

const OrderItem = ({ order }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="bold">Order #{order.id}</Text>
          <OrderStatusBadge status={order.status} />
        </HStack>
        <List spacing={2}>
          {order.items.map((item, index) => (
            <ListItem key={index}>
              <Text>
                {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </ListItem>
          ))}
        </List>
        <Divider />
        <HStack justify="space-between">
          <Text fontWeight="bold">Total:</Text>
          <Text fontWeight="bold">${order.total.toFixed(2)}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const tableId = sessionStorage.getItem('tableId');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!tableId) return;
      try {
        const tableOrders = await getOrdersByTable(tableId);
        setOrders(tableOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket(`ws://localhost:8080/ws/orders/${tableId}`);
    
    ws.onmessage = (event) => {
      const updatedOrder = JSON.parse(event.data);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    };

    return () => {
      ws.close();
    };
  }, [tableId]);

  if (!tableId) {
    return (
      <>
        <CustomerNavbar />
        <Container maxW="container.md" py={8}>
          <Text>Please scan a table QR code to view orders.</Text>
        </Container>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Your Orders</Heading>
          {orders.length === 0 ? (
            <Text>No orders found for this table</Text>
          ) : (
            orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))
          )}
        </VStack>
      </Container>
    </>
  );
};

export default OrderStatus; 