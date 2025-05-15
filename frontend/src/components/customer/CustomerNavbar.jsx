import React from 'react';
import { Box, Flex, Button, Text, Badge } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CustomerNavbar = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box bg="white" boxShadow="sm" position="sticky" top={0} zIndex={1000}>
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        py={4}
        justify="space-between"
        align="center"
      >
        <Flex gap={4}>
          <Link to="/menu">
            <Button
              variant={location.pathname === '/menu' ? 'solid' : 'ghost'}
              colorScheme="blue"
            >
              Menu
            </Button>
          </Link>
          <Link to="/cart">
            <Button
              variant={location.pathname === '/cart' ? 'solid' : 'ghost'}
              colorScheme="blue"
              position="relative"
            >
              Cart
              {totalItems > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-2"
                  right="-2"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to="/order-status">
            <Button
              variant={location.pathname === '/order-status' ? 'solid' : 'ghost'}
              colorScheme="blue"
            >
              Order Status
            </Button>
          </Link>
        </Flex>
        <Text fontSize="sm" color="gray.600">
          Table #{sessionStorage.getItem('tableId') || 'Not Selected'}
        </Text>
      </Flex>
    </Box>
  );
};

export default CustomerNavbar; 