import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/orderService';
import CustomerNavbar from './CustomerNavbar';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <HStack justify="space-between" width="100%" py={2}>
      <VStack align="start" flex={1}>
        <Text fontWeight="bold">{item.name}</Text>
        <Text color="gray.600">${item.price.toFixed(2)} each</Text>
      </VStack>
      <HStack spacing={4}>
        <NumberInput
          size="sm"
          maxW={20}
          min={1}
          value={item.quantity}
          onChange={(value) => onUpdateQuantity(item.id, parseInt(value))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Text>
        <IconButton
          icon={<FaTrash />}
          colorScheme="red"
          variant="ghost"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        />
      </HStack>
    </HStack>
  );
};

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const toast = useToast();
  const tableId = sessionStorage.getItem('tableId');

  const handlePlaceOrder = async () => {
    if (!tableId) {
      toast({
        title: 'Error',
        description: 'Please scan a table QR code first',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const order = {
        tableId,
        items: cartItems,
        total: getTotal(),
        status: 'pending',
      };

      await createOrder(order);
      clearCart();
      toast({
        title: 'Order placed successfully',
        description: 'Your order has been sent to the kitchen',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error placing order',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <CustomerNavbar />
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Your Order</Heading>
          {cartItems.length === 0 ? (
            <Text>Your cart is empty</Text>
          ) : (
            <>
              <VStack spacing={4} align="stretch">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </VStack>
              <Divider />
              <HStack justify="space-between">
                <Text fontSize="xl" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  ${getTotal().toFixed(2)}
                </Text>
              </HStack>
              <Button
                colorScheme="green"
                size="lg"
                width="100%"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default Cart; 