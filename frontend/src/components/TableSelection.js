import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    SimpleGrid,
    Container,
    Heading,
    Button,
    VStack,
    useColorModeValue,
    Text,
    useToast,
} from '@chakra-ui/react';
import TableQRCode from './TableQRCode.js';

const TableSelection = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tables');
            // Sort tables by table number
            const sortedTables = response.data.sort((a, b) => {
                const numA = parseInt(a.tableNumber.replace('T', ''));
                const numB = parseInt(b.tableNumber.replace('T', ''));
                return numA - numB;
            });
            setTables(sortedTables);
        } catch (error) {
            console.error('Error fetching tables:', error);
            toast({
                title: 'Error',
                description: 'Failed to load tables. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSeatSelection = async (tableNumber) => {
        try {
            // Get table info
            const tableResponse = await axios.get(`http://localhost:8080/api/tables/number/${tableNumber}`);
            const table = tableResponse.data;

            if (table.status !== 'AVAILABLE') {
                toast({
                    title: 'Table not available',
                    description: 'Please select a different table',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            // Update table status to OCCUPIED
            await axios.put(`http://localhost:8080/api/tables/${table.id}/status?status=OCCUPIED`);
            
            // Store the table number in session storage
            sessionStorage.setItem('selectedTable', tableNumber.toString());
            
            toast({
                title: 'Table Selected',
                description: `You are now seated at table ${tableNumber}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Navigate to menu page
            navigate('/menu');
        } catch (error) {
            console.error('Error selecting table:', error);
            toast({
                title: 'Error',
                description: 'Failed to select table. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getTableStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'green';
            case 'OCCUPIED':
                return 'red';
            case 'RESERVED':
                return 'orange';
            case 'CLEANING':
                return 'blue';
            default:
                return 'gray';
        }
    };

    return (
        <Box minH="100vh" bg={bgColor} py={8}>
            <Container maxW="container.xl">
                <VStack spacing={8}>
                    <Heading
                        size="xl"
                        textAlign="center"
                        bgGradient="linear(to-r, teal.500, blue.500)"
                        bgClip="text"
                    >
                        Select Your Table
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                        {tables.map((table) => {
                            const tableNumber = table.tableNumber;
                            const isAvailable = table.status === 'AVAILABLE';
                            const statusColor = getTableStatusColor(table.status);

                            return (
                                <VStack
                                    key={tableNumber}
                                    spacing={4}
                                    align="center"
                                >
                                    <TableQRCode tableNumber={tableNumber} />
                                    <Text
                                        color={`${statusColor}.500`}
                                        fontWeight="bold"
                                    >
                                        Status: {table.status}
                                    </Text>
                                    <Text
                                        color="gray.600"
                                        fontSize="sm"
                                    >
                                        Location: {table.location}
                                    </Text>
                                    <Button
                                        colorScheme="teal"
                                        size="lg"
                                        width="full"
                                        onClick={() => handleSeatSelection(tableNumber)}
                                        isDisabled={!isAvailable}
                                    >
                                        {isAvailable ? `Seat at Table ${tableNumber}` : 'Table Not Available'}
                                    </Button>
                                </VStack>
                            );
                        })}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};

export default TableSelection; 