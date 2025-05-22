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
    useToast,
    VStack
} from '@chakra-ui/react';
import LogoutButton from '../common/LogoutButton.js';
import axios from 'axios';

const WaiterDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [tables, setTables] = useState([]);
    const toast = useToast();

    useEffect(() => {
        connectWebSocket();
        fetchTables();
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    const fetchTables = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tables');
            const cleaningTables = response.data.filter(table => table.status === 'CLEANING');
            setTables(cleaningTables);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

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

                // Subscribe to ready orders
                client.subscribe('/topic/kitchen/ready', (message) => {
                    try {
                        const readyOrder = JSON.parse(message.body);
                        console.log('Received ready order:', readyOrder);
                        
                        setOrders(prevOrders => {
                            // Check if order exists and update it, or add if new
                            const orderIndex = prevOrders.findIndex(order => 
                                order.id === readyOrder.id || 
                                order.orderNumber === readyOrder.orderNumber
                            );
                            
                            if (orderIndex !== -1) {
                                // Update existing order
                                const updatedOrders = [...prevOrders];
                                updatedOrders[orderIndex] = {
                                    ...prevOrders[orderIndex],
                                    ...readyOrder,
                                    status: 'READY',
                                    readyAt: readyOrder.readyAt || new Date().toISOString()
                                };
                                return updatedOrders;
                            }
                            
                            // Add new ready order
                            const processedOrder = {
                                ...readyOrder,
                                status: 'READY',
                                readyAt: readyOrder.readyAt || new Date().toISOString()
                            };
                            
                            return [...prevOrders, processedOrder];
                        });
                        
                        toast({
                            title: 'Order Ready',
                            description: `Order #${readyOrder.orderNumber} for Table ${readyOrder.tableNumber} is ready for delivery`,
                            status: 'success',
                            duration: 5000,
                            isClosable: true,
                        });
                    } catch (error) {
                        console.error('Error handling ready order:', error);
                    }
                });

                // Subscribe to delivered orders to remove them from the list
                client.subscribe('/topic/orders/delivered', (message) => {
                    try {
                        const deliveredOrder = JSON.parse(message.body);
                        console.log('Order delivered:', deliveredOrder);
                        setOrders(prevOrders => 
                            prevOrders.filter(order => order.id !== deliveredOrder.id)
                        );
                    } catch (error) {
                        console.error('Error handling delivered order:', error);
                    }
                });

                // Get initial ready orders
                client.subscribe('/app/kitchen/ready-orders', (message) => {
                    try {
                        const readyOrders = JSON.parse(message.body);
                        console.log('Initial ready orders:', readyOrders);
                        setOrders(readyOrders);
                    } catch (error) {
                        console.error('Error parsing ready orders:', error);
                    }
                });

                setStompClient(client);
            };

            const onError = (error) => {
                console.error('WebSocket connection error:', error);
                setError('Failed to connect to WebSocket');
                setLoading(false);
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

    const markAsDelivered = async (orderId, tableNumber) => {
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

        try {
            // Mark order as delivered
            const payload = {
                orderId: orderId,
                status: 'DELIVERED'
            };
            stompClient.send('/app/kitchen/update-status', {}, JSON.stringify(payload));

            // Update table status to CLEANING
            const tableResponse = await axios.get(`http://localhost:8080/api/tables/number/${tableNumber}`);
            const table = tableResponse.data;
            await axios.put(`http://localhost:8080/api/tables/${table.id}/status?status=CLEANING`);
            
            // Refresh tables list
            fetchTables();

            toast({
                title: 'Order Delivered',
                description: `Order delivered and table ${tableNumber} marked for cleaning`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating table status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update table status',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const markTableAsClean = async (tableId, tableNumber) => {
        try {
            await axios.put(`http://localhost:8080/api/tables/${tableId}/status?status=AVAILABLE`);
            setTables(prevTables => prevTables.filter(table => table.id !== tableId));
            
            toast({
                title: 'Table Available',
                description: `Table ${tableNumber} is now clean and available`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error marking table as clean:', error);
            toast({
                title: 'Error',
                description: 'Failed to update table status',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
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
            <Heading mb={8} textAlign="center" color="teal.600">Waiter Dashboard</Heading>
            
            {/* Tables that need cleaning */}
            {tables.length > 0 && (
                <Box mb={8}>
                    <Heading size="md" mb={4} color="blue.600">Tables Needing Cleaning</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {tables.map((table) => (
                            <Box
                                key={table.id}
                                bg="white"
                                p={4}
                                borderRadius="lg"
                                boxShadow="md"
                            >
                                <VStack align="stretch" spacing={3}>
                                    <Heading size="sm">Table {table.tableNumber}</Heading>
                                    <Text color="gray.600">Location: {table.location}</Text>
                                    <Button
                                        colorScheme="blue"
                                        onClick={() => markTableAsClean(table.id, table.tableNumber)}
                                    >
                                        Mark as Clean
                                    </Button>
                                </VStack>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
            )}

            {/* Ready Orders */}
            <Heading size="md" mb={4} color="teal.600">Ready Orders</Heading>
            {orders.length === 0 ? (
                <Text textAlign="center" fontSize="lg">No orders ready for delivery</Text>
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
                                    colorScheme="green"
                                    p={2}
                                    borderRadius="md"
                                >
                                    READY
                                </Badge>
                            </Flex>

                            <Divider my={4} />

                            <Stack spacing={3}>
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

                            <Button 
                                colorScheme="green"
                                width="100%"
                                onClick={() => markAsDelivered(order.id, order.tableNumber)}
                            >
                                Mark as Delivered
                            </Button>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default WaiterDashboard; 