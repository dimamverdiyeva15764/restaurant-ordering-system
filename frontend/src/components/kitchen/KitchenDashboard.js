import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Heading, 
    Text, 
    SimpleGrid, 
    Flex, 
    Badge, 
    Button, 
    Stack,
    Divider,
} from '@chakra-ui/react';

const KitchenDashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        // Set up polling for new orders
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/kitchen/orders/active');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched orders:', data); // Debug log
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`http://localhost:8080/api/kitchen/orders/${orderId}/status?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <Box p={6} bg="gray.50" minH="100vh">
            <Heading mb={8} textAlign="center" color="teal.600">Kitchen Dashboard</Heading>
            {orders.length === 0 ? (
                <Text textAlign="center" fontSize="lg">No active orders</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {orders.map((order) => (
                        <Box key={order.id} bg="white" p={6} borderRadius="lg" boxShadow="md">
                            {/* Order Header */}
                            <Flex justify="space-between" align="flex-start" mb={4}>
                                <Box>
                                    <Heading size="md">Order #{order.orderNumber || order.id}</Heading>
                                    <Text color="gray.600">Table {order.tableNumber}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Ordered at: {formatTime(order.createdAt)}
                                    </Text>
                                </Box>
                                <Badge 
                                    colorScheme={
                                        order.status === 'PENDING' ? 'yellow' :
                                        order.status === 'IN_PREPARATION' ? 'blue' : 'green'
                                    }
                                    p={2}
                                    borderRadius="md"
                                >
                                    {order.status}
                                </Badge>
                            </Flex>

                            <Divider my={4} />

                            {/* Order Items */}
                            <Stack spacing={4}>
                                <Text fontWeight="bold">Items:</Text>
                                {order.items && order.items.length > 0 ? (
                                    <Stack spacing={2}>
                                        {order.items.map((item, index) => (
                                            <Box key={index} p={2} bg="gray.50" borderRadius="md">
                                                <Flex justify="space-between">
                                                    <Text>{item.quantity}x {item.itemName}</Text>
                                                    <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                                                </Flex>
                                                {item.specialInstructions && (
                                                    <Text 
                                                        fontSize="sm" 
                                                        color="red.500" 
                                                        mt={1}
                                                    >
                                                        Note: {item.specialInstructions}
                                                    </Text>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Text color="gray.500">No items in this order</Text>
                                )}
                            </Stack>

                            {/* Action Buttons */}
                            <Stack mt={4}>
                                {order.status === 'PENDING' && (
                                    <Button 
                                        colorScheme="blue"
                                        onClick={() => updateOrderStatus(order.id, 'IN_PREPARATION')}
                                    >
                                        Start Preparing
                                    </Button>
                                )}
                                {order.status === 'IN_PREPARATION' && (
                                    <Button 
                                        colorScheme="green"
                                        onClick={() => updateOrderStatus(order.id, 'READY')}
                                    >
                                        Mark as Ready
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default KitchenDashboard; 