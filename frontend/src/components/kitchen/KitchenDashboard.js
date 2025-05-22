import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
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
    Spinner,
    useToast
} from '@chakra-ui/react';
import LogoutButton from '../common/LogoutButton.js';

const KitchenDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const toast = useToast();

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    const connectWebSocket = () => {
        try {
            console.log('Connecting to WebSocket...');
            const socket = new SockJS('http://localhost:8080/ws');
            const client = Stomp.over(socket);

            client.debug = (str) => {
                console.log('STOMP Debug:', str);
            };

            const onConnect = (frame) => {
                console.log('WebSocket connected:', frame);
                setLoading(false);

                // Subscribe to active orders
                client.subscribe('/app/kitchen/active-orders', (message) => {
                    try {
                        const activeOrders = JSON.parse(message.body);
                        console.log('Received active orders:', activeOrders);
                        setOrders(activeOrders);
                    } catch (error) {
                        console.error('Error parsing active orders:', error);
                    }
                });

                // Subscribe to new orders
                client.subscribe('/topic/orders/new', (message) => {
                    try {
                        const newOrder = JSON.parse(message.body);
                        console.log('Received new order:', newOrder);
                        
                        setOrders(prevOrders => {
                            // More robust deduplication check
                            const orderExists = prevOrders.some(order => 
                                order.id === newOrder.id || 
                                order.orderNumber === newOrder.orderNumber
                            );
                            
                            if (orderExists) {
                                console.log('Order already exists, skipping:', newOrder.id);
                                return prevOrders;
                            }
                            
                            // Ensure new order has proper initial state
                            const processedOrder = {
                                ...newOrder,
                                status: 'PENDING',
                                createdAt: newOrder.createdAt || new Date().toISOString()
                            };
                            
                            return [...prevOrders, processedOrder];
                        });
                        
                        toast({
                            title: 'New Order',
                            description: `Order #${newOrder.orderNumber} from Table ${newOrder.tableNumber}`,
                            status: 'info',
                            duration: 5000,
                            isClosable: true,
                        });
                    } catch (error) {
                        console.error('Error handling new order:', error);
                    }
                });

                // Subscribe to status updates
                client.subscribe('/topic/kitchen/status', (message) => {
                    try {
                        const update = JSON.parse(message.body);
                        console.log('Received status update:', update);
                        setOrders(prevOrders => {
                            // Remove order if it's delivered
                            if (update.status === 'DELIVERED') {
                                return prevOrders.filter(order => order.id !== update.id);
                            }
                            // Update order status
                            return prevOrders.map(order => 
                                order.id === update.id ? { ...order, ...update } : order
                            );
                        });
                    } catch (error) {
                        console.error('Error handling status update:', error);
                    }
                });

                setStompClient(client);
            };

            const onError = (error) => {
                console.error('WebSocket connection error:', error);
                setError('Failed to connect to WebSocket');
                setLoading(false);
                if (stompClient) {
                    try {
                        stompClient.disconnect();
                    } catch (e) {
                        console.error('Error during disconnect:', e);
                    }
                }
                setTimeout(connectWebSocket, 5000);
            };

            client.connect({
                'heart-beat': '10000,10000',
                'accept-version': '1.1,1.2'
            }, onConnect, onError);

        } catch (error) {
            console.error('Error in connectWebSocket:', error);
            setError('Failed to initialize WebSocket connection');
            setLoading(false);
            setTimeout(connectWebSocket, 5000);
        }
    };

    const updateOrderStatus = (orderId, status) => {
        if (!stompClient || !stompClient.connected) {
            toast({
                title: 'Connection Error',
                description: 'Not connected to WebSocket',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const payload = {
            orderId: orderId,
            status: status
        };

        stompClient.send('/app/kitchen/update-status', {}, JSON.stringify(payload));
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="teal.500" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={6} textAlign="center">
                <Text color="red.500" fontSize="lg">{error}</Text>
            </Box>
        );
    }

    return (
        <Box p={6} bg="gray.50" minH="100vh" position="relative">
            <LogoutButton />
            <Heading mb={8} textAlign="center" color="teal.600">Kitchen Dashboard</Heading>
            {orders.length === 0 ? (
                <Text textAlign="center" fontSize="lg">No active orders</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {orders.map((order) => (
                        <Box key={order.id} bg="white" p={6} borderRadius="lg" boxShadow="md">
                            <Flex justify="space-between" align="flex-start" mb={4}>
                                <Box>
                                    <Heading size="md">Order #{order.orderNumber}</Heading>
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

                            <Stack spacing={2}>
                                {order.items?.map((item, index) => (
                                    <Box key={index}>
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">
                                                {item.quantity}x {item.itemName}
                                            </Text>
                                            <Text color="gray.600">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Text>
                                        </Flex>
                                        {item.specialInstructions && (
                                            <Text fontSize="sm" color="gray.500" ml={4}>
                                                Note: {item.specialInstructions}
                                            </Text>
                                        )}
                                    </Box>
                                ))}
                            </Stack>

                            <Divider my={4} />

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