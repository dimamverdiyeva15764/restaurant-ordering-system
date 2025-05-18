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
    Badge,
    Image,
    Flex,
    Tag,
    TagLabel,
    TagLeftIcon,
    Divider,
    useColorModeValue,
    Icon,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    IconButton,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react';
import { FaLeaf, FaSeedling, FaBreadSlice, FaShoppingCart, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
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
    const [menuItems, setMenuItems] = useState(exampleMenuItems);
    const [categories, setCategories] = useState(exampleCategories);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState('');
    const { createOrder, error: orderError } = useOrder();
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen: isCartOpen, onOpen: onCartOpen, onClose: onCartClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // Filter menu items by category
    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category.id === parseInt(selectedCategory));

    const renderSpicyLevel = (level) => {
        return level > 0 && (
            <HStack spacing={1}>
                {[...Array(level)].map((_, i) => (
                    <Icon key={i} as={GiChiliPepper} color="red.500" />
                ))}
            </HStack>
        );
    };

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
            const orderData = {
                items: cart.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    specialInstructions: '',
                    price: item.price,
                    itemName: item.name
                })),
                tableNumber: tableNumber
            };
            
            await createOrder(orderData);
            toast({
                title: 'Order Confirmed!',
                description: 'Your order has been sent to the kitchen',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setCart([]);
            onConfirmClose();
            onCartClose();
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
                <Flex justify="space-between" align="center">
                    <Box>
                        <Heading 
                            mb={2}
                            bgGradient="linear(to-r, teal.500, blue.500)"
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
                            <Box
                                height="200px"
                                overflow="hidden"
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width="100%"
                                    height="100%"
                                    objectFit="cover"
                                    transition="transform 0.3s"
                                    _hover={{ transform: 'scale(1.1)' }}
                                />
                            </Box>
                            
                            <Box p={6}>
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
                                            ${item.price.toFixed(2)}
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
                        {cart.length === 0 ? (
                            <Text>Your cart is empty</Text>
                        ) : (
                            <VStack spacing={4} align="stretch">
                                {cart.map(item => (
                                    <Box
                                        key={item.id}
                                        p={4}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        bg={bgColor}
                                    >
                                        <Flex justify="space-between" align="center">
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="bold">{item.name}</Text>
                                                <Text color="teal.600">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Text>
                                            </VStack>
                                            <HStack>
                                                <IconButton
                                                    icon={<FaMinus />}
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                />
                                                <Text>{item.quantity}</Text>
                                                <IconButton
                                                    icon={<FaPlus />}
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                />
                                                <IconButton
                                                    icon={<FaTrash />}
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={() => removeFromCart(item.id)}
                                                />
                                            </HStack>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </DrawerBody>

                    <DrawerFooter>
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
                    <ModalHeader>Confirm Your Order</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Text>Please enter your table number:</Text>
                            <Input
                                placeholder="Table Number"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                            />
                            <Text fontWeight="bold">
                                Total Amount: ${calculateTotal().toFixed(2)}
                            </Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onConfirmClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="teal" onClick={handleConfirmOrder}>
                            Confirm Order
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default MenuPage; 