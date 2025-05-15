import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch order statistics
            const statsResponse = await fetch('http://localhost:8080/api/manager/stats');
            if (!statsResponse.ok) throw new Error('Failed to fetch stats');
            const statsData = await statsResponse.json();
            setStats(statsData);

            // Fetch recent orders
            const ordersResponse = await fetch('http://localhost:8080/api/manager/orders/recent');
            if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
            const ordersData = await ordersResponse.json();
            console.log('Recent orders data:', ordersData); // Debug log
            setRecentOrders(Array.isArray(ordersData) ? ordersData : []);
            setError('');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            setRecentOrders([]); // Set empty array on error
        }
        setLoading(false);
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

                {/* Statistics Cards */}
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

                {/* Recent Orders Table */}
                <Box bg={cardBg} borderRadius="xl" boxShadow="xl" overflow="hidden">
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
    <Box bg={bg} borderRadius="lg" p={6} boxShadow="xl">
        <Stat>
            <StatLabel color="gray.500" fontSize="sm">{label}</StatLabel>
            <StatNumber fontSize="2xl" color={accentColor || 'gray.900'}>
                {value}
            </StatNumber>
        </Stat>
    </Box>
);

export default ManagerDashboard; 