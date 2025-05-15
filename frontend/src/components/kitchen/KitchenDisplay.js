import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Heading, VStack, Spinner, Text } from '@chakra-ui/react';

const KitchenDisplay = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/kitchen/orders/pending');
            setOrders(res.data);
            setError('');
        } catch {
            setError('Failed to load orders');
        }
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        await axios.put(`http://localhost:8080/api/kitchen/orders/${id}/status?status=${status}`);
        fetchOrders();
    };

    useEffect(() => { fetchOrders(); }, []);

    if (loading) return <Spinner />;
    if (error) return <Text color="red.500">{error}</Text>;

    return (
        <Box>
            <Heading>Kitchen Orders</Heading>
            <VStack>
                {orders.map(order => (
                    <Box key={order.id} p={4} borderWidth={1} borderRadius="md" w="100%">
                        <Text>Table: {order.tableNumber}</Text>
                        <Button onClick={() => updateStatus(order.id, 'IN_PREPARATION')}>In Preparation</Button>
                        <Button onClick={() => updateStatus(order.id, 'READY')}>Ready</Button>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default KitchenDisplay; 