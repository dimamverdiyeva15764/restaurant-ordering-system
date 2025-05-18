import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Container,
    Grid,
    Heading,
    Text,
    Button,
    Image,
    VStack,
    HStack,
    Badge,
    useToast,
    Spinner,
    Select,
    Flex,
    Tag,
    TagLabel,
    TagLeftIcon,
    Divider,
    useColorModeValue,
    Icon,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react';
import { FaShoppingCart, FaLeaf, FaSeedling, FaBreadSlice, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { GiChiliPepper } from 'react-icons/gi';

// Example menu data
const exampleMenuItems = [
    {
        id: 1,
        name: "Classic Margherita Pizza",
        description: "Fresh tomatoes, mozzarella, basil, and olive oil on our signature crust",
        price: 14.99,
        category: { id: 1, name: "Main Courses" },
        imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
        vegetarian: true,
        available: true,
        spicyLevel: 0
    },
    {
        id: 2,
        name: "Spicy Thai Curry",
        description: "Aromatic curry with coconut milk, vegetables, and your choice of protein",
        price: 16.99,
        category: { id: 1, name: "Main Courses" },
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
        vegetarian: false,
        available: true,
        spicyLevel: 3
    },
    {
        id: 3,
        name: "Mediterranean Salad",
        description: "Fresh mixed greens, feta cheese, olives, and house-made vinaigrette",
        price: 10.99,
        category: { id: 2, name: "Starters" },
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
        vegetarian: true,
        vegan: true,
        available: true,
        spicyLevel: 0
    },
    {
        id: 4,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
        price: 8.99,
        category: { id: 3, name: "Desserts" },
        imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51",
        vegetarian: true,
        available: true,
        spicyLevel: 0
    },
    {
        id: 5,
        name: "Crispy Calamari",
        description: "Lightly battered calamari served with marinara sauce and lemon",
        price: 12.99,
        category: { id: 2, name: "Starters" },
        imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
        available: true,
        spicyLevel: 1
    },
    {
        id: 6,
        name: "Tiramisu",
        description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
        price: 7.99,
        category: { id: 3, name: "Desserts" },
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
        vegetarian: true,
        available: true,
        spicyLevel: 0
    },
    {
        id: 7,
        name: "Pad Thai",
        description: "Stir-fried rice noodles with tofu, shrimp, peanuts, and tamarind sauce",
        price: 15.99,
        category: { id: 1, name: "Main Courses" },
        imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
        available: true,
        spicyLevel: 2
    },
    {
        id: 8,
        name: "Fresh Spring Rolls",
        description: "Rice paper rolls with vegetables, herbs, and shrimp, served with peanut sauce",
        price: 9.99,
        category: { id: 2, name: "Starters" },
        imageUrl: "https://images.unsplash.com/photo-1553163675-71dd0e489f0f",
        available: true,
        glutenFree: true,
        spicyLevel: 0
    }
];

const exampleCategories = [
    { id: 1, name: "Main Courses" },
    { id: 2, name: "Starters" },
    { id: 3, name: "Desserts" }
];

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    
    const { isOpen: isCartOpen, onOpen: onCartOpen, onClose: onCartClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        fetchMenuData();
        // Get table number from session storage
        const storedTableNumber = sessionStorage.getItem('selectedTable');
        if (storedTableNumber) {
            setTableNumber(storedTableNumber);
        }
    }, []);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            const [menuResponse, categoriesResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/menu/items'),
                axios.get('http://localhost:8080/api/menu/categories/active')
            ]);
            
            const menuData = Array.isArray(menuResponse.data) ? menuResponse.data : [];
            const categoriesData = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
            
            // Sort categories by display order
            const sortedCategories = [...categoriesData].sort((a, b) => a.displayOrder - b.displayOrder);
            
            setMenuItems(menuData);
            setCategories(sortedCategories);
        } catch (error) {
            console.error('Error fetching menu:', error);
            toast({
                title: 'Error loading menu',
                description: 'Could not load menu items. Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setMenuItems([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category?.id === parseInt(selectedCategory));

    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
        toast({
            title: 'Added to cart',
            description: `${item.name} has been added to your cart`,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    const updateQuantity = (itemId, change) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + change;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean);
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const renderSpicyLevel = (level) => {
        return level > 0 && (
            <HStack spacing={1}>
                {[...Array(level)].map((_, i) => (
                    <Icon key={i} as={GiChiliPepper} color="red.500" />
                ))}
            </HStack>
        );
    };

    const handleConfirmOrder = async () => {
        if (!tableNumber) {
            toast({
                title: 'Table number required',
                description: 'Please enter your table number',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            // Create the order
            const orderData = {
                items: cart.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    specialInstructions: item.specialInstructions || '',
                    price: parseFloat(item.price),
                    itemName: item.name
                })),
                tableNumber: tableNumber.toString(),
                status: 'PENDING'
            };

            const response = await axios.post('http://localhost:8080/api/orders', orderData);
            const order = response.data;

            if (!order || !order.id) {
                throw new Error('Invalid order response from server');
            }

            toast({
                title: 'Order Confirmed!',
                description: 'Your order has been placed successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setCart([]);
            onConfirmClose();
            onCartClose();
            navigate(`/status?orderId=${order.id}`);
        } catch (err) {
            console.error('Error creating order:', err);
            toast({
                title: 'Error',
                description: 'Failed to create order. Please try again.',
                status: 'error',
                duration: 5000,
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
                <Flex justify="space-between" align="center">
                    <Box>
                        <Heading 
                            bgGradient="linear(to-r, teal.500, green.500)"
                            bgClip="text"
                            fontSize={{ base: "3xl", md: "4xl" }}
                        >
                            Our Menu
                        </Heading>
                        <Text color="gray.600" fontSize="lg">
                            Discover our carefully crafted dishes
                        </Text>
                    </Box>
                    <IconButton
                        icon={<FaShoppingCart />}
                        onClick={onCartOpen}
                        colorScheme="teal"
                        size="lg"
                        position="relative"
                    >
                        {cart.length > 0 && (
                            <Badge
                                position="absolute"
                                top="-1"
                                right="-1"
                                colorScheme="red"
                                borderRadius="full"
                                px={2}
                            >
                                {cart.length}
                            </Badge>
                        )}
                    </IconButton>
                </Flex>

                {categories.length > 0 && (
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        maxW="300px"
                        mx="auto"
                        size="lg"
                        bg={bgColor}
                        borderColor={borderColor}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                )}

                {filteredItems.length === 0 ? (
                    <Box textAlign="center" py={10}>
                        <Text fontSize="xl" color="gray.500">
                            No menu items available
                        </Text>
                    </Box>
                ) : (
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                        gap={6}
                    >
                        {filteredItems.map((item) => (
                            <Box
                                key={item.id}
                                bg={bgColor}
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="lg"
                                transition="transform 0.2s"
                                _hover={{ transform: 'translateY(-4px)' }}
                            >
                                <Box height="200px" overflow="hidden">
                                    <Image
                                        src={item.imageUrl || 'https://via.placeholder.com/400x300'}
                                        alt={item.name}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                        transition="transform 0.3s"
                                        _hover={{ transform: 'scale(1.1)' }}
                                        fallback={<Box bg="gray.200" height="100%" width="100%" />}
                                    />
                                </Box>
                                <Box p={4}>
                                    <VStack align="stretch" spacing={3}>
                                        <Flex justify="space-between" align="center">
                                            <Heading size="md">{item.name}</Heading>
                                            {renderSpicyLevel(item.spicyLevel)}
                                        </Flex>

                                        <Text color="gray.600" noOfLines={2}>
                                            {item.description}
                                        </Text>

                                        <HStack spacing={2}>
                                            {item.vegetarian && (
                                                <Tag colorScheme="green" size="sm">
                                                    <TagLeftIcon as={FaLeaf} />
                                                    <TagLabel>Vegetarian</TagLabel>
                                                </Tag>
                                            )}
                                            {item.vegan && (
                                                <Tag colorScheme="green" size="sm">
                                                    <TagLeftIcon as={FaSeedling} />
                                                    <TagLabel>Vegan</TagLabel>
                                                </Tag>
                                            )}
                                            {item.glutenFree && (
                                                <Tag colorScheme="purple" size="sm">
                                                    <TagLeftIcon as={FaBreadSlice} />
                                                    <TagLabel>Gluten Free</TagLabel>
                                                </Tag>
                                            )}
                                        </HStack>

                                        <Divider />

                                        <Flex justify="space-between" align="center">
                                            <Text fontWeight="bold" fontSize="xl" color="teal.600">
                                                ${item.price?.toFixed(2)}
                                            </Text>
                                            <Button
                                                colorScheme="teal"
                                                onClick={() => addToCart(item)}
                                                isDisabled={!item.available}
                                                size="sm"
                                            >
                                                Add to Cart
                                            </Button>
                                        </Flex>
                                    </VStack>
                                </Box>
                            </Box>
                        ))}
                    </Grid>
                )}
            </VStack>

            {/* Shopping Cart Drawer */}
            <Drawer
                isOpen={isCartOpen}
                placement="right"
                onClose={onCartClose}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Your Cart</DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={4} align="stretch">
                            {cart.length === 0 ? (
                                <Text color="gray.500" textAlign="center">
                                    Your cart is empty
                                </Text>
                            ) : (
                                cart.map(item => (
                                    <Box
                                        key={item.id}
                                        p={4}
                                        borderWidth={1}
                                        borderRadius="lg"
                                        position="relative"
                                    >
                                        <VStack align="stretch" spacing={2}>
                                            <Flex justify="space-between" align="center">
                                                <Heading size="sm">{item.name}</Heading>
                                                <IconButton
                                                    icon={<FaTrash />}
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    size="sm"
                                                    onClick={() => removeFromCart(item.id)}
                                                />
                                            </Flex>
                                            <Flex justify="space-between" align="center">
                                                <Text color="gray.600">
                                                    ${item.price.toFixed(2)} x {item.quantity}
                                                </Text>
                                                <HStack>
                                                    <IconButton
                                                        icon={<FaMinus />}
                                                        size="xs"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    />
                                                    <Text>{item.quantity}</Text>
                                                    <IconButton
                                                        icon={<FaPlus />}
                                                        size="xs"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    />
                                                </HStack>
                                            </Flex>
                                            <Text fontWeight="bold" textAlign="right">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Text>
                                        </VStack>
                                    </Box>
                                ))
                            )}
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth={1}>
                        <VStack width="100%" spacing={4}>
                            <Text fontWeight="bold" fontSize="xl">
                                Total: ${calculateTotal().toFixed(2)}
                            </Text>
                            <Button
                                colorScheme="teal"
                                width="100%"
                                onClick={onConfirmOpen}
                                isDisabled={cart.length === 0}
                            >
                                Proceed to Checkout
                            </Button>
                        </VStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* Confirmation Modal */}
            <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Order</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Text>Your selected table:</Text>
                            <Input
                                value={tableNumber}
                                isReadOnly
                                bg="gray.100"
                                fontWeight="bold"
                            />
                            <Box borderWidth={1} borderRadius="lg" p={4}>
                                <Text fontWeight="bold" mb={2}>Order Summary:</Text>
                                {cart.map(item => (
                                    <Flex key={item.id} justify="space-between" mb={2}>
                                        <Text>{item.name} x {item.quantity}</Text>
                                        <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                                    </Flex>
                                ))}
                                <Divider my={2} />
                                <Flex justify="space-between" fontWeight="bold">
                                    <Text>Total:</Text>
                                    <Text>${calculateTotal().toFixed(2)}</Text>
                                </Flex>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onConfirmClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="teal"
                            onClick={handleConfirmOrder}
                            isDisabled={!tableNumber || cart.length === 0}
                        >
                            Confirm Order
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default MenuPage; 