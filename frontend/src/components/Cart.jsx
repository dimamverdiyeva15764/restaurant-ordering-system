import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    } else {
      removeFromCart(item.id);
    }
  };

  const handlePlaceOrder = () => {
    // TODO: Implement order placement logic
    toast.success('Order placed successfully!');
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Your cart is empty</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Cart
      </Typography>
      <List>
        {cartItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeFromCart(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.name}
                secondary={`$${(item.price * (item.quantity || 1)).toFixed(2)}`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.quantity || 1}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item, 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Total: ${calculateTotal().toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default Cart; 