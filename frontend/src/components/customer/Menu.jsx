import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import { useCart } from '../../context/CartContext';
import { getMenuItems } from '../../services/menuService';
import CustomerNavbar from './CustomerNavbar';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      shadow="sm"
      _hover={{ shadow: 'md' }}
    >
      <Image
        src={item.imageUrl || 'default-food-image.jpg'}
        alt={item.name}
        height="200px"
        width="100%"
        objectFit="cover"
      />
      <VStack align="start" mt={2} spacing={2}>
        <Heading size="md">{item.name}</Heading>
        <Text color="gray.600">{item.description}</Text>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="bold">${item.price.toFixed(2)}</Text>
          <Button colorScheme="blue" onClick={() => onAddToCart(item)}>
            Add to Order
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        toast({
          title: 'Error loading menu',
          description: 'Please try again later',
          status: 'error',
          duration: 3000,
        });
      }
    };
    fetchMenu();
  }, [toast]);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast({
      title: 'Added to order',
      description: `${item.name} has been added to your order`,
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <>
      <CustomerNavbar />
      <Container maxW="container.xl" py={8}>
        <Heading mb={8}>Our Menu</Heading>
        <Tabs isFitted variant="enclosed">
          <TabList mb={4}>
            {categories.map((category) => (
              <Tab key={category}>{category}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {categories.map((category) => (
              <TabPanel key={category}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </SimpleGrid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default Menu; 