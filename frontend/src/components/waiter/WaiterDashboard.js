import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Button,
    Container,
    Heading,
    SimpleGrid,
    Text,
    Badge,
    VStack,
    HStack,
    useColorModeValue,
    Spinner,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    Divider
} from '@chakra-ui/react';

const WaiterDashboard = () => {
    const [orders, setOrders] = useState({
        readyOrders: [],
        activeOrders: [],
        completedOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const [readyRes, activeRes, completedRes] = await Promise.all([
                fetch(`http://localhost:8080/api/waiter/orders/${user.id}/ready`),
                fetch(`http://localhost:8080/api/waiter/orders/${user.id}/active`),
                fetch(`http://localhost:8080/api/waiter/orders/${user.id}/completed`)
            ]);

            const [readyData, activeData, completedData] = await Promise.all([
                readyRes.json(),
                activeRes.json(),
                completedRes.json()
            ]);

            setOrders({
                readyOrders: Array.isArray(readyData) ? readyData : [],
                activeOrders: Array.isArray(activeData) ? activeData : [],
                completedOrders: Array.isArray(completedData) ? completedData : []
            });
            setError('');
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        }
        setLoading(false);
    };

    const markOrderAsDelivered = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/waiter/orders/${orderId}/deliver`, {
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
            console.error('Error marking order as delivered:', error);
        }
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
                    Waiter Dashboard
                </Heading>

                {/* Stats Overview */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                    <StatCard
                        label="Ready for Delivery"
                        value={orders.readyOrders.length}
                        bg={cardBg}
                        accentColor="green.500"
                    />
                    <StatCard
                        label="Active Orders"
                        value={orders.activeOrders.length}
                        bg={cardBg}
                        accentColor="blue.500"
                    />
                    <StatCard
                        label="Completed Today"
                        value={orders.completedOrders.length}
                        bg={cardBg}
                        accentColor="gray.500"
                    />
                </SimpleGrid>

                {/* Ready Orders */}
                <Box mb={8}>
                    <Heading size="md" mb={4}>Orders Ready for Delivery</Heading>
                    {orders.readyOrders.length === 0 ? (
                        <Text textAlign="center" color="gray.500" py={4}>
                            No orders ready for delivery
                        </Text>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                            {orders.readyOrders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onDeliver={markOrderAsDelivered}
                                    bg={cardBg}
                                />
                            ))}
                        </SimpleGrid>
                    )}
                </Box>

                {/* Active Orders */}
                <Box mb={8}>
                    <Heading size="md" mb={4}>Active Orders</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {orders.activeOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                showDeliverButton={false}
                                bg={cardBg}
                            />
                        ))}
                    </SimpleGrid>
                </Box>
            </Container>
        </Box>
    );
};

const OrderCard = ({ order, onDeliver, showDeliverButton = true, bg }) => (
    <Box bg={bg} borderRadius="xl" boxShadow="xl" p={6}>
        <Flex justify="space-between" align="flex-start" mb={4}>
            <Box>
                <Heading size="md">Order #{order.orderNumber}</Heading>
                <Text color="gray.500">Table {order.tableNumber}</Text>
            </Box>
            <Badge
                colorScheme={order.status === 'READY' ? 'green' : 'blue'}
                borderRadius="full"
                px={3}
                py={1}
            >
                {order.status}
            </Badge>
        </Flex>

        <VStack align="stretch" spacing={4}>
            <Box>
                <Text fontWeight="semibold" mb={2}>Items:</Text>
                <VStack align="stretch" spacing={1}>
                    {order.items?.map((item, index) => (
                        <HStack key={index} justify="space-between">
                            <Text>{item.quantity}x {item.itemName}</Text>
                            <Text color="gray.500">${item.price?.toFixed(2)}</Text>
                        </HStack>
                    ))}
                </VStack>
            </Box>

            <Divider />

            <HStack justify="space-between">
                <Text fontWeight="semibold">Total:</Text>
                <Text fontWeight="bold">${order.totalPrice?.toFixed(2) || '0.00'}</Text>
            </HStack>

            {showDeliverButton && order.status === 'READY' && (
                <Button
                    colorScheme="green"
                    size="md"
                    onClick={() => onDeliver(order.id)}
                    width="100%"
                >
                    Mark as Delivered
                </Button>
            )}
        </VStack>
    </Box>
);

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

export default WaiterDashboard; 