import React, { useEffect } from 'react';
import { useOrder } from '../context/OrderContext.js';
import {
    Box,
    Container,
    Heading,
    VStack,
    Text,
    Badge,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    List,
    ListItem,
    Divider
} from '@chakra-ui/react';

const OrderStatusPage = () => {
    const { currentOrder, loading, error, getOrderById } = useOrder();

    useEffect(() => {
        // In a real application, you would get the order ID from URL params or context
        if (!currentOrder) {
            getOrderById(1); // Example order ID
        }
    }, [currentOrder, getOrderById]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'yellow';
            case 'IN_PREPARATION':
                return 'blue';
            case 'READY':
                return 'green';
            case 'DELIVERED':
                return 'gray';
            default:
                return 'gray';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxW="container.md" py={8}>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </Container>
        );
    }

    if (!currentOrder) {
        return (
            <Container maxW="container.md" py={8}>
                <Alert status="info">
                    <AlertIcon />
                    <AlertTitle>No Order Found</AlertTitle>
                    <AlertDescription>
                        There is no active order to display.
                    </AlertDescription>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading textAlign="center">Order Status</Heading>
                
                <Box borderWidth="1px" borderRadius="lg" p={6}>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Order #{currentOrder.orderNumber}
                            </Text>
                            <Badge colorScheme={getStatusColor(currentOrder.status)}>
                                {currentOrder.status.replace('_', ' ')}
                            </Badge>
                        </Box>

                        <Divider />

                        <Box>
                            <Text fontWeight="bold" mb={2}>Order Items:</Text>
                            <List spacing={2}>
                                {currentOrder.items.map((item, index) => (
                                    <ListItem key={index}>
                                        <Text>
                                            {item.quantity}x {item.itemName} - ${item.price.toFixed(2)}
                                        </Text>
                                        {item.specialInstructions && (
                                            <Text fontSize="sm" color="gray.600">
                                                Note: {item.specialInstructions}
                                            </Text>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Divider />

                        <Box>
                            <Text fontWeight="bold">Table Number: {currentOrder.tableNumber}</Text>
                            {currentOrder.waiter && (
                                <Text>Waiter: {currentOrder.waiter.fullName}</Text>
                            )}
                        </Box>

                        <Box>
                            <Text fontWeight="bold">Order Timeline:</Text>
                            <VStack align="stretch" spacing={2} mt={2}>
                                <Text fontSize="sm">
                                    Ordered: {new Date(currentOrder.createdAt).toLocaleString()}
                                </Text>
                                {currentOrder.readyAt && (
                                    <Text fontSize="sm">
                                        Ready: {new Date(currentOrder.readyAt).toLocaleString()}
                                    </Text>
                                )}
                                {currentOrder.deliveredAt && (
                                    <Text fontSize="sm">
                                        Delivered: {new Date(currentOrder.deliveredAt).toLocaleString()}
                                    </Text>
                                )}
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default OrderStatusPage; 