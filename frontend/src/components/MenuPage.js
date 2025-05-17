import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import axios from 'axios';
import {
    Box,
    Grid,
    Heading,
    VStack,
    Container,
    Text,
    Button,
    useToast,
    Spinner,
    Select,
    HStack,
    Badge
} from '@chakra-ui/react';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const { createOrder, error: orderError } = useOrder();
    const navigate = useNavigate();
    const toast = useToast();
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    // Fetch menu items and categories
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [menuResponse, categoriesResponse] = await Promise.all([
                    axios.get(`${API_URL}/menu/items`),
                    axios.get(`${API_URL}/menu/categories`)
                ]);
                setMenuItems(menuResponse.data);
                setCategories(categoriesResponse.data);
            } catch (err) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch menu items',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);

    // Filter menu items by category
    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category.id === parseInt(selectedCategory));

    // Handle order creation
    const handleOrder = async (item) => {
        try {
            const orderData = {
                items: [{
                    menuItemId: item.id,
                    quantity: 1,
                    specialInstructions: ''
                }],
                tableNumber: '1' // This should be dynamic in a real application
            };
            
            const order = await createOrder(orderData);
            toast({
                title: 'Order Created',
                description: 'Your order has been placed successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/status');
        } catch (err) {
            toast({
                title: 'Error',
                description: orderError || 'Failed to create order',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Heading textAlign="center">Our Menu</Heading>
                
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    maxW="300px"
                    mx="auto"
                >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Select>

                <Grid
                    templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
                    gap={6}
                >
                    {filteredItems.map(item => (
                        <Box
                            key={item.id}
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            p={4}
                            shadow="md"
                        >
                            {item.imageUrl && (
                                <Box
                                    height="200px"
                                    backgroundImage={`url(${item.imageUrl})`}
                                    backgroundSize="cover"
                                    backgroundPosition="center"
                                    mb={4}
                                />
                            )}
                            
                            <VStack align="stretch" spacing={2}>
                                <Heading size="md">{item.name}</Heading>
                                <Text color="gray.600">{item.description}</Text>
                                <HStack>
                                    {item.vegetarian && <Badge colorScheme="green">Vegetarian</Badge>}
                                    {item.vegan && <Badge colorScheme="green">Vegan</Badge>}
                                    {item.glutenFree && <Badge colorScheme="purple">Gluten Free</Badge>}
                                </HStack>
                                <Text fontWeight="bold" fontSize="lg">
                                    ${item.price.toFixed(2)}
                                </Text>
                                <Button
                                    colorScheme="blue"
                                    onClick={() => handleOrder(item)}
                                    isDisabled={!item.available}
                                >
                                    {item.available ? 'Order Now' : 'Not Available'}
                                </Button>
                            </VStack>
                        </Box>
                    ))}
                </Grid>
            </VStack>
        </Container>
    );
};

export default MenuPage; 