import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {
    Box,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useColorModeValue,
    Container,
    TableContainer,
    Spinner,
    Text
} from '@chakra-ui/react';

const ManagerDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        inPreparationOrders: 0,
        readyOrders: 0,
        deliveredOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stompClient, setStompClient] = useState(null);

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

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
            console.log('Attempting to connect to WebSocket...');
            const socket = new SockJS('http://localhost:8080/ws');
            const client = Stomp.over(socket);

            client.debug = (str) => {
                console.log('STOMP Debug:', str);
            };

            const onConnect = (frame) => {
                console.log('WebSocket connected:', frame);
                setLoading(false);
                
                // Subscribe to recent orders
                client.subscribe('/app/orders/recent', (message) => {
                    try {
                        const orders = JSON.parse(message.body);
                        console.log('Received recent orders:', orders);
                        setRecentOrders(orders);
                    } catch (error) {
                        console.error('Error parsing recent orders:', error);
                    }
                });

                // Subscribe to order statistics
                client.subscribe('/app/orders/stats', (message) => {
                    try {
                        const stats = JSON.parse(message.body);
                        console.log('Received order stats:', stats);
                        setStats(stats);
                    } catch (error) {
                        console.error('Error parsing order stats:', error);
                    }
                });

                // Subscribe to kitchen status updates
                client.subscribe('/topic/kitchen/status', (message) => {
                    try {
                        const orderUpdate = JSON.parse(message.body);
                        console.log('Received kitchen status update:', orderUpdate);
                        
                        // Update orders list with proper state transition
                        setRecentOrders(prevOrders => {
                            const orderIndex = prevOrders.findIndex(order => 
                                order.id === orderUpdate.id || 
                                order.orderNumber === orderUpdate.orderNumber
                            );
                            
                            if (orderIndex === -1) {
                                // If order doesn't exist in our list, add it
                                return [orderUpdate, ...prevOrders];
                            }
                            
                            // Update existing order with proper state transition
                            const updatedOrders = [...prevOrders];
                            const existingOrder = updatedOrders[orderIndex];
                            
                            // Store the previous status before updating
                            const previousStatus = existingOrder.status;
                            
                            updatedOrders[orderIndex] = {
                                ...existingOrder,
                                ...orderUpdate,
                                previousStatus: previousStatus,
                                updatedAt: orderUpdate.updatedAt || new Date().toISOString()
                            };
                            
                            return updatedOrders;
                        });

                        // Update stats with proper state transition
                        setStats(prevStats => {
                            const newStats = { ...prevStats };
                            
                            // If we have a previous status, decrement its counter
                            if (orderUpdate.previousStatus) {
                                const oldStatusKey = `${orderUpdate.previousStatus.toLowerCase()}Orders`;
                                if (oldStatusKey in newStats) {
                                    newStats[oldStatusKey] = Math.max(0, newStats[oldStatusKey] - 1);
                                }
                            }
                            
                            // Increment the counter for the new status
                            const newStatusKey = `${orderUpdate.status.toLowerCase()}Orders`;
                            if (newStatusKey in newStats) {
                                newStats[newStatusKey] = (newStats[newStatusKey] || 0) + 1;
                            }
                            
                            return newStats;
                        });
                    } catch (error) {
                        console.error('Error handling status update:', error);
                    }
                });

                // Subscribe to new orders
                client.subscribe('/topic/orders/new', (message) => {
                    try {
                        const newOrder = JSON.parse(message.body);
                        console.log('Received new order:', newOrder);
                        
                        // Update recent orders with deduplication
                        setRecentOrders(prevOrders => {
                            // Check if order already exists
                            const orderExists = prevOrders.some(order => 
                                order.id === newOrder.id || 
                                order.orderNumber === newOrder.orderNumber
                            );
                            
                            if (orderExists) {
                                console.log('Order already exists, skipping:', newOrder.orderNumber);
                                return prevOrders;
                            }
                            
                            // Since this is a new order, update the stats
                            setStats(prevStats => ({
                                ...prevStats,
                                totalOrders: prevStats.totalOrders + 1,
                                pendingOrders: prevStats.pendingOrders + 1
                            }));
                            
                            // Add new order at the beginning of the list
                            return [{
                                ...newOrder,
                                createdAt: newOrder.createdAt || new Date().toISOString()
                            }, ...prevOrders];
                        });
                    } catch (error) {
                        console.error('Error handling new order:', error);
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

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'yellow',
            IN_PREPARATION: 'blue',
            READY: 'green',
            DELIVERED: 'gray'
        };
        return colors[status] || 'gray';
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
        <Box minH="100vh" bgGradient="linear(to-br, teal.50, blue.50, purple.50)" p={6}>
            <Container maxW="container.xl">
                <Heading mb={8} color="teal.600" fontWeight="bold" textAlign="center">
                    Manager Dashboard
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={6} mb={8}>
                    <StatCard
                        label="Total Orders"
                        value={stats.totalOrders}
                        bg={cardBg}
                    />
                    <StatCard
                        label="Pending"
                        value={stats.pendingOrders}
                        bg={cardBg}
                        accentColor="yellow.500"
                    />
                    <StatCard
                        label="In Preparation"
                        value={stats.inPreparationOrders}
                        bg={cardBg}
                        accentColor="blue.500"
                    />
                    <StatCard
                        label="Ready"
                        value={stats.readyOrders}
                        bg={cardBg}
                        accentColor="green.500"
                    />
                    <StatCard
                        label="Delivered"
                        value={stats.deliveredOrders}
                        bg={cardBg}
                        accentColor="gray.500"
                    />
                </SimpleGrid>

                <Box bg={cardBg} borderRadius="xl" boxShadow="xl">
                    <Heading size="md" p={6} borderBottom="1px" borderColor={borderColor}>
                        Recent Orders
                    </Heading>
                    <TableContainer>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Order #</Th>
                                    <Th>Table</Th>
                                    <Th>Status</Th>
                                    <Th>Time</Th>
                                    <Th>Waiter</Th>
                                    <Th>Total</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {recentOrders.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">No recent orders</Td>
                                    </Tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <Tr key={order.id}>
                                            <Td fontWeight="medium">#{order.orderNumber}</Td>
                                            <Td>Table {order.tableNumber}</Td>
                                            <Td>
                                                <Badge
                                                    colorScheme={getStatusColor(order.status)}
                                                    borderRadius="full"
                                                    px={3}
                                                    py={1}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </Td>
                                            <Td>{new Date(order.createdAt).toLocaleTimeString()}</Td>
                                            <Td>{order.waiterName || 'N/A'}</Td>
                                            <Td>${order.totalPrice?.toFixed(2) || '0.00'}</Td>
                                        </Tr>
                                    ))
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </Box>
    );
};

const StatCard = ({ label, value, bg, accentColor }) => (
    <Box bg={bg} borderRadius="xl" boxShadow="xl" p={6}>
        <Stat>
            <StatLabel fontSize="lg" color="gray.500">{label}</StatLabel>
            <StatNumber fontSize="3xl" color={accentColor}>{value}</StatNumber>
        </Stat>
    </Box>
);

export default ManagerDashboard; 